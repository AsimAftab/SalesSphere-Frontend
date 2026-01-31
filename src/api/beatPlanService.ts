import api from './api';

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
}

// Beat Plan Lists (Templates)
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

// Request Payloads
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

// Response Wrappers
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
const ENDPOINTS = {
  BASE: '/beat-plans',
  COUNTS: '/beat-plans/counts',
  LISTS: '/beat-plan-lists', // Templates
  ASSIGN: '/beat-plans/assign',
  DIRECTORIES: '/beat-plans/available-directories',
  DETAIL: (id: string) => `/beat-plans/${id}`,
  LIST_DETAIL: (id: string) => `/beat-plan-lists/${id}`,
  HISTORY: '/beat-plans/history',
  HISTORY_DETAIL: (id: string) => `/beat-plans/history/${id}`,
};

// --- 4. Repository Pattern ---
export const BeatPlanRepository = {
  // --- Beat Plans (Active) ---
  async getBeatPlans(params?: GetBeatPlansOptions): Promise<GetBeatPlansResponse> {
    const response = await api.get<GetBeatPlansResponse>(ENDPOINTS.BASE, { params });
    // Map the data array while preserving pagination metadata
    if (response.data.success) {
      response.data.data = BeatPlanMapper.toFrontendList(response.data.data);
    }
    return response.data;
  },

  async getBeatPlanCounts(): Promise<BeatPlanCountsResponse> {
    const response = await api.get<BeatPlanCountsResponse>(ENDPOINTS.COUNTS);
    return response.data;
  },

  async getBeatPlanById(id: string): Promise<BeatPlan> {
    const response = await api.get<BeatPlanResponse>(ENDPOINTS.DETAIL(id));
    return BeatPlanMapper.toFrontend(response.data.data);
  },

  async deleteBeatPlan(id: string): Promise<DeleteResponse> {
    const response = await api.delete<DeleteResponse>(ENDPOINTS.DETAIL(id));
    return response.data;
  },

  // --- Beat Plan Templates (Lists) ---
  async getBeatPlanLists(): Promise<GetBeatPlanListsResponse> {
    const response = await api.get<GetBeatPlanListsResponse>(ENDPOINTS.LISTS);
    if (response.data.success) {
      response.data.data = BeatPlanMapper.toFrontendList(response.data.data);
    }
    return response.data;
  },

  async createBeatPlanList(payload: CreateBeatPlanListPayload): Promise<BeatPlanList> {
    const response = await api.post<{ success: boolean; data: BeatPlanList }>(ENDPOINTS.LISTS, payload);
    return BeatPlanMapper.toFrontend(response.data.data);
  },

  async updateBeatPlanList({ id, updateData }: { id: string; updateData: Partial<CreateBeatPlanListPayload> }): Promise<BeatPlanList> {
    const response = await api.put<{ success: boolean; data: BeatPlanList }>(ENDPOINTS.LIST_DETAIL(id), updateData);
    return BeatPlanMapper.toFrontend(response.data.data);
  },

  async getBeatPlanListById(id: string): Promise<BeatPlanList> {
    const response = await api.get<{ success: boolean; data: BeatPlanList }>(ENDPOINTS.LIST_DETAIL(id));
    return BeatPlanMapper.toFrontend(response.data.data);
  },

  async assignBeatPlan(payload: AssignBeatPlanPayload): Promise<BeatPlan> {
    const response = await api.post<{ success: boolean; data: BeatPlan }>(ENDPOINTS.ASSIGN, payload);
    return BeatPlanMapper.toFrontend(response.data.data);
  },

  async deleteBeatPlanList(id: string): Promise<DeleteResponse> {
    const response = await api.delete<DeleteResponse>(ENDPOINTS.LIST_DETAIL(id));
    return response.data;
  },

  async getAvailableDirectories(search?: string): Promise<GetAvailableDirectoriesResponse['data']> {
    const response = await api.get<GetAvailableDirectoriesResponse>(
      ENDPOINTS.DIRECTORIES,
      { params: { search } }
    );
    return response.data.data;
  },

  // --- Archived / History ---
  async getArchivedBeatPlans(params?: GetBeatPlansOptions): Promise<GetBeatPlansResponse> {
    // Backend now returns all data without pagination object (Step 6968)
    const response = await api.get<{ success: boolean; data: BeatPlan[]; total: number; count: number }>(
      ENDPOINTS.HISTORY,
      { params }
    );
    if (response.data.success) {
      response.data.data = BeatPlanMapper.toFrontendList(response.data.data);
    }
    return response.data;
  },

  async getArchivedBeatPlanById(id: string): Promise<BeatPlan> {
    const response = await api.get<{ success: boolean; data: BeatPlan }>(ENDPOINTS.HISTORY_DETAIL(id));
    return BeatPlanMapper.toFrontend(response.data.data);
  },
};

// --- 5. Clean Named Exports ---
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
