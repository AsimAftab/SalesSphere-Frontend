import api from './api';
import { API_ENDPOINTS } from './endpoints';
import { BaseRepository } from './base';
import type { EndpointConfig } from './base';
import { handleApiError } from './errors';

// --- 1. Interface Segregation & Domain Models ---

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

// --- 2. API Response Interfaces (DTOs) ---

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

// --- 3. Mapper Logic ---

/**
 * LeaveMapper - Transforms leave request data between backend API shape and frontend domain models.
 */
class LeaveMapper {
  /**
   * Transforms a backend leave request response to frontend LeaveRequest model.
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

// --- 4. Endpoint Configuration ---

const LEAVE_ENDPOINTS: EndpointConfig = {
  BASE: API_ENDPOINTS.leaves.BASE,
  DETAIL: API_ENDPOINTS.leaves.DETAIL,
  BULK_DELETE: API_ENDPOINTS.leaves.BULK_DELETE,
};

// --- 5. LeaveRepositoryClass - Extends BaseRepository ---

/**
 * LeaveRepositoryClass - Extends BaseRepository for standard CRUD operations.
 */
class LeaveRepositoryClass extends BaseRepository<LeaveRequest, ApiLeaveResponse, CreateLeavePayload, Partial<CreateLeavePayload>> {
  protected readonly endpoints = LEAVE_ENDPOINTS;

  protected mapToFrontend(apiData: ApiLeaveResponse): LeaveRequest {
    return LeaveMapper.toFrontend(apiData);
  }

  // --- Entity-specific methods ---

  /**
   * Updates the status of a leave request (Approve/Reject).
   * This triggers the backend attendance marking logic.
   */
  async updateLeaveStatus(
    id: string,
    status: LeaveStatus,
    rejectionReason?: string
  ): Promise<LeaveRequest> {
    try {
      const response = await api.patch(API_ENDPOINTS.leaves.STATUS(id), {
        status,
        rejectionReason
      });
      return LeaveMapper.toFrontend(response.data.data);
    } catch (error: unknown) {
      throw handleApiError(error, 'Failed to update leave status');
    }
  }
}

// Create singleton instance
const leaveRepositoryInstance = new LeaveRepositoryClass();

// --- 6. LeaveRepository - Public API maintaining backward compatibility ---

export const LeaveRepository = {
  // Standard CRUD (from BaseRepository)
  getAllLeaves: () => leaveRepositoryInstance.getAll(),
  createLeave: (payload: CreateLeavePayload) => leaveRepositoryInstance.create(payload),
  deleteLeave: (id: string) => leaveRepositoryInstance.delete(id),
  bulkDeleteLeaves: (ids: string[]) => leaveRepositoryInstance.bulkDelete(ids),

  // Entity-specific methods
  updateLeaveStatus: (id: string, status: LeaveStatus, rejectionReason?: string) =>
    leaveRepositoryInstance.updateLeaveStatus(id, status, rejectionReason),
};

// --- 7. Clean Named Exports ---

export const {
  getAllLeaves,
  createLeave,
  updateLeaveStatus,
  deleteLeave,
  bulkDeleteLeaves
} = LeaveRepository;
