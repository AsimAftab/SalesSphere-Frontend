import apiClient from './api';

/**
 * 1. Interface Segregation: Clean Frontend Types
 */
export interface EmployeeRef {
  id: string;
  name: string;
  role: string;
  avatarUrl?: string;
}

export interface MiscWork {
  _id: string;
  employee: EmployeeRef;
  natureOfWork: string;
  address: string;
  assignedBy: EmployeeRef;
  workDate: string;
  images: string[];
}

export interface GetMiscWorksOptions {
  page?: number;
  limit?: number;
  date?: string;  // YYYY-MM-DD
  month?: string; // 1-12
  year?: string;  // YYYY
  search?: string;
  employees?: string[];
}

export interface GetMiscWorksResponse {
  data: MiscWork[];
  pagination: {
    total: number;
    pages: number;
    currentPage: number;
  };
}

/**
 * 2. Internal API Response Interfaces (DTOs)
 */
interface ApiEmployee {
  _id: string;
  name: string;
  role?: string;
  avatarUrl?: string;
}

interface ApiMiscWorkResponse {
  _id: string;
  employeeId: ApiEmployee;
  natureOfWork: string;
  address: string;
  assignedBy: string | ApiEmployee;
  workDate: string;
  images: { imageUrl: string }[];
}

/**
 * 3. Domain Mapper Class (Enterprise Logic Layer)
 * Responsibility: Transform raw API data and centralize formatting rules.
 */
export class MiscWorkMapper {
  // Centralized Fallbacks
  static readonly DEFAULT_TEXT = "—";
  static readonly DEFAULT_NATURE = "Miscellaneous Work";
  static readonly DEFAULT_ADDRESS = "No Address Provided";

  /**
   * Standardizes date display across Table, Mobile, and Exports.
   */
  static formatDate(dateString: string | null | undefined): string {
    if (!dateString) return this.DEFAULT_TEXT;
    try {
      return new Date(dateString).toLocaleDateString('en-GB'); // DD/MM/YYYY
    } catch (e) {
      return this.DEFAULT_TEXT;
    }
  }

  /**
   * Formats initials for fallback avatars consistently.
   */
  static getInitials(name: string): string {
    return name ? name.trim().charAt(0).toUpperCase() : "?";
  }

  /**
   * Maps DTO to Frontend Domain Model with safety fallbacks.
   */
  static toFrontend(apiItem: ApiMiscWorkResponse): MiscWork {
    return {
      _id: apiItem._id,
      employee: {
        id: apiItem.employeeId?._id || '',
        name: apiItem.employeeId?.name || 'Unknown User',
        role: apiItem.employeeId?.role || 'Staff',
        avatarUrl: apiItem.employeeId?.avatarUrl || undefined,
      },
      natureOfWork: apiItem.natureOfWork || this.DEFAULT_NATURE,
      address: apiItem.address || this.DEFAULT_ADDRESS,
      assignedBy: {
        id: '',
        name: typeof apiItem.assignedBy === 'string'
          ? apiItem.assignedBy
          : (apiItem.assignedBy?.name || 'Admin'),
        role: 'Admin',
      },
      workDate: apiItem.workDate || '',
      images: Array.isArray(apiItem.images)
        ? apiItem.images.map((img) => img.imageUrl)
        : [],
    };
  }
}

/**
 * 4. Open/Closed Principle: Centralized Endpoints
 */
const ENDPOINTS = {
  BASE: '/miscellaneous-work',
  MASS_DELETE: '/miscellaneous-work/bulk-delete',
  DETAIL: (id: string) => `/miscellaneous-work/${id}`,
};

/**
 * 5. Repository Pattern: Main Data Orchestrator
 */
export const MiscWorkRepository = {
  async getMiscWorks(options: GetMiscWorksOptions): Promise<GetMiscWorksResponse> {
    const params: Record<string, any> = { ...options };
    if (options.employees?.length) params.employees = options.employees.join(',');

    try {
      const response = await apiClient.get(ENDPOINTS.BASE, { params });
      const rawData = response.data.data || [];

      return {
        data: rawData.map((item: ApiMiscWorkResponse) => MiscWorkMapper.toFrontend(item)),
        pagination: {
          total: response.data.count || rawData.length,
          pages: Math.ceil((response.data.count || rawData.length) / (options.limit || 10)),
          currentPage: options.page || 1,
        },
      };
    } catch (error) {
      console.error("Failed to fetch miscellaneous work:", error);
      throw error;
    }
  },

  async deleteMiscWork(id: string): Promise<void> {
    await apiClient.delete(ENDPOINTS.DETAIL(id));
  },

  async bulkDeleteMiscWorks(ids: string[]): Promise<void> {
    await apiClient.delete(ENDPOINTS.MASS_DELETE, { data: { ids } });
  }
};

// Explicit Named Exports for the Frontend Hooks
export const {
  getMiscWorks,
  deleteMiscWork,
  bulkDeleteMiscWorks
} = MiscWorkRepository;