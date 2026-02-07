// DashboardPage Types
// Re-export domain types from the service
export type {
    FullDashboardData,
    PartyDistributionData,
    CollectionTrendData,
    CollectionTrendItem
} from '@/api/Dashboard';

// Re-export from the hook (these are defined there)
export type {
    DashboardPermissions,
    IconType,
    StatCardData,
    FlattenedCollection
} from './hooks/useDashboardViewState';
