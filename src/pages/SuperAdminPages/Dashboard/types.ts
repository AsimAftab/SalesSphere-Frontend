import type { OrganizationStats, UserStats } from '@/api/SuperAdmin';

export interface DashboardStats {
    organizations: OrganizationStats;
    users: UserStats;
}

export interface DashboardState {
    data: DashboardStats | null;
    isLoading: boolean;
    error: string | null;
}
