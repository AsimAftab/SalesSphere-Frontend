import api from './api';
import { API_ENDPOINTS } from './endpoints';
import { handleApiError } from './errors';

// --- 1. Interface Segregation ---

export interface AssignedEmployee {
  _id: string;
  name: string;
  role: string;
  phone?: string;
}

export interface DirectoryLocation {
  address: string;
  latitude?: number;
  longitude?: number;
}

export interface AssignedParty {
  _id: string;
  partyName: string;
  ownerName: string;
  location: DirectoryLocation;
}

export interface AssignedSite {
  _id: string;
  siteName: string;
  ownerName: string;
  location: DirectoryLocation;
}

export interface AssignedProspect {
  _id: string;
  prospectName: string;
  ownerName: string;
  location: DirectoryLocation;
}

export interface BeatPlan {
  _id: string;
  name: string;
  employees: AssignedEmployee[];
  parties: AssignedParty[];
  sites: AssignedSite[];
  prospects: AssignedProspect[];
  visits: Array<{
    directoryId: string;
    directoryType: 'party' | 'site' | 'prospect';
    status: 'pending' | 'visited' | 'skipped';
    visitedAt?: string;
  }>;
  schedule: {
    startDate: string;
  };
  status: 'pending' | 'active' | 'completed';
  progress: {
    totalDirectories: number;
    visitedDirectories: number;
    totalParties: number;
    totalSites: number;
    totalProspects: number;
  };
  organizationId: string;
  createdBy: AssignedEmployee;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
}

export interface SimpleDirectory {
  _id: string;
  name: string;
  ownerName: string;
  location: DirectoryLocation;
  type: 'party' | 'site' | 'prospect';
  partyName?: string;
  siteName?: string;
  prospectName?: string;
}

export interface BeatPlanList {
  _id: string;
  name: string;
  parties: AssignedParty[];
  sites: AssignedSite[];
  prospects: AssignedProspect[];
  totalDirectories: number;
  totalParties: number;
  totalSites: number;
  totalProspects: number;
  organizationId: string;
  createdBy: AssignedEmployee;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBeatPlanListPayload {
  name: string;
  parties: string[];
  sites: string[];
  prospects: string[];
}

export interface AssignBeatPlanPayload {
  beatPlanListId: string;
  employees: string[];
  startDate: string;
}

export interface GetBeatPlansResponse {
  success: boolean;
  data: BeatPlan[];
  pagination?: { total: number; pages: number; page: number; };
}

export interface GetBeatPlanListsResponse {
  success: boolean;
  count: number;
  total: number;
  data: BeatPlanList[];
}

export interface BeatPlanResponse {
  success: boolean;
  data: BeatPlan;
}

export interface GetAvailableDirectoriesResponse {
  success: boolean;
  data: {
    parties: SimpleDirectory[];
    sites: SimpleDirectory[];
    prospects: SimpleDirectory[];
    all: SimpleDirectory[];
  };
}

export interface DeleteResponse {
  success: boolean;
  message: string;
}

export interface BeatPlanCountsResponse {
  success: boolean;
  data: {
    templates: number;
    active: number;
    completed: number;
  };
}

export interface GetBeatPlansOptions {
  status?: 'pending' | 'active' | 'completed';
  search?: string;
  employeeId?: string;
  limit?: number;
  page?: number;
}

// --- 2. Mapper Logic ---

class BeatPlanMapper {
  static toFrontend<T>(data: T): T {
    return data;
  }

  static toFrontendList<T>(data: T[]): T[] {
    return data.map(item => BeatPlanMapper.toFrontend(item));
  }
}

// --- 3. Centralized Endpoints ---

const ENDPOINTS = API_ENDPOINTS.beatPlans;

// --- 4. BeatPlanRepositoryClass ---

/**
 * BeatPlanRepositoryClass - Handles beat plan operations with proper error handling.
 * Note: Beat plans have a unique structure with templates (lists) vs active plans,
 * so we don't extend BaseRepository but use handleApiError for consistent error handling.
 */
class BeatPlanRepositoryClass {
  // --- Beat Plans (Active) ---

