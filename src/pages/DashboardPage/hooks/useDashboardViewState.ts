import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getFullDashboardData, getPartyDistribution, getCollectionTrend } from '@/api/Dashboard';
import type { FullDashboardData, PartyDistributionData, CollectionTrendData, CollectionTrendItem } from '@/api/Dashboard';
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

export interface FlattenedCollection {
    id: string;
    receivedDate: string;
    paymentMode: string;
    partyName: string;
    paidAmount: number;
}

interface UseDashboardViewStateResult {
    data: FullDashboardData | undefined;
    isLoading: boolean;
    error: Error | null;
    permissions: DashboardPermissions;
    statCardsData: StatCardData[];
    partyDistribution: PartyDistributionData | undefined;
    collectionTrend: FlattenedCollection[];
}

/**
 * Custom hook to fetch dashboard data.
 * Handles data fetching logic and permission grouping (SRP).
 * @param hasPermission - Function from useAuth to check granular permissions
 * @param isAuthLoading - Boolean to skip query while auth is initializing
 */
export const useDashboardViewState = (
    hasPermission: (module: string, feature: string) => boolean,
    isPlanFeatureEnabled: (module: string) => boolean,
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
    // Logic: 
    // 1. Role Check: via `hasPermission('dashboard', ...)`
    // 2. Plan Check: via `isPlanFeatureEnabled('module')`
    // We avoid strict `hasPermission('module', 'view')` because a user (e.g. Manager) might have 
    // dashboard access but not full module access, yet should still see the summary card if the PLAN has the module.
    const permissions: DashboardPermissions = {
        canViewStats: hasPermission('dashboard', 'viewStats'),
        canViewTeam: hasPermission('dashboard', 'viewTeamPerformance'),
        canViewAttendance: hasPermission('dashboard', 'viewAttendanceSummary') && isPlanFeatureEnabled('attendance'),
        canViewLive: hasPermission('liveTracking', 'viewLiveTracking') && isPlanFeatureEnabled('liveTracking'),
        canViewTrend: hasPermission('dashboard', 'viewSalesTrend'),

        // For Parties/Collections, we stick to strict checks or relax them? 
        // Let's relax to Plan Check as well to be consistent.
        // If a Manager shouldn't see Parties, they shouldn't have 'viewPartyDistribution' permission either.
        canViewPartyDistribution: hasPermission('dashboard', 'viewPartyDistribution') && isPlanFeatureEnabled('parties'),
        canViewCollectionTrend: hasPermission('dashboard', 'viewCollectionTrend') && isPlanFeatureEnabled('collections'),
    };

    const { data: partyDistribution } = useQuery({
        queryKey: ['partyDistribution'],
        queryFn: getPartyDistribution,
        staleTime: 1000 * 60 * 15,
        enabled: !isAuthLoading && permissions.canViewPartyDistribution,
    });

    const { data: collectionTrend = [] } = useQuery({
        queryKey: ['collectionTrend'],
        queryFn: () => getCollectionTrend(),
        select: (data: CollectionTrendData[]) => {
            const flattened = data.flatMap((day: CollectionTrendData) =>
                day.collections ? day.collections.map((item: CollectionTrendItem, index: number) => ({
                    id: `${day.date}-${index}`,
                    receivedDate: day.date,
                    paymentMode: item.paymentMethod,
                    partyName: item.partyName,
                    paidAmount: item.amount,
                })) : []
            );
            return flattened.sort((a, b) => new Date(b.receivedDate).getTime() - new Date(a.receivedDate).getTime());
        },
        staleTime: 0,
        refetchOnWindowFocus: true,
        enabled: !isAuthLoading && permissions.canViewCollectionTrend,
    });

    const statCardsData = useMemo<StatCardData[]>(() => {
        return transformToStatCards(data);
    }, [data]);

    return {
        data,
        isLoading: isDashboardLoading,
        error,
        permissions,
        statCardsData,
        partyDistribution,
        collectionTrend,
    };
};
