import api from '../api';

// Type Definitions
export interface SystemUser {
  id: string;
  _id?: string; // Backend uses _id
  name: string;
  email: string;
  password?: string; // Optional - not returned from backend
  role: string; // Changed to string to handle various roles
  phone?: string;
  position?: string;
  dob?: string;
  dateOfBirth?: string; // Backend uses dateOfBirth
  pan?: string;
  panNumber?: string; // Backend uses panNumber
  citizenship?: string;
  citizenshipNumber?: string; // Backend uses citizenshipNumber
  gender?: string;
  location?: string;
  address?: string; // Backend uses address
  photoPreview?: string | null;
  avatarUrl?: string; // Backend uses avatarUrl
  createdDate?: string;
  dateJoined?: string; // Backend uses dateJoined
  lastActive?: string;
  isActive: boolean; // Track if user has access to the system
  organizationId?: string;
  documents?: any[];
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateSystemUserRequest {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  address?: string;
  gender?: string;
  dateOfBirth?: string;
  panNumber?: string;
  citizenshipNumber?: string;
  isActive?: boolean;
}

export interface CreateSystemUserRequest {
  name: string;
  email: string;
  password: string;
  role: string;
  phone?: string;
  address?: string;
  gender?: string;
  dateOfBirth?: string;
  panNumber?: string;
  citizenshipNumber?: string;
}

// Response interfaces
interface GetUsersResponse {
  success: boolean;
  data: any[]; // Backend returns array of users
}

interface GetUserResponse {
  success: boolean;
  data: any; // Backend returns single user
}

interface UpdateUserResponse {
  success: boolean;
  data: any;
}

// Helper function to transform backend user to SystemUser
const transformBackendUser = (backendUser: any): SystemUser => {
  return {
    id: backendUser._id || backendUser.id,
    _id: backendUser._id,
    name: backendUser.name,
    email: backendUser.email,
    role: backendUser.role || 'user',
    phone: backendUser.phone,
    position: backendUser.position,
    dob: backendUser.dateOfBirth,
    dateOfBirth: backendUser.dateOfBirth,
    pan: backendUser.panNumber,
    panNumber: backendUser.panNumber,
    citizenship: backendUser.citizenshipNumber,
    citizenshipNumber: backendUser.citizenshipNumber,
    gender: backendUser.gender,
    location: backendUser.address,
    address: backendUser.address,
    photoPreview: backendUser.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(backendUser.name || 'User')}&size=300&background=3b82f6&color=fff`,
    avatarUrl: backendUser.avatarUrl,
    createdDate: backendUser.dateJoined || backendUser.createdAt,
    dateJoined: backendUser.dateJoined,
    lastActive: backendUser.lastActive || 'Never',
    isActive: backendUser.isActive !== false,
    organizationId: backendUser.organizationId,
    documents: backendUser.documents,
    createdAt: backendUser.createdAt,
    updatedAt: backendUser.updatedAt
  };
};


/**
 * Get all users from backend
 * GET /api/v1/users/
 */
export const getAllUsers = async (): Promise<SystemUser[]> => {
  try {
    const response = await api.get<GetUsersResponse>('/users');

    if (!response.data || !response.data.data) {
      return [];
    }

    // Transform backend users to frontend format
    return response.data.data.map(transformBackendUser);
  } catch (error: any) {
    console.error('Failed to fetch all users:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch all users');
  }
};

/**
 * Get all system users from backend
 * GET /api/v1/users/
 */
export const getAllSystemUsers = async (): Promise<SystemUser[]> => {
  try {
    const response = await api.get<GetUsersResponse>('/users');

    if (!response.data || !response.data.data) {
      return [];
    }

    // Transform backend users to frontend format
    const users = response.data.data.map(transformBackendUser);

    // Filter to only return system admins (superadmin and developer roles)
    return users.filter(user =>
      user.role?.toLowerCase() === 'superadmin' ||
      user.role?.toLowerCase() === 'super admin' ||
      user.role?.toLowerCase() === 'developer'
    );
  } catch (error: any) {
    console.error('Failed to fetch system users:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch system users');
  }
};

/**
 * Get specific system user by ID
 * Tries GET /api/v1/users/:userId first, falls back to system-overview
 */
export const getSystemUserById = async (id: string): Promise<SystemUser | null> => {
  try {
    // Try direct endpoint first
    const response = await api.get<GetUserResponse>(`/users/${id}`);

    if (!response.data || !response.data.data) {
      return null;
    }

    return transformBackendUser(response.data.data);
  } catch (error: any) {
    console.error('Direct fetch failed for user %s, trying system-overview:', id, error);

    // Fallback: fetch from system-overview endpoint
    try {
      const { getSystemOverview } = await import('./systemOverviewService');
      const overview = await getSystemOverview();

      // Find user in systemUsers list
      const user = overview.systemUsers.list.find(u => u.id === id || u._id === id);

      if (!user) {
        throw new Error('User not found');
      }

      // Transform to SystemUser format with all required fields
      return {
        id: user.id || user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone || '',
        position: '', // Not provided by API
        dob: '', // Not provided by API
        dateOfBirth: '', // Not provided by API
        pan: '', // Not provided by API
        panNumber: '', // Not provided by API
        citizenship: '', // Not provided by API
        citizenshipNumber: '', // Not provided by API
        gender: '', // Not provided by API
        location: user.address || '',
        address: user.address || '',
        photoPreview: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&size=300&background=3b82f6&color=fff`,
        avatarUrl: '',
        createdDate: user.createdAt,
        dateJoined: user.createdAt,
        lastActive: 'Never', // Not provided by API
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.createdAt,
      };
    } catch (fallbackError: any) {
      console.error('Fallback also failed for user %s:', id, fallbackError);
      throw new Error(fallbackError.message || 'Failed to fetch user');
    }
  }
};

