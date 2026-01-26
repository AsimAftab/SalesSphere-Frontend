import { useState, useMemo } from 'react';
import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { fetchFullAnalyticsData, type FullAnalyticsData } from '../../../../api/salesDashboardService';
import { IndianRupee, ShoppingCart } from 'lucide-react';
import React from 'react';

// Define Permissions Interface
export interface AnalyticsPermissions {
    canViewMonthlyOverview: boolean;
    canViewSalesTrend: boolean;
    canViewCategorySales: boolean;
    canViewTopProducts: boolean;
    canViewTopParties: boolean;
}

export interface StatCardData {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    iconBgColor: string;
}

type AnalyticsData = FullAnalyticsData;
type AnalyticsError = Error;

type AnalyticsQueryOptions = UseQueryOptions<
    AnalyticsData,
    AnalyticsError,
    AnalyticsData,
    ['fullAnalytics', string, string]
>;

const getCurrentDateDetails = () => {
    const today = new Date();
    const currentMonthName = today.toLocaleString('default', { month: 'long' });
    const currentYear = today.getFullYear();
    return { currentMonthName, currentYear };
}

export const useSalesViewState = (
    hasPermission: (module: string, feature: string) => boolean,
    isAuthLoading: boolean,
    enabled: boolean = true
) => {
    const { currentMonthName, currentYear } = getCurrentDateDetails();
    const [selectedMonth, setSelectedMonth] = useState(currentMonthName);
    const [selectedYear] = useState(currentYear);

    const queryOptions: AnalyticsQueryOptions = {
        queryKey: ['fullAnalytics', selectedMonth, selectedYear.toString()],
        queryFn: () => fetchFullAnalyticsData(selectedMonth, selectedYear.toString(), hasPermission),
        placeholderData: (previousData) => previousData,
        enabled: !isAuthLoading && typeof hasPermission === 'function' && enabled,
        staleTime: 0,
    };

    const {
        data: analyticsData,
        isLoading,
        isError,
        error
    } = useQuery(queryOptions);

    const errorMessage = isError ? error?.message || 'Failed to load analytics data. Please try again later.' : null;

    // Centralized Permission Logic
    const permissions: AnalyticsPermissions = {
        canViewMonthlyOverview: hasPermission('analytics', 'viewMonthlyOverview'),
        canViewSalesTrend: hasPermission('analytics', 'viewSalesTrend'),
        canViewCategorySales: hasPermission('analytics', 'viewCategorySales'),
        canViewTopProducts: hasPermission('analytics', 'viewTopProducts'),
        canViewTopParties: hasPermission('analytics', 'viewTopParties'),
    };

    // Prepare Stat Cards Data
    const statCardsData = useMemo<StatCardData[]>(() => {
        if (!analyticsData) return [];
        const { stats } = analyticsData;

        return [
            {
                title: "Total Order Value",
                value: `Rs ${stats.totalOrderValue.toLocaleString('en-IN')}`,
                icon: React.createElement(IndianRupee, { className: "w-6 h-6 text-green-600" }),
                iconBgColor: 'bg-green-100',
            },
            {
                title: "Total Orders",
                value: stats.totalOrders.toLocaleString('en-IN'),
                icon: React.createElement(ShoppingCart, { className: "w-6 h-6 text-blue-600" }),
                iconBgColor: 'bg-blue-100',
            }
        ];
    }, [analyticsData]);

    return {
        state: {
            data: analyticsData || null,
            loading: isLoading,
            error: errorMessage,
            selectedMonth,
            selectedYear,
            statCardsData,
        },
        actions: {
            setSelectedMonth,
        },
        permissions
    };
};
