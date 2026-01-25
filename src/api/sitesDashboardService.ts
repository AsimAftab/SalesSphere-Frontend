import api from './api';

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

const BASE_URL = '/sites-dashboard';

export const getSitesDashboardStats = async (): Promise<SitesDashboardStats> => {
    const response = await api.get(`${BASE_URL}/stats`);
    return response.data.data;
};

export const getCategoryBrandCounts = async (): Promise<CategoryBrandCount[]> => {
    const response = await api.get(`${BASE_URL}/category-brands`);
    return response.data.data;
};

export const getBrandSiteCounts = async (): Promise<BrandSiteCount[]> => {
    const response = await api.get(`${BASE_URL}/brand-sites`);
    return response.data.data;
};

export const getSubOrgSiteCounts = async (): Promise<SubOrgSiteCount[]> => {
    const response = await api.get(`${BASE_URL}/sub-organization-sites`);
    return response.data.data;
};

export const getFullSitesDashboardData = async (): Promise<SitesDashboardData> => {
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
};
