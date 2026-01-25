import api from './api';

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
    const response = await api.get<{ data: ProspectDashboardStats }>('/prospect-dashboard/stats');
    return response.data.data;
};

export const getCategoryBrandCounts = async () => {
    const response = await api.get<{ data: CategoryBrandCount[], count: number }>('/prospect-dashboard/category-brands');
    return response.data.data;
};

export const getBrandProspectCounts = async () => {
    const response = await api.get<{ data: BrandProspectCount[], count: number }>('/prospect-dashboard/brand-prospects');
    return response.data.data;
};

export const getProspectCategories = async () => {
    const response = await api.get<{ data: ProspectCategory[] }>('/prospects/categories');
    return response.data.data;
};
