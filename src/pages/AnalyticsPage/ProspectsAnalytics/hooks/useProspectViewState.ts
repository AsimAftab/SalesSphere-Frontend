import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    getProspectStats,
    getProspectCategories,
    getBrandProspectCounts
} from '../../../../api/prospectDashboardService';
import type { ProspectCategory } from '@/api/prospectDashboardService';

// --- Types ---
export interface BrandData {
    name: string;
    count: number;
}

export interface CategoryData {
    categoryName: string;
    brands: BrandData[];
}

export type IconType = 'prospects' | 'categories' | 'brands';

export interface StatCardData {
    title: string;
    value: string | number;
    iconType: IconType;
    iconBgColor: string;
    link?: string;
}

export const useProspectViewState = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    // Query 1: Stats (Cards)
    const {
        data: stats,
        isLoading: isStatsLoading,
        error: statsError
    } = useQuery({
        queryKey: ['prospectStats'],
        queryFn: getProspectStats,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    // Query 2: Categories Definition
    const {
        data: categories,
        isLoading: isCategoriesLoading,
        error: categoriesError
    } = useQuery({
        queryKey: ['prospectCategories'],
        queryFn: getProspectCategories,
        staleTime: 1000 * 60 * 5,
    });

    // Query 3: Brand Counts
    const {
        data: brandCounts,
        isLoading: isBrandCountsLoading,
        error: brandCountsError
    } = useQuery({
        queryKey: ['brandProspectCounts'],
        queryFn: getBrandProspectCounts,
        staleTime: 1000 * 60 * 5,
    });

    // --- Merge Logic (Adapter) ---
    const mergedCategoryData = useMemo<CategoryData[]>(() => {
        if (!categories || !Array.isArray(categories)) return [];

        // 1. Create a lookup map for brand counts
        const brandCountMap = new Map<string, number>();
        if (brandCounts && Array.isArray(brandCounts)) {
            brandCounts.forEach((item: { brand: string; prospectCount: number }) => {
                brandCountMap.set(item.brand.toLowerCase(), item.prospectCount);
            });
        }

        // 2. Merge counts into category definitions
        const merged = categories.map((cat: ProspectCategory) => {
            const brandsWithCounts = (cat.brands || []).map((brandName: string) => ({
                name: brandName,
                count: brandCountMap.get(brandName.toLowerCase()) || 0
            }));

            // Sort brands by count descending
            brandsWithCounts.sort((a, b) => b.count - a.count);

            return {
                categoryName: cat.name,
                brands: brandsWithCounts,
                // Explicitly typed accumulator for reduce
                totalCount: brandsWithCounts.reduce((sum: number, b: { count: number }) => sum + b.count, 0)
            };
        });

        // 3. Sort categories by total activity descending
        merged.sort((a, b) => b.totalCount - a.totalCount);

        // Remove the temp sorting field
        return merged.map(({ categoryName, brands }) => ({ categoryName, brands }));
    }, [categories, brandCounts]);

    const statCardsData = useMemo<StatCardData[]>(() => {
        if (!stats) return [];
        return [
            {
                title: "Total No. of Prospects",
                value: stats.totalProspects,
                iconType: 'prospects',
                iconBgColor: 'bg-blue-100',
                link: '/prospects',
            },
            {
                title: "Today's Total Prospects",
                value: stats.totalProspectsToday,
                iconType: 'prospects',
                iconBgColor: 'bg-blue-100',
                link: '/prospects?filter=today',
            },
            {
                title: "Total No. of Categories",
                value: stats.totalCategories,
                iconType: 'categories',
                iconBgColor: 'bg-purple-100',
            },
            {
                title: "Total No. of Brands",
                value: stats.totalBrands,
                iconType: 'brands',
                iconBgColor: 'bg-orange-100',
            },
        ];
    }, [stats]);

    const paginatedCategories = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return mergedCategoryData.slice(startIndex, startIndex + itemsPerPage);
    }, [currentPage, mergedCategoryData]);

    const globalLoading = isStatsLoading || isCategoriesLoading || isBrandCountsLoading;
    const globalError = statsError || categoriesError || brandCountsError;

    return {
        state: {
            isLoading: globalLoading,
            error: globalError ? (globalError as Error).message : null,
            statCardsData,
            paginatedCategories,
            currentPage,
            itemsPerPage,
            totalItems: mergedCategoryData.length,
        },
        actions: {
            setCurrentPage,
        },
    };
};
