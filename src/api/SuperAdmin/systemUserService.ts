/**
 * System User Service
 * Handles API interactions for System Users (Superadmin & Developer).
 * Uses BaseRepository pattern for standardized CRUD operations.
 */
import api from '../api';
import { API_ENDPOINTS } from '../endpoints';
import { BaseRepository } from '../base';
import type { EndpointConfig } from '../base';
import { handleApiError } from '../errors';

// --- 1. Interface Definitions ---

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
 * System User (Frontend Model)
 * Represents a system-level user (Superadmin or Developer)
 */
export interface SystemUser {
  id: string;
  _id?: string; // Backward compatibility
  name: string;
  email: string;
  role?: 'superadmin' | 'developer';
  phone?: string;
  address?: string;
  gender?: string;
  dateOfBirth?: string;
  dob?: string; // Legacy field
  citizenshipNumber?: string;
  citizenship?: string; // Legacy field
  panNumber?: string;
  pan?: string; // Legacy field
  avatarUrl?: string;
  photoPreview?: string | null; // Legacy field
  dateJoined?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  position?: string; // Legacy field
  location?: string; // Legacy field
  organizationId?: string;
  documents?: SystemUserDocument[];
}

export type CreateSystemUserPayload = FormData;
export type UpdateSystemUserPayload = FormData;

// --- 2. Backend API Interface (Raw Shape) ---

interface ApiSystemUser {
  _id: string;
  name: string;
  email: string;
  role?: 'superadmin' | 'developer';
  phone?: string;
  address?: string;
  gender?: string;
  dateOfBirth?: string;
  citizenshipNumber?: string;
  panNumber?: string;
  avatarUrl?: string;
  dateJoined?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  organizationId?: string;
  documents?: SystemUserDocument[];
}

// --- 3. Mapper Logic ---

export class SystemUserMapper {
  static toFrontend(apiUser: ApiSystemUser): SystemUser {
    return {
      id: apiUser._id,
      _id: apiUser._id, // Backward compatibility
      name: apiUser.name,
      email: apiUser.email,
      role: apiUser.role,
      phone: apiUser.phone,
      address: apiUser.address,
      gender: apiUser.gender,
      dateOfBirth: apiUser.dateOfBirth,
      dob: apiUser.dateOfBirth, // Legacy alias
      citizenshipNumber: apiUser.citizenshipNumber,
      citizenship: apiUser.citizenshipNumber, // Legacy alias
      panNumber: apiUser.panNumber,
      pan: apiUser.panNumber, // Legacy alias
      avatarUrl: apiUser.avatarUrl,
      photoPreview: apiUser.avatarUrl, // Legacy alias
      dateJoined: apiUser.dateJoined,
      isActive: apiUser.isActive,
      createdAt: apiUser.createdAt,
      updatedAt: apiUser.updatedAt,
      position: apiUser.role, // Legacy alias
      organizationId: apiUser.organizationId,
      documents: apiUser.documents,
    };
  }

  /**
   * For FormData payloads, we pass through as-is
   * since the caller is responsible for building the FormData
   */
  static toPayload(data: FormData): FormData {
    return data;
  }
}

// --- 4. Endpoint Configuration ---

const SYSTEM_USER_ENDPOINTS: EndpointConfig = {
  BASE: API_ENDPOINTS.users.SYSTEM_USERS.BASE,
  DETAIL: API_ENDPOINTS.users.SYSTEM_USERS.DETAIL,
};

// --- 5. SystemUserRepositoryClass - Extends BaseRepository ---

class SystemUserRepositoryClass extends BaseRepository<
  SystemUser,
  ApiSystemUser,
  CreateSystemUserPayload,
  UpdateSystemUserPayload
