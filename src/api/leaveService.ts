// src/api/leaveService.ts
import api from './api';

/**
 * 1. Interface Segregation & Domain Models
 * Defines the contract for the UI layer.
 */
export interface UserInfo {
  id: string;
  name: string;
  email: string;
}

export type LeaveStatus = 'pending' | 'approved' | 'rejected';

export interface LeaveRequest {
  id: string;
  startDate: string;
  endDate: string | null;
  category: string;
  reason: string;
  leaveDays: number;
  status: LeaveStatus;
  rejectionReason?: string;
  createdBy: UserInfo;
  approvedBy?: UserInfo | null;
  approvedAt?: string | null;
  createdAt: string;
}

export interface CreateLeavePayload {
  startDate: string;
  endDate?: string;
  category: string;
  reason: string;
}

/**
 * 2. API Response Interfaces (DTOs)
 * Mirrors the raw data coming from the MongoDB/Mongoose backend.
 */
interface ApiUser {
  _id: string;
  name: string;
  email: string;
}

interface ApiLeaveResponse {
  _id: string;
  startDate: string;
  endDate?: string;
  category: string;
  reason: string;
  leaveDays: number;
  status: LeaveStatus;
  rejectionReason?: string;
  createdBy: ApiUser;
  approvedBy?: ApiUser;
  approvedAt?: string;
  createdAt: string;
}

/**
 * LeaveMapper - Transforms leave request data between backend API shape and frontend domain models.
 * Centralizes all data transformation logic for leave requests.
 */
class LeaveMapper {
  /**
   * Transforms a backend leave request response to frontend LeaveRequest model.
   * Handles date formatting, populated user fields, and provides fallbacks for missing data.
   * 
   * @param apiLeave - Raw leave request data from backend API
   * @returns Normalized LeaveRequest object for frontend use
   */
  static toFrontend(apiLeave: ApiLeaveResponse): LeaveRequest {
    const userMap = (u?: ApiUser): UserInfo => ({
      id: u?._id || '',
      name: u?.name || 'Unknown',
      email: u?.email || ''
    });

    return {
      id: apiLeave._id,
      startDate: apiLeave.startDate ? new Date(apiLeave.startDate).toISOString().split('T')[0] : '',
      endDate: apiLeave.endDate ? new Date(apiLeave.endDate).toISOString().split('T')[0] : null,
      category: apiLeave.category,
      reason: apiLeave.reason,
      leaveDays: apiLeave.leaveDays || 0,
      status: apiLeave.status,
      rejectionReason: apiLeave.rejectionReason,
      createdBy: userMap(apiLeave.createdBy),
      approvedBy: apiLeave.approvedBy ? userMap(apiLeave.approvedBy) : null,
      approvedAt: apiLeave.approvedAt,
      createdAt: apiLeave.createdAt,
    };
  }
}

/**
 * 4. Centralized Endpoints
 */
const ENDPOINTS = {
  BASE: '/leave-requests',
  DETAIL: (id: string) => `/leave-requests/${id}`,
  STATUS: (id: string) => `/leave-requests/${id}/status`,
  BULK_DELETE: '/leave-requests/bulk-delete',
};

/**
 * 5. Leave Repository (Dependency Inversion)
 * High-level business logic depends on this abstraction, not direct Axios calls.
 */
export const LeaveRepository = {
  /**
   * Fetches all leave requests for the organization (Admin/Manager use)
   */
  async getAllLeaves(): Promise<LeaveRequest[]> {
    const response = await api.get(ENDPOINTS.BASE);
    return response.data.success
      ? response.data.data.map(LeaveMapper.toFrontend)
      : [];
  },


  /**
   * Creates a new leave request
   */
  async createLeave(payload: CreateLeavePayload): Promise<LeaveRequest> {
    const response = await api.post(ENDPOINTS.BASE, payload);
    return LeaveMapper.toFrontend(response.data.data);
  },

  /**
   * Updates the status of a leave request (Approve/Reject)
   * This triggers the backend attendance marking logic.
   */
  async updateLeaveStatus(
    id: string,
    status: LeaveStatus,
    rejectionReason?: string
  ): Promise<LeaveRequest> {
    const response = await api.patch(ENDPOINTS.STATUS(id), {
      status,
      rejectionReason
    });
    return LeaveMapper.toFrontend(response.data.data);
  },

  /**
   * Deletes a specific leave request
   */
  async deleteLeave(id: string): Promise<boolean> {
    const response = await api.delete(ENDPOINTS.DETAIL(id));
    return response.data.success;
  },

  /**
   * Bulk deletion for administrative cleanup
   */
  async bulkDeleteLeaves(ids: string[]): Promise<boolean> {
    const response = await api.delete(ENDPOINTS.BULK_DELETE, { data: { ids } });
    return response.data.success;
  }
};

// Destructured exports for clean, named imports in your components
export const {
  getAllLeaves,
  createLeave,
  updateLeaveStatus,
  deleteLeave,
  bulkDeleteLeaves
} = LeaveRepository;