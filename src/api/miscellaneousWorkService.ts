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

/**
 * FIXED: Explicitly exporting these names to resolve ts(2305)
 */
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
 * Helps eliminate 'any' and ensures strict typing.
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
 * 3. Single Responsibility Principle: Mapper Class
 * Responsibility: Transform raw API data into clean frontend objects.
 */
class MiscWorkMapper {
  static toFrontend(apiItem: ApiMiscWorkResponse): MiscWork {
    return {
      _id: apiItem._id,
      employee: {
        id: apiItem.employeeId?._id || '',
        name: apiItem.employeeId?.name || 'Unknown',
        role: apiItem.employeeId?.role || 'Staff',
        // FALLBACK LOGIC: If avatarUrl doesn't exist, set to undefined 
        // to trigger the local CSS fallback instead of an external URL.
        avatarUrl: apiItem.employeeId?.avatarUrl || undefined,
      },
      natureOfWork: apiItem.natureOfWork,
      address: apiItem.address,
      assignedBy: {
        id: '', 
        name: typeof apiItem.assignedBy === 'string' ? apiItem.assignedBy : (apiItem.assignedBy?.name || 'System'),
        role: 'Admin',
      },
      workDate: apiItem.workDate, 
      // Ensure images is always an array
      images: (apiItem.images && apiItem.images.length > 0) 
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
  MASS_DELETE: '/miscellaneous-work/mass-delete',
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
      const rawData = response.data.data;

      return {
        data: rawData.map(MiscWorkMapper.toFrontend),
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

/**
 * Named Exports for the Frontend.
 */
export const { 
  getMiscWorks, 
  deleteMiscWork, 
  bulkDeleteMiscWorks 
} = MiscWorkRepository;