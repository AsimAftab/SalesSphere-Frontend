import { useQuery } from '@tanstack/react-query';
import { getFullDashboardData } from '../../api/dashboardService';
import type { FullDashboardData } from '../../api/dashboardService';

// Query Key
export const DASHBOARD_QUERY_KEY = ['dashboardData'];

interface UseDashboardResult {
    data: FullDashboardData | undefined;
    isLoading: boolean;
    error: Error | null;
}

/**
 * Custom hook to fetch dashboard data.
 * Follows SRP: Handles data fetching logic and permission injection.
 * 
 * @param isFeatureEnabled - Function to check granular permissions
 * @param isAuthLoading - Boolean to skip query while auth is initializing
 */
export const useDashboardData = (
    isFeatureEnabled: (module: string, feature: string) => boolean,
    isAuthLoading: boolean
): UseDashboardResult => {

    const {
        data,
        isLoading,
        error,
    } = useQuery<FullDashboardData, Error>({
        queryKey: DASHBOARD_QUERY_KEY,
        // Pass strictly strictly typed check function
        queryFn: () => getFullDashboardData(isFeatureEnabled),
        // Ensure the query only runs once the authentication state is determined
        enabled: !isAuthLoading && typeof isFeatureEnabled === 'function',
        // Stale time to prevent over-fetching on simple navigations
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    return { data, isLoading, error };
};
