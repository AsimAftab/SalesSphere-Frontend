import api from './api';

// --- Interfaces ---

export interface DashboardStats {
  totalPartiesToday: number;
  totalSalesToday: string;
  totalOrdersToday: number;
  pendingOrders: number;
}

export interface TeamMemberPerformance {
  _id: string;
  avatarUrl?: string;
  role: string;
  name: string;
  orders: number;
  sales: number;
}

export interface AttendanceSummary {
  teamStrength: number;
  present: number;
  absent: number;
  onLeave: number;
  halfDay: number;
  weeklyOff: number;
  attendanceRate: number;
}

export interface SalesTrendData {
  date: string;
  sales: number;
}

export interface LiveActivity {
  sessionId: string;
  beatPlan: {
    _id: string;
    name: string;
    status: string;
  };
  user: {
    _id: string;
    name: string;
    avatarUrl?: string;
    role: string;
  };
  currentLocation: {
    address?: {
      formattedAddress: string;
    };
  };
}

export interface FullDashboardData {
  stats: DashboardStats;
  teamPerformance: TeamMemberPerformance[];
  attendanceSummary: AttendanceSummary;
  salesTrend: SalesTrendData[];
  liveActivities: LiveActivity[];
}

// --- Fetch Functions ---

const fetchDashboardStats = () =>
  api.get<{ data: DashboardStats }>('/dashboard/stats');

const fetchTeamPerformance = () =>
  api.get<{ data: TeamMemberPerformance[] }>('/dashboard/team-performance');

const fetchAttendanceSummary = () =>
  api.get<{ data: AttendanceSummary }>('/dashboard/attendance-summary');

const fetchSalesTrend = () =>
  api.get<{ data: SalesTrendData[] }>('/dashboard/sales-trend');

const fetchLiveActivities = () =>
  api.get<{ data: LiveActivity[] }>('/beat-plans/tracking/active');

// --- Main Data Fetcher ---

// --- Main Data Fetcher ---

/**
 * Fetches dashboard data while respecting subscription restrictions.
 * @param isFeatureEnabled - Checker function passed from useAuth() hook
 */
export const getFullDashboardData = async (
  isFeatureEnabled: (module: string, feature: string) => boolean
): Promise<FullDashboardData> => {
  try {
    // Safety check for the permission function
    const checkFeature = typeof isFeatureEnabled === 'function' ? isFeatureEnabled : () => false;

    // 1. Define standard requests (Stats are usually available)
    const statsPromise = checkFeature('dashboard', 'viewStats')
      ? fetchDashboardStats()
      : Promise.resolve({ data: { data: { totalPartiesToday: 0, totalSalesToday: '0', totalOrdersToday: 0, pendingOrders: 0 } as DashboardStats } });

    // 2. Conditional Requests based on Plan/Permissions

    // Team Performance
    const teamPerformancePromise = checkFeature('dashboard', 'viewTeamPerformance')
      ? fetchTeamPerformance()
      : Promise.resolve({ data: { data: [] as TeamMemberPerformance[] } });

    // Attendance Summary
    const attendanceSummaryPromise = checkFeature('dashboard', 'viewAttendanceSummary')
      ? fetchAttendanceSummary()
      : Promise.resolve({ data: { data: { teamStrength: 0, present: 0, absent: 0, onLeave: 0, halfDay: 0, weeklyOff: 0, attendanceRate: 0 } as AttendanceSummary } });

    // Sales Trend
    const salesTrendPromise = checkFeature('dashboard', 'viewSalesTrend')
      ? fetchSalesTrend()
      : Promise.resolve({ data: { data: [] as SalesTrendData[] } });

    // Live Tracking (Module level check + Feature check)
    const liveActivitiesPromise = checkFeature('liveTracking', 'viewLiveTracking')
      ? fetchLiveActivities()
      : Promise.resolve({ data: { data: [] as LiveActivity[] } });

    // 3. Execute all promises in parallel with error handling for each
    const [
      statsResp,
      teamPerfResp,
      attendanceResp,
      salesTrendResp,
      liveActResp,
    ] = await Promise.all([
      statsPromise.catch(err => {
        console.error('Failed to fetch stats:', err);
        return { data: { data: { totalPartiesToday: 0, totalSalesToday: '0', totalOrdersToday: 0, pendingOrders: 0 } as DashboardStats } };
      }),
      teamPerformancePromise.catch(err => {
        console.error('Failed to fetch team performance:', err);
        return { data: { data: [] as TeamMemberPerformance[] } };
      }),
      attendanceSummaryPromise.catch(err => {
        console.error('Failed to fetch attendance summary:', err);
        return { data: { data: { teamStrength: 0, present: 0, absent: 0, onLeave: 0, halfDay: 0, weeklyOff: 0, attendanceRate: 0 } as AttendanceSummary } };
      }),
      salesTrendPromise.catch(err => {
        console.error('Failed to fetch sales trend:', err);
        return { data: { data: [] as SalesTrendData[] } };
      }),
      liveActivitiesPromise.catch(err => {
        console.error('Failed to fetch live activities:', err);
        return { data: { data: [] as LiveActivity[] } };
      }),
    ]);

    // 4. Extract and return formatted data
    // Note: We use optional chaining or fallback just in case the error handlers returned a structure slighty different than expected, but the structure above matches.
    return {
      stats: statsResp?.data?.data,
      teamPerformance: teamPerfResp?.data?.data,
      attendanceSummary: attendanceResp?.data?.data,
      salesTrend: salesTrendResp?.data?.data,
      liveActivities: liveActResp?.data?.data,
    };
  } catch (error: any) {
    console.error('Failed to fetch full dashboard data:', error);
    throw error;
  }
};