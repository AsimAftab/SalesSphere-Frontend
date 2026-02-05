import apiClient from './api';
import { API_ENDPOINTS } from './endpoints';
import { handleApiError } from './errors';

/**
 * 1. Interface Segregation: Clean Frontend Types
 */
export interface MiscWork {
  _id: string;
  employee: {
    id: string;
    name: string;
    role: string;
    customRoleId?: string | { name: string }; // Added for resolution
    avatarUrl?: string;
  };
  natureOfWork: string;
  address: string;
  assignedBy?: {
    id: string;
    name: string;
  };
  workDate?: string;
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
  customRoleId?: string | { name: string }; // Added customRoleId support
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
    } catch {
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
   * Helper to extract the visible role/designation
   */
  static getRoleDisplay(emp: ApiEmployee | undefined): string {
    if (!emp) return 'Staff';

    // 1. Priority: Custom Role Name (e.g. "Sales Manager")
    if (emp.customRoleId && typeof emp.customRoleId === 'object' && 'name' in emp.customRoleId) {
      return emp.customRoleId.name;
    }
    
    // 3. Fallback: System Role (e.g. "admin", "user") - Capitalized
    if (emp.role) return emp.role.charAt(0).toUpperCase() + emp.role.slice(1);

    return 'Staff';
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
        role: this.getRoleDisplay(apiItem.employeeId),
        customRoleId: apiItem.employeeId?.customRoleId, // Added for resolution
        avatarUrl: apiItem.employeeId?.avatarUrl || undefined,
      },
      natureOfWork: apiItem.natureOfWork || this.DEFAULT_NATURE,
      address: apiItem.address || this.DEFAULT_ADDRESS,
      assignedBy: {
        id: '',
        name: typeof apiItem.assignedBy === 'string'
          ? apiItem.assignedBy
          : (apiItem.assignedBy?.name || 'Admin'),
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
const ENDPOINTS = API_ENDPOINTS.miscWork;

/**
 * 5. Repository Pattern: Main Data Orchestrator
 */
export const MiscWorkRepository = {
  async getMiscWorks(options: GetMiscWorksOptions): Promise<GetMiscWorksResponse> {
    try {
      const params: Record<string, string | number | undefined> = {
        page: options.page,
        limit: options.limit,
        date: options.date,
        month: options.month,
        year: options.year,
        search: options.search,
      };
      if (options.employees?.length) params.employees = options.employees.join(',');

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
    } catch (error: unknown) {
      throw handleApiError(error, 'Failed to fetch miscellaneous work');
    }
  },

  async deleteMiscWork(id: string): Promise<void> {
    try {
      await apiClient.delete(ENDPOINTS.DETAIL(id));
    } catch (error: unknown) {
      throw handleApiError(error, 'Failed to delete miscellaneous work');
    }
  },

  async bulkDeleteMiscWorks(ids: string[]): Promise<void> {
    try {
      await apiClient.delete(ENDPOINTS.MASS_DELETE, { data: { ids } });
    } catch (error: unknown) {
      throw handleApiError(error, 'Failed to delete miscellaneous works');
    }
  }
};

// Explicit Named Exports for the Frontend Hooks
export const {
  getMiscWorks,
  deleteMiscWork,
  bulkDeleteMiscWorks
} = MiscWorkRepository;