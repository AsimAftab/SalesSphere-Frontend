import { useState } from 'react';
import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { fetchFullAnalyticsData, type FullAnalyticsData } from '../../api/analyticsService';

// Define Permissions Interface
export interface AnalyticsPermissions {
    canViewMonthlyOverview: boolean;
    canViewSalesTrend: boolean;
    canViewCategorySales: boolean;
    canViewTopProducts: boolean;
    canViewTopParties: boolean;
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
    const currentYear = today.getFullYear().toString();
    return { currentMonthName, currentYear };
}

export const useAnalytics = (
    hasPermission: (module: string, feature: string) => boolean,
    isAuthLoading: boolean
) => {
    const { currentMonthName, currentYear } = getCurrentDateDetails();
    const [selectedMonth, setSelectedMonth] = useState(currentMonthName);
    const [selectedYear] = useState(currentYear);

    const queryOptions: AnalyticsQueryOptions = {
        queryKey: ['fullAnalytics', selectedMonth, selectedYear],
        queryFn: () => fetchFullAnalyticsData(selectedMonth, selectedYear, hasPermission),
        placeholderData: (previousData) => previousData,
        enabled: !isAuthLoading && typeof hasPermission === 'function',
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

    return {
        analyticsData,
        loading: isLoading,
        error: errorMessage,
        selectedMonth,
        setSelectedMonth,
        selectedYear,
        permissions
    };
};
