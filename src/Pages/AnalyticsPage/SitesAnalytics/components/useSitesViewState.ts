import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getFullSitesDashboardData } from '../../../../api/sitesDashboardService';
import type { SitesDashboardData, SubOrgSiteCount } from '../../../../api/sitesDashboardService';
import { getSiteCategoriesList, getSiteSubOrganizations } from '../../../../api/siteService';
import type { SiteCategoryData } from '../../../../api/siteService';

export const SITES_DASHBOARD_QUERY_KEY = ['sitesDashboardData'];
export const SITES_CATEGORIES_QUERY_KEY = ['sitesCategoriesData'];
export const SITES_SUB_ORGS_QUERY_KEY = ['sitesSubOrgsData'];

export type IconType = 'sites' | 'today' | 'categories' | 'brands' | 'workers';

export interface StatCardData {
    title: string;
    value: string | number;
    iconType: IconType;
    iconBgColor: string;
    link?: string;
}

export interface BrandSiteData {
    name: string;
    siteCount: number;
}

export interface CategoryCardData {
    categoryName: string;
    brands: BrandSiteData[];
}

interface UseSitesViewStateResult {
    data: SitesDashboardData | undefined;
    isLoading: boolean;
    error: Error | null;
    statCardsData: StatCardData[];
    paginatedCategories: CategoryCardData[];
    subOrgSites: SubOrgSiteCount[];
    currentPage: number;
    itemsPerPage: number;
    totalCategoryItems: number;
    setCurrentPage: (page: number) => void;
}

export const useSitesViewState = (enabled: boolean = true): UseSitesViewStateResult => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    // Query 1: Dashboard Stats (Counts)
    const {
        data,
        isLoading: isDashboardLoading,
        error: dashboardError
    } = useQuery<SitesDashboardData, Error>({
        queryKey: SITES_DASHBOARD_QUERY_KEY,
        queryFn: getFullSitesDashboardData,
        enabled: enabled,
        staleTime: 1000 * 60 * 5,
    });

    // Query 2: Full Category List (includes Brands for mapping)
    const {
        data: siteCategories,
        isLoading: isCategoriesLoading,
        error: categoriesError
    } = useQuery<SiteCategoryData[], Error>({
        queryKey: SITES_CATEGORIES_QUERY_KEY,
        queryFn: getSiteCategoriesList,
        enabled: enabled,
        staleTime: 1000 * 60 * 5,
    });

    // Query 3: Full Sub-Organization List
    const {
        data: subOrgList,
        isLoading: isSubOrgsLoading,
        error: subOrgsError
    } = useQuery<string[], Error>({
        queryKey: SITES_SUB_ORGS_QUERY_KEY,
        queryFn: getSiteSubOrganizations,
        enabled: enabled,
        staleTime: 1000 * 60 * 5,
    });

    // --- Merge Logic for Category Cards ---
    const mergedCategoryData = useMemo<CategoryCardData[]>(() => {
        if (!data || !siteCategories) return [];
        const { brandSites } = data;

        // 1. Create lookup for Brand -> Site Count (from Dashboard API)
        const brandSiteCountMap = new Map<string, number>();
        brandSites.forEach(item => {
            brandSiteCountMap.set(item.brand.toLowerCase(), item.siteCount);
        });

        // 2. Merge into Categories (using full list from SiteService)
        const merged = siteCategories.map((cat: SiteCategoryData) => {
            // "cat.brands" comes from the full category object
            const brandsWithCounts = (cat.brands || []).map((brandName: string) => ({
                name: brandName,
                siteCount: brandSiteCountMap.get(brandName.toLowerCase()) || 0
            }));

            // Sort brands by site count descending
            brandsWithCounts.sort((a: BrandSiteData, b: BrandSiteData) => b.siteCount - a.siteCount);

            return {
                categoryName: cat.name,
                brands: brandsWithCounts,
                // Helper: Total sites in category
                totalSites: brandsWithCounts.reduce((sum: number, b: BrandSiteData) => sum + b.siteCount, 0)
            };
        });

        // 3. Sort categories by total sites activity descending
        merged.sort((a: any, b: any) => b.totalSites - a.totalSites);

        return merged.map(({ categoryName, brands }: CategoryCardData) => ({ categoryName, brands }));
    }, [data, siteCategories]);

    // --- Merge Logic for Sub-Organization Cards ---
    const mergedSubOrgData = useMemo<SubOrgSiteCount[]>(() => {
        if (!data?.subOrgSites && !subOrgList) return [];

        const counts = data?.subOrgSites || [];
        const allSubOrgs = subOrgList || [];

        // 1. Create lookup for SubOrg -> Site Count
        const countMap = new Map<string, number>();
        counts.forEach(item => {
            countMap.set(item.subOrganization, item.siteCount);
        });

        // 2. Map full list, default to 0
        const merged = allSubOrgs.map(name => ({
            subOrganization: name,
            siteCount: countMap.get(name) || 0
        }));

        // 3. Sort by count descending
        merged.sort((a, b) => b.siteCount - a.siteCount);

        return merged;
    }, [data, subOrgList]);

    const isLoading = isDashboardLoading || isCategoriesLoading || isSubOrgsLoading;
    const error = dashboardError || categoriesError || subOrgsError;

    const statCardsData = useMemo<StatCardData[]>(() => {
        if (!data?.stats) return [];
        const { stats } = data;

        return [
            {
                title: 'Total No. of Sites',
                value: stats.totalSites,
                iconType: 'sites',
                iconBgColor: 'bg-blue-100',
                link: '/sites'
            },
            {
                title: "Today's Total Sites",
                value: stats.totalSitesToday,
                iconType: 'sites',
                iconBgColor: 'bg-blue-100',
                link: '/sites?filter=today'
            },
            {
                title: 'Total No. of Categories',
                value: stats.totalCategories,
                iconType: 'categories',
                iconBgColor: 'bg-purple-100',
            },
            {
                title: 'Total No. of Brands',
                value: stats.totalBrands,
                iconType: 'brands',
                iconBgColor: 'bg-orange-100',
            },
            {
                title: 'Total No. of Workers',
                value: stats.totalTechnicians,
                iconType: 'workers', // Renamed from technicians to workers
                iconBgColor: 'bg-red-100', // Changed to Red for vibrancy
            }
        ];
    }, [data]);

    const paginatedCategories = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return mergedCategoryData.slice(startIndex, startIndex + itemsPerPage);
    }, [currentPage, itemsPerPage, mergedCategoryData]);

    return {
        data,
        isLoading,
        error,
        statCardsData,
        paginatedCategories,
        subOrgSites: mergedSubOrgData,
        currentPage,
        itemsPerPage,
        totalCategoryItems: mergedCategoryData.length,
        setCurrentPage
    };
};
