import api from './api';
import { API_ENDPOINTS } from './endpoints';
import { BaseRepository } from './base';
import type { EndpointConfig } from './base';
import { handleApiError } from './errors';

// --- 1. Interface Segregation ---

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
  employees: string[];
}

// --- 2. API Response Interfaces ---

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

// --- 3. Mapper Logic ---

/**
 * TourPlanMapper - Transforms data between backend API shape and frontend domain models.
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

// --- 4. Endpoint Configuration ---

const TOUR_PLAN_ENDPOINTS: EndpointConfig = {
  BASE: API_ENDPOINTS.tourPlans.BASE,
  DETAIL: API_ENDPOINTS.tourPlans.DETAIL,
  BULK_DELETE: API_ENDPOINTS.tourPlans.BULK_DELETE,
};

// --- 5. TourPlanRepositoryClass - Extends BaseRepository ---

/**
 * TourPlanRepositoryClass - Extends BaseRepository for standard CRUD operations.
 */
class TourPlanRepositoryClass extends BaseRepository<TourPlan, ApiTourResponse, CreateTourRequest, Partial<CreateTourRequest>> {
  protected readonly endpoints = TOUR_PLAN_ENDPOINTS;

  protected mapToFrontend(apiData: ApiTourResponse): TourPlan {
    return TourPlanMapper.toFrontend(apiData);
  }

  // Override update to use PATCH instead of PUT
  async updateTourPlan(id: string, data: Partial<CreateTourRequest>): Promise<TourPlan> {
    try {
      const response = await api.patch(this.endpoints.DETAIL(id), data);
      return TourPlanMapper.toFrontend(response.data.data);
    } catch (error: unknown) {
      throw handleApiError(error, 'Failed to update tour plan');
    }
  }

  // --- Entity-specific methods ---

  /**
   * Status updates (Approve/Reject) - Restricted to Admin/Manager.
   */
  async updateTourStatus(
    id: string,
    status: TourStatus,
    rejectionReason?: string
  ): Promise<TourPlan> {
    try {
      const response = await api.patch(API_ENDPOINTS.tourPlans.STATUS(id), {
        status,
        rejectionReason
      });
      return TourPlanMapper.toFrontend(response.data.data);
    } catch (error: unknown) {
      throw handleApiError(error, 'Failed to update tour status');
    }
  }
}

// Create singleton instance
const tourPlanRepositoryInstance = new TourPlanRepositoryClass();

// --- 6. TourPlanRepository - Public API maintaining backward compatibility ---

export const TourPlanRepository = {
  // Standard CRUD (from BaseRepository)
  getTourPlans: () => tourPlanRepositoryInstance.getAll(),
  getTourPlanById: (id: string) => tourPlanRepositoryInstance.getById(id),
  createTourPlan: (data: CreateTourRequest) => tourPlanRepositoryInstance.create(data),
  updateTourPlan: (id: string, data: Partial<CreateTourRequest>) => tourPlanRepositoryInstance.updateTourPlan(id, data),
  deleteTourPlan: (id: string) => tourPlanRepositoryInstance.delete(id),
  bulkDeleteTourPlans: (ids: string[]) => tourPlanRepositoryInstance.bulkDelete(ids),

  // Entity-specific methods
  updateTourStatus: (id: string, status: TourStatus, rejectionReason?: string) =>
    tourPlanRepositoryInstance.updateTourStatus(id, status, rejectionReason),
};

// --- 7. Clean Named Exports ---

export const {
  getTourPlans,
  getTourPlanById,
  createTourPlan,
  updateTourPlan,
  updateTourStatus,
  deleteTourPlan,
  bulkDeleteTourPlans
} = TourPlanRepository;