> {
  protected readonly endpoints = SYSTEM_USER_ENDPOINTS;

  protected mapToFrontend(apiData: ApiSystemUser): SystemUser {
    return SystemUserMapper.toFrontend(apiData);
  }

  protected mapToPayload(data: FormData): FormData {
    return data;
  }

  // Override to add multipart/form-data header
  async create(data: CreateSystemUserPayload): Promise<SystemUser> {
    try {
      const response = await api.post(API_ENDPOINTS.users.SYSTEM_USERS.CREATE, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const item = this.extractSingleData(response.data);
      return this.mapToFrontend(item);
    } catch (error: unknown) {
      throw handleApiError(error, 'Failed to create system user');
    }
  }

  // Override to add multipart/form-data header
  async update(id: string, data: UpdateSystemUserPayload): Promise<SystemUser> {
    try {
      const response = await api.put(this.endpoints.DETAIL(id), data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const item = this.extractSingleData(response.data);
      return this.mapToFrontend(item);
    } catch (error: unknown) {
      throw handleApiError(error, 'Failed to update system user');
    }
  }

  // Override base methods to add error handling
  async getAll(): Promise<SystemUser[]> {
    try {
      return await super.getAll();
    } catch (error: unknown) {
      throw handleApiError(error, 'Failed to fetch system users');
    }
  }

  async getById(id: string): Promise<SystemUser> {
    try {
      return await super.getById(id);
    } catch (error: unknown) {
      throw handleApiError(error, 'Failed to fetch system user');
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      return await super.delete(id);
    } catch (error: unknown) {
      throw handleApiError(error, 'Failed to delete system user');
    }
  }

  // --- Entity-specific methods ---

  /**
   * Change system user password
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async changePassword(id: string, data: any): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.put<{ success: boolean; message: string }>(
        API_ENDPOINTS.users.PASSWORD(id),
        data
      );
      return response.data;
    } catch (error: unknown) {
      throw handleApiError(error, 'Failed to change password');
    }
  }

  /**
   * Upload documents for a system user
   */
  async uploadDocuments(
    userId: string,
    documents: File[]
  ): Promise<{ success: boolean; message: string; data: { filename: string; fileUrl: string }[] }> {
    try {
      const formData = new FormData();
      documents.forEach((file) => {
        formData.append('documents', file);
      });

      const response = await api.post<{
        success: boolean;
        message: string;
        data: { filename: string; fileUrl: string }[];
      }>(API_ENDPOINTS.users.SYSTEM_USERS.DOCUMENTS(userId), formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error: unknown) {
      throw handleApiError(error, 'Failed to upload documents');
    }
  }

  /**
   * Delete a document from a system user
   */
  async deleteDocument(userId: string, documentId: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.delete<{ success: boolean; message: string }>(
        API_ENDPOINTS.users.SYSTEM_USERS.DOCUMENT_DETAIL(userId, documentId)
      );
      return response.data;
    } catch (error: unknown) {
      throw handleApiError(error, 'Failed to delete document');
    }
  }
}

// Create singleton instance
const systemUserRepositoryInstance = new SystemUserRepositoryClass();

// --- 6. Public API - Service Object ---

export const systemUserService = {
  /**
   * Get all system users (Superadmin only)
   */
  getAll: () => systemUserRepositoryInstance.getAll(),

  /**
   * Get a specific system user by ID
   */
  getById: (id: string) => systemUserRepositoryInstance.getById(id),

  /**
   * Create a new system user
   */
  create: (data: CreateSystemUserPayload) => systemUserRepositoryInstance.create(data),

  /**
   * Update an existing system user
   */
  update: (id: string, data: UpdateSystemUserPayload) => systemUserRepositoryInstance.update(id, data),

  /**
   * Delete a system user
   */
  delete: (id: string) => systemUserRepositoryInstance.delete(id),

  /**
   * Change system user password
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  changePassword: (id: string, data: any) => systemUserRepositoryInstance.changePassword(id, data),

  /**
   * Upload documents for a system user
   */
  uploadDocuments: (userId: string, documents: File[]) =>
    systemUserRepositoryInstance.uploadDocuments(userId, documents),

  /**
   * Delete a document from a system user
   */
  deleteDocument: (userId: string, documentId: string) =>
    systemUserRepositoryInstance.deleteDocument(userId, documentId),
};

// --- 7. Legacy Exports for Backward Compatibility ---

export const getSystemUserById = systemUserService.getById;

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
export type UpdateSystemUserRequest = any; // Legacy type for backward compat