  async getBeatPlans(params?: GetBeatPlansOptions): Promise<GetBeatPlansResponse> {
    try {
      const response = await api.get<GetBeatPlansResponse>(ENDPOINTS.BASE, { params });
      if (response.data.success) {
        response.data.data = BeatPlanMapper.toFrontendList(response.data.data);
      }
      return response.data;
    } catch (error: unknown) {
      throw handleApiError(error, 'Failed to fetch beat plans');
    }
  }

  async getBeatPlanCounts(): Promise<BeatPlanCountsResponse> {
    try {
      const response = await api.get<BeatPlanCountsResponse>(ENDPOINTS.COUNTS);
      return response.data;
    } catch (error: unknown) {
      throw handleApiError(error, 'Failed to fetch beat plan counts');
    }
  }

  async getBeatPlanById(id: string): Promise<BeatPlan> {
    try {
      const response = await api.get<BeatPlanResponse>(ENDPOINTS.DETAIL(id));
      return BeatPlanMapper.toFrontend(response.data.data);
    } catch (error: unknown) {
      throw handleApiError(error, 'Failed to fetch beat plan');
    }
  }

  async deleteBeatPlan(id: string): Promise<DeleteResponse> {
    try {
      const response = await api.delete<DeleteResponse>(ENDPOINTS.DETAIL(id));
      return response.data;
    } catch (error: unknown) {
      throw handleApiError(error, 'Failed to delete beat plan');
    }
  }

  // --- Beat Plan Templates (Lists) ---

  async getBeatPlanLists(): Promise<GetBeatPlanListsResponse> {
    try {
      const response = await api.get<GetBeatPlanListsResponse>(ENDPOINTS.LISTS);
      if (response.data.success) {
        response.data.data = BeatPlanMapper.toFrontendList(response.data.data);
      }
      return response.data;
    } catch (error: unknown) {
      throw handleApiError(error, 'Failed to fetch beat plan templates');
    }
  }

  async createBeatPlanList(payload: CreateBeatPlanListPayload): Promise<BeatPlanList> {
    try {
      const response = await api.post<{ success: boolean; data: BeatPlanList }>(ENDPOINTS.LISTS, payload);
      return BeatPlanMapper.toFrontend(response.data.data);
    } catch (error: unknown) {
      throw handleApiError(error, 'Failed to create beat plan template');
    }
  }

  async updateBeatPlanList({ id, updateData }: { id: string; updateData: Partial<CreateBeatPlanListPayload> }): Promise<BeatPlanList> {
    try {
      const response = await api.put<{ success: boolean; data: BeatPlanList }>(ENDPOINTS.LIST_DETAIL(id), updateData);
      return BeatPlanMapper.toFrontend(response.data.data);
    } catch (error: unknown) {
      throw handleApiError(error, 'Failed to update beat plan template');
    }
  }

  async getBeatPlanListById(id: string): Promise<BeatPlanList> {
    try {
      const response = await api.get<{ success: boolean; data: BeatPlanList }>(ENDPOINTS.LIST_DETAIL(id));
      return BeatPlanMapper.toFrontend(response.data.data);
    } catch (error: unknown) {
      throw handleApiError(error, 'Failed to fetch beat plan template');
    }
  }

  async assignBeatPlan(payload: AssignBeatPlanPayload): Promise<BeatPlan> {
    try {
      const response = await api.post<{ success: boolean; data: BeatPlan }>(ENDPOINTS.ASSIGN, payload);
      return BeatPlanMapper.toFrontend(response.data.data);
    } catch (error: unknown) {
      throw handleApiError(error, 'Failed to assign beat plan');
    }
  }

