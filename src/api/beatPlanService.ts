import api from './api';

// --- 1. Interface Segregation ---

// Core Entities
export interface AssignedEmployee {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
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
  contact?: {
    phone: string;
  };
  location: DirectoryLocation;
  panVatNumber?: string;
}

export interface AssignedSite {
  _id: string;
  siteName: string;
  ownerName: string;
  contact?: {
    phone: string;
  };
  location: DirectoryLocation;
}

export interface AssignedProspect {
  _id: string;
  prospectName: string;
  ownerName: string;
  contact?: {
    phone: string;
  };
  location: DirectoryLocation;
  panVatNumber?: string;
}

export interface BeatPlan {
  _id: string;
  name: string;
  employees: AssignedEmployee[];
  parties: AssignedParty[];
  sites: AssignedSite[];
  prospects: AssignedProspect[];
  schedule: {
    startDate: string;
    frequency: 'daily' | 'weekly' | 'monthly' | 'custom';
  };
  status: 'pending' | 'active' | 'completed';
  progress: {
    totalDirectories: number;
    visitedDirectories: number;
    percentage: number;
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

// Simple Standalone Interfaces
export interface SimpleSalesperson {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
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
  panVatNumber?: string;
  'contact.phone'?: string;
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
  createdBy: SimpleSalesperson;
  createdAt: string;
  updatedAt: string;
}

// Request Payloads
export interface CreateBeatPlanPayload {
  employeeId: string;
  name: string;
  assignedDate: string;
  parties: string[];
  sites: string[];
  prospects: string[];
}

export interface UpdateBeatPlanPayload {
  name?: string;
  employeeId?: string;
  assignedDate?: string;
  parties?: string[];
  sites?: string[];
  prospects?: string[];
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

export interface MarkVisitedPayload {
  directoryId: string;
  directoryType: 'party' | 'site' | 'prospect';
  latitude?: number;
  longitude?: number;
}

export interface OptimizeRoutePayload {
  startLatitude?: number;
  startLongitude?: number;
}

export interface CalculateDistancePayload {
  currentLatitude: number;
  currentLongitude: number;
  partyId: string;
}

// Response Wrappers
export interface GetBeatPlansResponse {
  success: boolean;
  data: BeatPlan[];
  pagination: { total: number; page: number; limit: number; pages: number };
}

export interface GetBeatPlanListsResponse {
  success: boolean;
  count: number;
  total: number;
  page: number;
  pages: number;
  data: BeatPlanList[];
}

export interface BeatPlanResponse {
  success: boolean;
  data: BeatPlan;
}

export interface GetSalespersonsResponse {
  success: boolean;
  data: SimpleSalesperson[];
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

export interface GetBeatPlanDataResponse {
  success: boolean;
  data: {
    totalDirectories: number;
    totalParties: number;
    totalSites: number;
    totalProspects: number;
    totalBeatPlans: number;
    activeBeatPlans: number;
    assignedEmployeesCount: number;
    assignedEmployees: SimpleSalesperson[];
  };
}

export interface OptimizeRouteResponse {
  success: boolean;
  message: string;
  data: {
    beatPlanId: string;
    beatPlanName: string;
    optimizedRoute: Array<{
      _id: string;
      partyName: string;
      ownerName: string;
      location: DirectoryLocation;
      distanceToNext: number | null;
    }>;
    optimization: {
      originalDistance: number;
      optimizedDistance: number;
      distanceSaved: number;
      percentageSaved: number;
    };
  };
}

export interface CalculateDistanceResponse {
  success: boolean;
  data: {
    partyId: string;
    partyName: string;
    partyLocation: DirectoryLocation;
    currentLocation: {
      latitude: number;
      longitude: number;
    };
    distance: number;
    distanceInMeters: number;
  };
}

export interface DeleteResponse {
  success: boolean;
  message: string;
}

// Options
export interface GetBeatPlansOptions {
  page?: number;
  limit?: number;
  status?: 'pending' | 'active' | 'completed';
  search?: string;
}

// --- 2. Mapper Logic ---
// --- 2. Mapper Logic ---
class BeatPlanMapper {
  // Standardizes API responses to frontend models
  // Encapsulates data transformation logic (SRP)
  static toFrontend(data: any): any {
    // In the future, you can add data transformation here 
    // e.g. converting date strings to Date objects, renaming fields, etc.
    return data;
  }

  static toFrontendList(data: any[]): any[] {
    return data.map(item => BeatPlanMapper.toFrontend(item));
  }
}

// --- 3. Centralized Endpoints ---
const ENDPOINTS = {
  BASE: '/beat-plans',
  LISTS: '/beat-plan-lists', // Templates
  ASSIGN: '/beat-plans/assign',
  SALESPERSON: '/beat-plans/salesperson',
  DIRECTORIES: '/beat-plans/available-directories',
  ANALYTICS: '/beat-plans/data',
  DETAIL: (id: string) => `/beat-plans/${id}`,
  LIST_DETAIL: (id: string) => `/beat-plan-lists/${id}`,
};

// --- 4. Repository Pattern ---
export const BeatPlanRepository = {
  // --- Beat Plans (Active) ---
  async getBeatPlans(options: GetBeatPlansOptions = {}): Promise<GetBeatPlansResponse> {
    const response = await api.get<GetBeatPlansResponse>(ENDPOINTS.BASE, { params: options });
    // Map the data array while preserving pagination metadata
    if (response.data.success) {
      response.data.data = BeatPlanMapper.toFrontendList(response.data.data);
    }
    return response.data;
  },

  async getBeatPlanById(id: string): Promise<BeatPlan> {
    const response = await api.get<BeatPlanResponse>(ENDPOINTS.DETAIL(id));
    return BeatPlanMapper.toFrontend(response.data.data);
  },

  async createBeatPlan(payload: CreateBeatPlanPayload): Promise<BeatPlan> {
    const response = await api.post<BeatPlanResponse>(ENDPOINTS.BASE, payload);
    return BeatPlanMapper.toFrontend(response.data.data);
  },

  async updateBeatPlan({ id, updateData }: { id: string; updateData: UpdateBeatPlanPayload }): Promise<BeatPlan> {
    const response = await api.put<BeatPlanResponse>(ENDPOINTS.DETAIL(id), updateData);
    return BeatPlanMapper.toFrontend(response.data.data);
  },

  async deleteBeatPlan(id: string): Promise<DeleteResponse> {
    const response = await api.delete<DeleteResponse>(ENDPOINTS.DETAIL(id));
    return response.data;
  },

  // --- Beat Plan Templates (Lists) ---
  async getBeatPlanLists(options: GetBeatPlansOptions = {}): Promise<GetBeatPlanListsResponse> {
    const response = await api.get<GetBeatPlanListsResponse>(ENDPOINTS.LISTS, { params: options });
    if (response.data.success) {
      response.data.data = BeatPlanMapper.toFrontendList(response.data.data);
    }
    return response.data;
  },

  async createBeatPlanList(payload: CreateBeatPlanListPayload): Promise<BeatPlanList> {
    const response = await api.post<{ success: boolean; data: BeatPlanList }>(ENDPOINTS.LISTS, payload);
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

  // --- Helpers / Dropdowns ---
  async getSalespersons(withBeatPlanPermission?: boolean): Promise<SimpleSalesperson[]> {
    const response = await api.get<GetSalespersonsResponse>(
      ENDPOINTS.SALESPERSON,
      { params: { withBeatPlanPermission } }
    );
    return response.data.data;
  },

  async getAvailableDirectories(search?: string): Promise<GetAvailableDirectoriesResponse['data']> {
    const response = await api.get<GetAvailableDirectoriesResponse>(
      ENDPOINTS.DIRECTORIES,
      { params: { search } }
    );
    return response.data.data;
  },

  async getBeatPlanAnalytics(): Promise<GetBeatPlanDataResponse['data']> {
    const response = await api.get<GetBeatPlanDataResponse>(ENDPOINTS.ANALYTICS);
    return response.data.data;
  }
};

// --- 5. Clean Named Exports ---
export const {
  getBeatPlans,
  getBeatPlanById,
  createBeatPlan,
  updateBeatPlan,
  deleteBeatPlan,
  getBeatPlanLists,
  createBeatPlanList,
  assignBeatPlan,
  deleteBeatPlanList,
  getSalespersons,
  getAvailableDirectories,
  getBeatPlanAnalytics
} = BeatPlanRepository;
