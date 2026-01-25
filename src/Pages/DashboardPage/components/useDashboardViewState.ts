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

interface UseDashboardViewStateResult {
    data: FullDashboardData | undefined;
    isLoading: boolean;
    error: Error | null;
    permissions: DashboardPermissions;
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

    return {
        data,
        isLoading: isDashboardLoading,
        error,
        permissions
    };
};

