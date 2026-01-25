import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getFullDashboardData } from '../../../api/dashboardService';
import type { FullDashboardData } from '../../../api/dashboardService';

// Query Keys
export const DASHBOARD_QUERY_KEY = ['dashboardData'];

// Grouped Permissions Interface for the Dashboard
export interface DashboardPermissions {
    canViewStats: boolean;
    canViewTeam: boolean;
    canViewAttendance: boolean;
    canViewLive: boolean;
    canViewTrend: boolean;
}

export type IconType = 'parties' | 'orders' | 'pending' | 'revenue';

export interface StatCardData {
    title: string;
    value: string | number;
    iconType: IconType;
    iconBgColor: string;
    link?: string;
}

interface UseDashboardViewStateResult {
    data: FullDashboardData | undefined;
    isLoading: boolean;
    error: Error | null;
    permissions: DashboardPermissions;
    statCardsData: StatCardData[];
}

/**
 * Custom hook to fetch dashboard data.
 * Handles data fetching logic and permission grouping (SRP).
 * @param hasPermission - Function from useAuth to check granular permissions
 * @param isAuthLoading - Boolean to skip query while auth is initializing
 */
export const useDashboardViewState = (
    hasPermission: (module: string, feature: string) => boolean,
    isAuthLoading: boolean
): UseDashboardViewStateResult => {

    const {
        data,
        isLoading: isDashboardLoading,
        error,
    } = useQuery<FullDashboardData, Error>({
        queryKey: DASHBOARD_QUERY_KEY,
        queryFn: () => getFullDashboardData(hasPermission),
        enabled: !isAuthLoading && typeof hasPermission === 'function',
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    // Centralized Permission Grouping
    const permissions: DashboardPermissions = {
        canViewStats: hasPermission('dashboard', 'viewStats'),
        canViewTeam: hasPermission('dashboard', 'viewTeamPerformance'),
        canViewAttendance: hasPermission('dashboard', 'viewAttendanceSummary'),
        canViewLive: hasPermission('liveTracking', 'viewLiveTracking'),
        canViewTrend: hasPermission('dashboard', 'viewSalesTrend'),
    };

    const statCardsData = useMemo<StatCardData[]>(() => {
        if (!data?.stats) return [];
        const { stats } = data;
        return [
            {
                title: "Total No. of Parties",
                value: stats.totalParties,
                iconType: 'parties',
                iconBgColor: 'bg-blue-100',
                link: '/parties',
            },
            {
                title: "Today's Total Parties",
                value: stats.totalPartiesToday,
                iconType: 'parties',
                iconBgColor: 'bg-blue-100',
                link: '/parties?filter=today',
            },
            {
                title: "Today's Total Orders",
                value: stats.totalOrdersToday,
                iconType: 'orders',
                iconBgColor: 'bg-purple-100',
                link: '/order-lists?filter=today',
            },
            {
                title: 'Total Pending Orders',
                value: stats.pendingOrders,
                iconType: 'pending',
                iconBgColor: 'bg-orange-100',
                link: '/order-lists?status=pending',
            },
            {
                title: "Today's Total Order Value",
                value: `Rs ${Number(stats.totalSalesToday).toLocaleString('en-IN')}`,
                iconType: 'revenue',
                iconBgColor: 'bg-green-100',
            },
        ];
    }, [data]);

    return {
        data,
        isLoading: isDashboardLoading,
        error,
        permissions,
        statCardsData
    };
};

