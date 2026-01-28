import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getFullDashboardData } from '../../../api/dashboardService';
import type { FullDashboardData } from '../../../api/dashboardService';
import { transformToStatCards } from '../utils/DashboardMapper';

// Query Keys
export const DASHBOARD_QUERY_KEY = ['dashboardData'];

// Grouped Permissions Interface for the Dashboard
export interface DashboardPermissions {
    canViewStats: boolean;
    canViewTeam: boolean;
    canViewAttendance: boolean;
    canViewLive: boolean;
    canViewTrend: boolean;
    canViewPartyDistribution: boolean;
    canViewCollectionTrend: boolean;
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
        canViewAttendance: hasPermission('dashboard', 'viewAttendanceSummary') && hasPermission('attendance', 'view'),
        canViewLive: hasPermission('liveTracking', 'viewLiveTracking') && hasPermission('liveTracking', 'view'),
        canViewTrend: hasPermission('dashboard', 'viewSalesTrend'),
        // Ensure module is present (parties/collections) AND dashboard feature is enabled
        canViewPartyDistribution: hasPermission('dashboard', 'viewPartyDistribution') && hasPermission('parties', 'view'),
        canViewCollectionTrend: hasPermission('dashboard', 'viewCollectionTrend') && hasPermission('collections', 'view'),
    };

    const statCardsData = useMemo<StatCardData[]>(() => {
        return transformToStatCards(data);
    }, [data]);

    return {
        data,
        isLoading: isDashboardLoading,
        error,
        permissions,
        statCardsData
    };
};
