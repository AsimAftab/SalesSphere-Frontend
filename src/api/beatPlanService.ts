import api from './api'; 


export interface AssignedEmployee {
    _id: string;
    name: string;
    email: string;
    role: 'salesperson' | 'manager' | 'admin'; 
    avatarUrl?: string;
    phone?: string;
}

export interface AssignedParty {
    _id: string;
    partyName: string;
    ownerName: string;
    contact?: {
        phone: string;
    };
    location: {
        address: string;
        latitude?: number;
        longitude?: number;
    };
    panVatNumber?: string;
}


export interface BeatPlan {
    _id: string;
    name: string;
    employees: AssignedEmployee[];
    parties: AssignedParty[];
    schedule: {
        startDate: string; // Date string (YYYY-MM-DD format is recommended for payloads)
        frequency: 'daily' | 'weekly' | 'monthly' | 'custom';
    };
    status: 'pending' | 'active' | 'completed';
    progress: {
        totalParties: number;
        visitedParties: number;
        percentage: number;
    };
    organizationId: string;
    createdBy: AssignedEmployee;
    createdAt: string;
}

// Simple Party/Shop for dropdown/creation
export interface SimpleParty {
    _id: string;
    partyName: string;
    ownerName: string;
    'location.address': string; // Flattened property from controller's select
    'contact.phone'?: string; // Flattened property
}

// Simple User/Salesperson for dropdown
export interface SimpleSalesperson {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    avatarUrl?: string;
}

// --- Request Payloads ---

// Matches backend validation: employeeId (string), name (string), assignedDate (string), parties (string[])
export interface CreateBeatPlanPayload {
    employeeId: string;
    name: string;
    assignedDate: string; // YYYY-MM-DD format string
    parties: string[]; // Array of Party _ids
}

export interface UpdateBeatPlanPayload {
    name?: string;
    employeeId?: string;
    assignedDate?: string; // YYYY-MM-DD format string
    parties?: string[]; // Array of Party _ids
}

export interface MarkVisitedPayload {
    partyId: string;
    latitude?: number;
    longitude?: number;
}


// --- RESPONSE INTERFACES ---

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

export interface BeatPlanResponse {
    success: boolean;
    data: BeatPlan;
}

export interface GetSalespersonsResponse {
    success: boolean;
    data: SimpleSalesperson[];
}

export interface GetAvailablePartiesResponse {
    success: boolean;
    data: SimpleParty[];
}

export interface GetBeatPlanDataResponse {
    success: boolean;
    data: {
        totalShops: number;
        totalBeatPlans: number;
        activeBeatPlans: number;
        assignedEmployeesCount: number;
        assignedEmployees: SimpleSalesperson[];
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
 */
export const getSalespersons = async (): Promise<SimpleSalesperson[]> => {
    const response = await api.get<GetSalespersonsResponse>(`${BASE_URL}/salesperson`);
    return response.data.data;
};

/**
 * 2. Fetches available parties/shops, optionally filtered by search term.
 */
export const getAvailableParties = async (search?: string): Promise<SimpleParty[]> => {
    const response = await api.get<GetAvailablePartiesResponse>(`${BASE_URL}/available-parties`, {
        params: { search }
    });
    return response.data.data;
};

/**
 * 3. Fetches beat plan analytics (stats for the dashboard cards).
 */
export const getBeatPlanAnalytics = async (): Promise<GetBeatPlanDataResponse['data']> => {
    const response = await api.get<GetBeatPlanDataResponse>(`${BASE_URL}/data`);
    return response.data.data;
};

/**
 * 4. Fetches all beat plans with pagination and status filtering.
 */
export const getBeatPlans = async (options: GetBeatPlansOptions = {}): Promise<GetBeatPlansResponse> => {
    const response = await api.get<GetBeatPlansResponse>(BASE_URL, {
        params: options,
    });
    return response.data;
};

/**
 * 5. Fetches a single beat plan by ID, typically with populated employee/party data.
 */
export const getBeatPlanById = async (id: string): Promise<BeatPlan> => {
    const response = await api.get<BeatPlanResponse>(`${BASE_URL}/${id}`);
    return response.data.data;
};

/**
 * 6. Creates a new beat plan.
 */
export const createBeatPlan = async (payload: CreateBeatPlanPayload): Promise<BeatPlan> => {
    const response = await api.post<BeatPlanResponse>(BASE_URL, payload);
    return response.data.data;
};

/**
 * 7. Updates an existing beat plan (often used for resetting/reassigning).
 */
export const updateBeatPlan = async ({ id, updateData }: { id: string; updateData: UpdateBeatPlanPayload }): Promise<BeatPlan> => {
    const response = await api.put<BeatPlanResponse>(`${BASE_URL}/${id}`, updateData);
    return response.data.data;
};

/**
 * 8. Deletes a beat plan.
 */
export const deleteBeatPlan = async (id: string): Promise<DeleteResponse> => {
    const response = await api.delete<DeleteResponse>(`${BASE_URL}/${id}`);
    return response.data;
};

