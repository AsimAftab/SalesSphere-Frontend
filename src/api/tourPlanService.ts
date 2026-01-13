import api from './api';

/**
 * 1. Interface Segregation
 * Defines clear contracts for the UI and the Data Layer
 */
export interface UserInfo {
  id: string;
  name: string;
  email: string;
}

export type TourStatus = 'pending' | 'approved' | 'rejected';

export interface TourPlan {
  id: string;
  placeOfVisit: string;
  startDate: string;
  endDate: string;
  purposeOfVisit: string;
  status: TourStatus;
  numberOfDays: number;
  createdBy: UserInfo;
  approvedBy?: UserInfo | null;
  approvedAt?: string | null;
  createdAt: string;
}

export interface CreateTourRequest {
  placeOfVisit: string;
  startDate: string;
  endDate: string;
  purposeOfVisit: string;
}

export interface TourPlanFilters {
  creators: string[];
  reviewers: string[];
  statuses: string[];
  months: string[];
  date: Date | null;
}

/**
 * 2. API Response Interfaces
 * Mirrors the raw shape of your MongoDB/Mongoose documents
 */
interface ApiUser {
  _id: string;
  name: string;
  email: string;
}

interface ApiTourResponse {
  _id: string;
  placeOfVisit: string;
  startDate: string;
  endDate: string;
  purposeOfVisit: string;
  status: TourStatus;
  numberOfDays?: number;
  createdBy: ApiUser;
  approvedBy?: ApiUser;
  approvedAt?: string;
  createdAt: string;
}

/**
 * 3. Mapper Logic (Single Responsibility Principle)
 * Handles transformation between Backend (snake_case/_id) and Frontend (camelCase/id)
 */
class TourPlanMapper {
  static toFrontend(apiTour: ApiTourResponse): TourPlan {
    const userMap = (u?: ApiUser): UserInfo => ({
      id: u?._id || '',
      name: u?.name || 'Unknown',
      email: u?.email || ''
    });

    return {
      id: apiTour._id,
      placeOfVisit: apiTour.placeOfVisit,
      startDate: apiTour.startDate ? new Date(apiTour.startDate).toISOString().split('T')[0] : '',
      endDate: apiTour.endDate ? new Date(apiTour.endDate).toISOString().split('T')[0] : '',
      purposeOfVisit: apiTour.purposeOfVisit,
      status: apiTour.status,
      numberOfDays: apiTour.numberOfDays || 0,
      createdBy: userMap(apiTour.createdBy),
      approvedBy: apiTour.approvedBy ? userMap(apiTour.approvedBy) : null,
      approvedAt: apiTour.approvedAt,
      createdAt: apiTour.createdAt,
    };
  }
}

/**
 * 4. Centralized Endpoints
 */
const ENDPOINTS = {
  BASE: '/tour-plans',
  DETAIL: (id: string) => `/tour-plans/${id}`,
  STATUS: (id: string) => `/tour-plans/${id}/status`,
  BULK_DELETE: '/tour-plans/bulk-delete',
};

/**
 * 5. Repository Pattern (Dependency Inversion)
 * High-level modules do not depend on low-level implementation details.
 */

export const TourPlanRepository = {
  async getTourPlans(): Promise<TourPlan[]> {
    const response = await api.get(ENDPOINTS.BASE);
    return response.data.success
      ? response.data.data.map(TourPlanMapper.toFrontend)
      : [];
  },

  async getTourPlanById(id: string): Promise<TourPlan> {
    const response = await api.get(ENDPOINTS.DETAIL(id));
    return TourPlanMapper.toFrontend(response.data.data);
  },

  async createTourPlan(data: CreateTourRequest): Promise<TourPlan> {
    const response = await api.post(ENDPOINTS.BASE, data);
    return TourPlanMapper.toFrontend(response.data.data);
  },

  /**
   * Updates an existing tour plan. 
   * Note: Backend uses PATCH for partial updates.
   */
  async updateTourPlan(id: string, data: Partial<CreateTourRequest>): Promise<TourPlan> {
    const response = await api.patch(ENDPOINTS.DETAIL(id), data);
    return TourPlanMapper.toFrontend(response.data.data);
  },

  /**
   * Status updates (Approve/Reject) - Restricted to Admin/Manager
   */
  async updateTourStatus(
    id: string,
    status: TourStatus,
    rejectionReason?: string
  ): Promise<TourPlan> {
    const response = await api.patch(ENDPOINTS.STATUS(id), {
      status,
      rejectionReason
    });
    return TourPlanMapper.toFrontend(response.data.data);
  },

  async deleteTourPlan(id: string): Promise<boolean> {
    const response = await api.delete(ENDPOINTS.DETAIL(id));
    return response.data.success;
  },

  async bulkDeleteTourPlans(ids: string[]): Promise<boolean> {
    const response = await api.delete(ENDPOINTS.BULK_DELETE, { data: { ids } });
    return response.data.success;
  }
};

// Destructured exports for cleaner imports in your components
export const {
  getTourPlans,
  getTourPlanById,
  createTourPlan,
  updateTourPlan,
  updateTourStatus,
  deleteTourPlan,
  bulkDeleteTourPlans
} = TourPlanRepository;