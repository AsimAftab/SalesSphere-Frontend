/**
 * System User Service
 * Handles API interactions for System Users (Superadmin & Developer).
 */
import api from '../api';
import { API_ENDPOINTS } from '../endpoints';

/**
 * System User Document
 * Represents uploaded documents for system users
 */
export interface SystemUserDocument {
  _id: string;
  fileName: string;
  fileUrl: string;
  uploadedAt: string;
  fileSize?: number;
  fileType?: string;
}

/**
 * System User
 * Represents a system-level user (Superadmin or Developer)
 */
export interface SystemUser {
  _id: string; // Required
  id?: string; // Legacy field for backward compatibility
  name: string;
  email: string;
  role?: 'superadmin' | 'developer';
  phone?: string;
  address?: string;
  gender?: string;
  dateOfBirth?: string; // ISO Date String
  dob?: string; // Legacy field for backward compatibility
  citizenshipNumber?: string;
  citizenship?: string; // Legacy field for backward compatibility
  panNumber?: string;
  pan?: string; // Legacy field for backward compatibility
  avatarUrl?: string;
  photoPreview?: string | null; // Legacy field for backward compatibility
  dateJoined?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string; // For profile page
  position?: string; // Legacy field for backward compatibility
  location?: string; // Legacy field for backward compatibility
  organizationId?: string; // For system user profile page
  documents?: SystemUserDocument[];
}

export type CreateSystemUserPayload = FormData; // Using FormData for file upload support
export type UpdateSystemUserPayload = FormData;

export const systemUserService = {
  /**
   * Get all system users (Superadmin only)
   */
  getAll: async () => {
    const response = await api.get<{ success: boolean; data: SystemUser[] }>(
      API_ENDPOINTS.users.SYSTEM_USERS.BASE
    );
    return response.data;
  },

  /**
   * Get a specific system user by ID
   */
  getById: async (id: string) => {
    const response = await api.get<{ success: boolean; data: SystemUser }>(
      API_ENDPOINTS.users.SYSTEM_USERS.DETAIL(id)
    );
    return response.data;
  },

  /**
   * Create a new system user
   */
  create: async (data: CreateSystemUserPayload) => {
    const response = await api.post<{ success: boolean; data: SystemUser }>(
      API_ENDPOINTS.users.SYSTEM_USERS.CREATE,
      data,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  /**
   * Update an existing system user
   */
  update: async (id: string, data: UpdateSystemUserPayload) => {
    const response = await api.put<{ success: boolean; data: SystemUser }>(
      API_ENDPOINTS.users.SYSTEM_USERS.DETAIL(id),
      data,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  /**
   * Delete a system user
   */
  delete: async (id: string) => {
    const response = await api.delete<{ success: boolean; message: string }>(
      API_ENDPOINTS.users.SYSTEM_USERS.DETAIL(id)
    );
    return response.data;
  },

  /**
   * Change system user password
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  changePassword: async (id: string, data: any) => {
    const response = await api.put<{ success: boolean; message: string }>(
      API_ENDPOINTS.users.PASSWORD(id),
      data
    );
    return response.data;
  }
};

// Legacy exports for backward compatibility with SystemUserProfilePage
export const getSystemUserById = systemUserService.getById;

// Legacy update functions with different signature for backward compatibility
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateSystemUserByAdmin = async (data: any) => {
  const id = data.id || data._id;
  return systemUserService.update(id, data);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateSystemUserPassword = async (userId: string, data: any) => {
  return systemUserService.update(userId, data);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type UpdateSystemUserRequest = any; // Legacy type - too loose for backward compat