/**
 * Create new system user (Super Admin or Developer)
 * POST /auth/register/systemadmin
 */
export const createSystemUser = async (userData: CreateSystemUserRequest): Promise<SystemUser> => {
  try {
    // Backend endpoint for system admin registration
    const response = await api.post('/auth/register/systemadmin', userData);

    if (!response.data) {
      throw new Error('Invalid response from server');
    }

    // Response structure: { status, token, user, organization }
    const newUser = response.data.user || response.data.data?.user;

    if (!newUser) {
      throw new Error('No user data in response');
    }

    return transformBackendUser(newUser);
  } catch (error: any) {
    console.error('Failed to create system user:', error);
    throw new Error(error.response?.data?.message || 'Failed to create user');
  }
};

/**
 * Update system user details
 * PUT /api/v1/users/:userId
 */
export const updateSystemUser = async (userData: UpdateSystemUserRequest): Promise<SystemUser> => {
  try {
    const { id, ...updateData } = userData;
    const response = await api.put<UpdateUserResponse>(`/users/${id}`, updateData);

    if (!response.data || !response.data.data) {
      throw new Error('Invalid response from server');
    }

    return transformBackendUser(response.data.data);
  } catch (error: any) {
    console.error('Failed to update system user:', error);
    throw new Error(error.response?.data?.message || 'Failed to update user');
  }
};

/**
 * Deactivate (soft delete) system user
 * DELETE /api/v1/users/:userId
 */
export const deactivateSystemUser = async (userId: string): Promise<boolean> => {
  try {
    await api.delete(`/users/${userId}`);
    return true;
  } catch (error: any) {
    console.error('Failed to deactivate user:', error);
    throw new Error(error.response?.data?.message || 'Failed to deactivate user');
  }
};

/**
 * Update user password
 * Note: This might need adjustment based on actual backend endpoint
 */
export const updateSystemUserPassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<boolean> => {
  try {
    await api.patch(`/users/${userId}/password`, {
      currentPassword,
      newPassword
    });
    return true;
  } catch (error: any) {
    console.error('Failed to update password:', error);
    throw new Error(error.response?.data?.message || 'Failed to update password');
  }
};

/**
 * Get system user statistics
 */
export const getSystemUserStats = async () => {
  try {
    const users = await getAllSystemUsers();
    const stats = {
      total: users.length,
      superAdmins: users.filter(u => u.role?.toLowerCase() === 'superadmin' || u.role?.toLowerCase() === 'super admin').length,
      developers: users.filter(u => u.role?.toLowerCase() === 'developer').length,
      active: users.filter(u => u.isActive).length,
      inactive: users.filter(u => !u.isActive).length
    };
    return stats;
  } catch (error) {
    console.error('Failed to get user stats:', error);
    return {
      total: 0,
      superAdmins: 0,
      developers: 0,
      active: 0,
      inactive: 0
    };
  }
};
