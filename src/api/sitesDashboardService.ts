import api from './api';
import { API_ENDPOINTS } from './endpoints';
import { handleApiError } from './errors';

export interface SitesDashboardStats {
    timezone: string;
    totalSites: number;
    totalSitesToday: number;
    totalCategories: number;
    totalBrands: number;
    totalTechnicians: number;
}

export interface CategoryBrandCount {
    _id: string;
    name: string;
    brands: string[];
    brandCount: number;
}

export interface BrandSiteCount {
    brand: string;
    siteCount: number;
}

export interface SubOrgSiteCount {
    subOrganization: string;
    siteCount: number;
}

export interface SitesDashboardData {
    stats: SitesDashboardStats;
    categoryBrands: CategoryBrandCount[];
    brandSites: BrandSiteCount[];
    subOrgSites: SubOrgSiteCount[];
}

export const getSitesDashboardStats = async (): Promise<SitesDashboardStats> => {
    try {
        const response = await api.get(API_ENDPOINTS.sitesDashboard.STATS);
        return response.data.data;
    } catch (error: unknown) {
        throw handleApiError(error, 'Failed to fetch sites dashboard stats');
    }
};

export const getCategoryBrandCounts = async (): Promise<CategoryBrandCount[]> => {
    try {
        const response = await api.get(API_ENDPOINTS.sitesDashboard.CATEGORY_BRANDS);
        return response.data.data;
    } catch (error: unknown) {
        throw handleApiError(error, 'Failed to fetch category brand counts');
    }
};

export const getBrandSiteCounts = async (): Promise<BrandSiteCount[]> => {
    try {
        const response = await api.get(API_ENDPOINTS.sitesDashboard.BRAND_SITES);
        return response.data.data;
    } catch (error: unknown) {
        throw handleApiError(error, 'Failed to fetch brand site counts');
    }
};

export const getSubOrgSiteCounts = async (): Promise<SubOrgSiteCount[]> => {
    try {
        const response = await api.get(API_ENDPOINTS.sitesDashboard.SUB_ORG_SITES);
        return response.data.data;
    } catch (error: unknown) {
        throw handleApiError(error, 'Failed to fetch sub-organization site counts');
    }
};

export const getFullSitesDashboardData = async (): Promise<SitesDashboardData> => {
    try {
        const [stats, categoryBrands, brandSites, subOrgSites] = await Promise.all([
            getSitesDashboardStats(),
            getCategoryBrandCounts(),
            getBrandSiteCounts(),
            getSubOrgSiteCounts()
        ]);

        return {
            stats,
            categoryBrands,
            brandSites,
            subOrgSites
        };
    } catch (error: unknown) {
        throw handleApiError(error, 'Failed to fetch sites dashboard data');
    }
};
