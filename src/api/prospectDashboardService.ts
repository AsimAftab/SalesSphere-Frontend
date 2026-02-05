import api from './api';
import { API_ENDPOINTS } from './endpoints';
import { handleApiError } from './errors';

// --- Interfaces ---

export interface ProspectDashboardStats {
    timezone: string;
    totalProspects: number;
    totalProspectsToday: number;
    totalCategories: number;
    totalBrands: number;
}

export interface CategoryBrandCount {
    _id: string; // Category ID
    name: string;
    brandCount: number;
}

export interface BrandProspectCount {
    brand: string;
    prospectCount: number;
}

// New Interface for Category Definitions
export interface ProspectCategory {
    _id: string;
    name: string;
    brands: string[];
    organizationId: string;
}

// --- Fetch Functions ---

export const getProspectStats = async () => {
    try {
        const response = await api.get<{ data: ProspectDashboardStats }>(API_ENDPOINTS.prospectDashboard.STATS);
        return response.data.data;
    } catch (error: unknown) {
        throw handleApiError(error, 'Failed to fetch prospect stats');
    }
};

export const getCategoryBrandCounts = async () => {
    try {
        const response = await api.get<{ data: CategoryBrandCount[], count: number }>(API_ENDPOINTS.prospectDashboard.CATEGORY_BRANDS);
        return response.data.data;
    } catch (error: unknown) {
        throw handleApiError(error, 'Failed to fetch category brand counts');
    }
};

export const getBrandProspectCounts = async () => {
    try {
        const response = await api.get<{ data: BrandProspectCount[], count: number }>(API_ENDPOINTS.prospectDashboard.BRAND_PROSPECTS);
        return response.data.data;
    } catch (error: unknown) {
        throw handleApiError(error, 'Failed to fetch brand prospect counts');
    }
};

export const getProspectCategories = async () => {
    try {
        const response = await api.get<{ data: ProspectCategory[] }>(API_ENDPOINTS.prospects.CATEGORIES);
        return response.data.data;
    } catch (error: unknown) {
        throw handleApiError(error, 'Failed to fetch prospect categories');
    }
};