  async deleteBeatPlanList(id: string): Promise<DeleteResponse> {
    try {
      const response = await api.delete<DeleteResponse>(ENDPOINTS.LIST_DETAIL(id));
      return response.data;
    } catch (error: unknown) {
      throw handleApiError(error, 'Failed to delete beat plan template');
    }
  }

  async getAvailableDirectories(search?: string): Promise<GetAvailableDirectoriesResponse['data']> {
    try {
      const response = await api.get<GetAvailableDirectoriesResponse>(
        ENDPOINTS.DIRECTORIES,
        { params: { search } }
      );
      return response.data.data;
    } catch (error: unknown) {
      throw handleApiError(error, 'Failed to fetch available directories');
    }
  }

  // --- Archived / History ---

  async getArchivedBeatPlans(params?: GetBeatPlansOptions): Promise<GetBeatPlansResponse> {
    try {
      const response = await api.get<{ success: boolean; data: BeatPlan[]; total: number; count: number }>(
        ENDPOINTS.HISTORY,
        { params }
      );
      if (response.data.success) {
        response.data.data = BeatPlanMapper.toFrontendList(response.data.data);
      }
      return response.data;
    } catch (error: unknown) {
      throw handleApiError(error, 'Failed to fetch archived beat plans');
    }
  }

  async getArchivedBeatPlanById(id: string): Promise<BeatPlan> {
    try {
      const response = await api.get<{ success: boolean; data: BeatPlan }>(ENDPOINTS.HISTORY_DETAIL(id));
      return BeatPlanMapper.toFrontend(response.data.data);
    } catch (error: unknown) {
      throw handleApiError(error, 'Failed to fetch archived beat plan');
    }
  }
}

// Create singleton instance
const beatPlanRepositoryInstance = new BeatPlanRepositoryClass();

// --- 5. BeatPlanRepository - Public API ---

export const BeatPlanRepository = {
  // Beat Plans (Active)
  getBeatPlans: (params?: GetBeatPlansOptions) => beatPlanRepositoryInstance.getBeatPlans(params),
  getBeatPlanCounts: () => beatPlanRepositoryInstance.getBeatPlanCounts(),
  getBeatPlanById: (id: string) => beatPlanRepositoryInstance.getBeatPlanById(id),
  deleteBeatPlan: (id: string) => beatPlanRepositoryInstance.deleteBeatPlan(id),

  // Beat Plan Templates (Lists)
  getBeatPlanLists: () => beatPlanRepositoryInstance.getBeatPlanLists(),
  createBeatPlanList: (payload: CreateBeatPlanListPayload) => beatPlanRepositoryInstance.createBeatPlanList(payload),
  updateBeatPlanList: (params: { id: string; updateData: Partial<CreateBeatPlanListPayload> }) =>
    beatPlanRepositoryInstance.updateBeatPlanList(params),
  getBeatPlanListById: (id: string) => beatPlanRepositoryInstance.getBeatPlanListById(id),
  assignBeatPlan: (payload: AssignBeatPlanPayload) => beatPlanRepositoryInstance.assignBeatPlan(payload),
  deleteBeatPlanList: (id: string) => beatPlanRepositoryInstance.deleteBeatPlanList(id),
  getAvailableDirectories: (search?: string) => beatPlanRepositoryInstance.getAvailableDirectories(search),

  // Archived / History
  getArchivedBeatPlans: (params?: GetBeatPlansOptions) => beatPlanRepositoryInstance.getArchivedBeatPlans(params),
  getArchivedBeatPlanById: (id: string) => beatPlanRepositoryInstance.getArchivedBeatPlanById(id),
};

// --- 6. Clean Named Exports ---

export const {
  getBeatPlans,
  getBeatPlanCounts,
  getBeatPlanById,
  deleteBeatPlan,
  getBeatPlanLists,
  createBeatPlanList,
  updateBeatPlanList,
  getBeatPlanListById,
  assignBeatPlan,
  deleteBeatPlanList,
  getAvailableDirectories,
  getArchivedBeatPlans,
  getArchivedBeatPlanById,
} = BeatPlanRepository;
