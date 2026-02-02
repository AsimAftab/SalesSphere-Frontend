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
  documents?: unknown[];
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

// Backend user shape (loosely typed to handle varying API responses)
interface BackendUser {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  role?: string;
  phone?: string;
  position?: string;
  dateOfBirth?: string;
  panNumber?: string;
  citizenshipNumber?: string;
  gender?: string;
  address?: string;
  avatarUrl?: string;
  dateJoined?: string;
  lastActive?: string;
  isActive?: boolean;
  organizationId?: string;
  documents?: unknown[];
  createdAt?: string;
  updatedAt?: string;
}

// Response interfaces
interface GetUsersResponse {
  success: boolean;
  data: BackendUser[]; // Backend returns array of users
}

interface GetUserResponse {
  success: boolean;
  data: BackendUser; // Backend returns single user
}

interface UpdateUserResponse {
  success: boolean;
  data: BackendUser;
}

// Helper function to transform backend user to SystemUser
const transformBackendUser = (backendUser: BackendUser): SystemUser => {
  // Map role to position if position is not provided by backend
  const getPositionFromRole = (role: string): string => {
    const roleMap: Record<string, string> = {
      'superadmin': 'System Administrator',
      'super admin': 'System Administrator',
      'developer': 'Software Developer',
    };
    return roleMap[role?.toLowerCase()] || role || 'Staff';
  };

  return {
    id: backendUser._id || backendUser.id || '',
    _id: backendUser._id,
    name: backendUser.name,
    email: backendUser.email,
    role: backendUser.role || 'user',
    phone: backendUser.phone,
    position: backendUser.position || getPositionFromRole(backendUser.role || ''),
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
  } catch (error: unknown) {
    console.error('Failed to fetch all users:', error);
    const err = error as { response?: { data?: { message?: string } } };
    throw new Error(err.response?.data?.message || 'Failed to fetch all users');
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
  } catch (error: unknown) {
    console.error('Failed to fetch system users:', error);
    const err = error as { response?: { data?: { message?: string } } };
    throw new Error(err.response?.data?.message || 'Failed to fetch system users');
  }
};

/**
 * Get specific system user by ID with full details
 * GET /api/v1/users/system-user/:userId
 * Returns complete user data including gender, dateOfBirth, citizenshipNumber, documents, etc.
 * Used by super-admin to view other system users' full details
 */
export const getSystemUserById = async (id: string): Promise<SystemUser | null> => {
  try {
    // Use the system-user specific endpoint for full details
    const response = await api.get<GetUserResponse>(`/users/system-user/${id}`);

    if (!response.data || !response.data.data) {
      return null;
    }

    // Transform backend data to frontend format with all fields
    return transformBackendUser(response.data.data);
  } catch (error: unknown) {
    console.error('Failed to fetch system user details for ID %s:', id, error);
    const err = error as { response?: { data?: { message?: string } } };
    throw new Error(err.response?.data?.message || 'Failed to fetch system user details');
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
  } catch (error: unknown) {
    console.error('Failed to create system user:', error);
    const err = error as { response?: { data?: { message?: string } } };
    throw new Error(err.response?.data?.message || 'Failed to create user');
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
  } catch (error: unknown) {
    console.error('Failed to update system user:', error);
    const err = error as { response?: { data?: { message?: string } } };
    throw new Error(err.response?.data?.message || 'Failed to update user');
  }
};

/**
 * Update system user details by Super Admin
 * PUT /api/v1/users/system-user/:userId
 * Used by super admins to edit other system users' details
 */
export const updateSystemUserByAdmin = async (userData: UpdateSystemUserRequest): Promise<SystemUser> => {
  try {
    const { id, ...updateData } = userData;
    const response = await api.put<UpdateUserResponse>(`/users/system-user/${id}`, updateData);

    if (!response.data || !response.data.data) {
      throw new Error('Invalid response from server');
    }

    return transformBackendUser(response.data.data);
  } catch (error: unknown) {
    console.error('Failed to update system user by admin:', error);
    const err = error as { response?: { data?: { message?: string } } };
    throw new Error(err.response?.data?.message || 'Failed to update user');
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
  } catch (error: unknown) {
    console.error('Failed to deactivate user:', error);
    const err = error as { response?: { data?: { message?: string } } };
    throw new Error(err.response?.data?.message || 'Failed to deactivate user');
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
  } catch (error: unknown) {
    console.error('Failed to update password:', error);
    const err = error as { response?: { data?: { message?: string } } };
    throw new Error(err.response?.data?.message || 'Failed to update password');
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

/**
 * Create new system user using FormData endpoint
 * POST /api/v1/users/system-user
 * This endpoint doesn't require password - it's auto-generated
 */
export const addSystemUser = async (userData: {
  name: string;
  email: string;
  phone: string;
  role: string;
  dateOfBirth?: string;
  citizenshipNumber?: string;
  gender?: string;
  address?: string;
}): Promise<SystemUser> => {
  try {
    // Create FormData object
    const formData = new FormData();
    formData.append('name', userData.name);
    formData.append('email', userData.email);
    formData.append('phone', userData.phone);
    formData.append('role', userData.role.toLowerCase()); // Ensure lowercase for backend

    // Add optional fields if provided
    if (userData.dateOfBirth) {
      formData.append('dateOfBirth', userData.dateOfBirth);
    }
    if (userData.citizenshipNumber) {
      formData.append('citizenshipNumber', userData.citizenshipNumber);
    }
    if (userData.gender) {
      formData.append('gender', userData.gender);
    }
    if (userData.address) {
      formData.append('address', userData.address);
    }

    // Post to the system-user endpoint
    const response = await api.post('/users/system-user', formData);

    if (!response.data) {
      throw new Error('Invalid response from server');
    }

    // Handle response structure
    const newUser = response.data.data || response.data.user || response.data;

    if (!newUser) {
      throw new Error('No user data in response');
    }

    return transformBackendUser(newUser);
  } catch (error: unknown) {
    console.error('Failed to add system user:', error);
    const err = error as { response?: { data?: { message?: string } } };
    throw new Error(err.response?.data?.message || 'Failed to add system user');
  }
};
