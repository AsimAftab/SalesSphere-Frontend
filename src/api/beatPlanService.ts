import api from './api';

// --- BASE ENTITY INTERFACES ---

export interface AssignedEmployee {
  _id: string;
  name: string;
  email: string;
  role: 'salesperson' | 'manager';
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

/**
 * Base BeatPlan object, returned from GET / and GET /:id
 */
export interface BeatPlan {
  _id: string;
  name: string;
  employees: AssignedEmployee[];
  parties: AssignedParty[];
  sites: AssignedSite[];
  prospects: AssignedProspect[];
  schedule: {
    startDate: string; // ISO Date string
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
  createdAt: string; // ISO Date string
  startedAt?: string; // ISO Date string
  completedAt?: string; // ISO Date string
}

/**
 * Minimal BeatPlan object for salesperson's list view (GET /my-beatplans)
 */
export interface MyBeatPlan {
  _id: string;
  name: string;
  status: 'pending' | 'active' | 'completed';
  assignedDate: string; // ISO Date string
  startedAt: string | null;
  completedAt: string | null;
  totalDirectories: number;
  visitedDirectories: number;
  unvisitedDirectories: number;
  progressPercentage: number;
  totalParties: number;
  totalSites: number;
  totalProspects: number;
}

/**
 * Detailed directory object returned from GET /:id/details
 */
export interface DetailedDirectory {
  _id: string;
  name: string;
  type: 'party' | 'site' | 'prospect';
  ownerName: string;
  contact?: { phone: string };
  location: DirectoryLocation;
  panVatNumber?: string | null;
  distanceToNext: number | null;
  visitStatus: {
    status: 'pending' | 'visited' | 'skipped';
    visitedAt: string | null; // ISO Date string
    visitLocation: { latitude: number; longitude: number } | null;
  };
}

/**
 * Full detailed BeatPlan for salesperson's detail view (GET /:id/details)
 */
export interface DetailedBeatPlan {
  _id: string;
  name: string;
  status: 'pending' | 'active' | 'completed';
  schedule: {
    startDate: string; // ISO Date string
  };
  progress: BeatPlan['progress'];
  startedAt: string | null;
  completedAt: string | null;
  totalRouteDistance: number;
  employees: AssignedEmployee[];
  createdBy: AssignedEmployee;
  directories: DetailedDirectory[]; // The main list of all stops
  // Backward compatibility fields (populated from directories)
  parties: DetailedDirectory[];
  sites: DetailedDirectory[];
  prospects: DetailedDirectory[];
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
}

// --- SIMPLE INTERFACES FOR DROPDOWNS/SEARCH ---

// Simple User/Salesperson for dropdown
export interface SimpleSalesperson {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
}

// Simple Directory for beat plan creation
export interface SimpleDirectory {
  _id: string;
  name: string;
  ownerName: string;
  location: DirectoryLocation;
  type: 'party' | 'site' | 'prospect';
  // Specific fields
  partyName?: string;
  siteName?: string;
  prospectName?: string;
  panVatNumber?: string;
  'contact.phone'?: string;
}

// --- REQUEST PAYLOADS ---

export interface CreateBeatPlanPayload {
  employeeId: string;
  name: string;
  assignedDate: string; // YYYY-MM-DD format string
  parties: string[]; // Array of Party _ids
  sites: string[]; // Array of Site _ids
  prospects: string[]; // Array of Prospect _ids
}

export interface UpdateBeatPlanPayload {
  name?: string;
  employeeId?: string;
  assignedDate?: string; // YYYY-MM-DD format string
  parties?: string[]; // Array of Party _ids
  sites?: string[]; // Array of Site _ids
  prospects?: string[]; // Array of Prospect _ids
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
  partyId: string; // Backend controller is specific to partyId
}

// --- API RESPONSE INTERFACES ---

export interface GetBeatPlansResponse {
  success: boolean;
  data: BeatPlan[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface GetMyBeatPlansResponse {
  success: boolean;
  data: MyBeatPlan[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface BeatPlanResponse {
  success: boolean;
  data: BeatPlan;
}

export interface DetailedBeatPlanResponse {
  success: boolean;
  data: DetailedBeatPlan;
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
      partyName: string; // Note: Backend optimize is party-only
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
    distance: number; // in km
    distanceInMeters: number;
  };
}

export interface DeleteResponse {
  success: boolean;
  message: string;
}

// --- QUERY/FILTER OPTIONS ---
export interface GetBeatPlansOptions {
  page?: number;
  limit?: number;
  status?: 'pending' | 'active' | 'completed';
}

// --- SERVICE FUNCTIONS (Data Access Layer) ---

const BASE_URL = '/beat-plans';

/**
 * 1. Fetches active salespersons for dropdown selection.
 * (Admin/Manager)
 */
export const getSalespersons = async (): Promise<SimpleSalesperson[]> => {
  const response = await api.get<GetSalespersonsResponse>(
    `${BASE_URL}/salesperson`,
  );
  return response.data.data;
};

/**
 * 2. Fetches available directories (parties, sites, prospects) for plan creation.
 * (Admin/Manager)
 */
export const getAvailableDirectories = async (
  search?: string,
): Promise<GetAvailableDirectoriesResponse['data']> => {
  const response = await api.get<GetAvailableDirectoriesResponse>(
    `${BASE_URL}/available-directories`,
    {
      params: { search },
    },
  );
  return response.data.data;
};

/**
 * 3. Fetches beat plan analytics (stats for the dashboard cards).
 * (Admin/Manager)
 */
export const getBeatPlanAnalytics = async (): Promise<
  GetBeatPlanDataResponse['data']
> => {
  const response = await api.get<GetBeatPlanDataResponse>(`${BASE_URL}/data`);
  return response.data.data;
};

/**
 * 4. Fetches all beat plans with pagination and status filtering.
 * (Admin/Manager - List View)
 */
export const getBeatPlans = async (
  options: GetBeatPlansOptions = {},
): Promise<GetBeatPlansResponse> => {
  const response = await api.get<GetBeatPlansResponse>(BASE_URL, {
    params: options,
  });
  return response.data;
};

/**
 * 5. Fetches a single beat plan by ID (basic details).
 */
export const getBeatPlanById = async (id: string): Promise<BeatPlan> => {
  const response = await api.get<BeatPlanResponse>(`${BASE_URL}/${id}`);
  return response.data.data;
};

/**
 * 6. Creates a new beat plan.
 * (Admin/Manager)
 */
export const createBeatPlan = async (
  payload: CreateBeatPlanPayload,
): Promise<BeatPlan> => {
  const response = await api.post<BeatPlanResponse>(BASE_URL, payload);
  return response.data.data;
};

/**
 * 7. Updates an existing beat plan (often used for resetting/reassigning).
 * (Admin/Manager)
 */
export const updateBeatPlan = async ({
  id,
  updateData,
}: {
  id: string;
  updateData: UpdateBeatPlanPayload;
}): Promise<BeatPlan> => {
  const response = await api.put<BeatPlanResponse>(
    `${BASE_URL}/${id}`,
    updateData,
  );
  return response.data.data;
};

/**
 * 8. Deletes a beat plan.
 * (Admin/Manager)
 */
export const deleteBeatPlan = async (id: string): Promise<DeleteResponse> => {
  const response = await api.delete<DeleteResponse>(`${BASE_URL}/${id}`);
  return response.data;
};

