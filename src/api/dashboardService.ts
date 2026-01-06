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

/**
 * Fetches dashboard data while respecting subscription restrictions.
 * @param isFeatureEnabled - Checker function passed from useAuth() hook
 */
export const getFullDashboardData = async (
  isFeatureEnabled: (module: string) => boolean
): Promise<FullDashboardData> => {
  try {
    // Safety check for the permission function
    const checkFeature = typeof isFeatureEnabled === 'function' ? isFeatureEnabled : () => false;

    // 1. Define standard requests
    const statsPromise = fetchDashboardStats();
    const teamPerformancePromise = fetchTeamPerformance();
    const attendanceSummaryPromise = fetchAttendanceSummary();
    const salesTrendPromise = fetchSalesTrend();

    // 2. Conditional Request: Only fetch live tracking if the Plan supports it.
    // This prevents the 403 PLAN_FEATURE_UNAVAILABLE error for Basic plans.
    const liveActivitiesPromise = checkFeature('liveTracking')
      ? fetchLiveActivities()
      : Promise.resolve({ data: { data: [] as LiveActivity[] } });

    // 3. Execute all valid promises
    // The order in this array MUST match the destructuring assignment below
    const [
      statsResp,
      teamPerfResp,
      attendanceResp,
      salesTrendResp,
      liveActResp,
    ] = await Promise.all([
      statsPromise,
      teamPerformancePromise,
      attendanceSummaryPromise,
      salesTrendPromise,
      liveActivitiesPromise,
    ]);

    // 4. Extract and return formatted data
    return {
      stats: statsResp.data.data,
      teamPerformance: teamPerfResp.data.data,
      attendanceSummary: attendanceResp.data.data,
      salesTrend: salesTrendResp.data.data,
      liveActivities: liveActResp.data.data,
    };
  } catch (error: any) {
    console.error('Failed to fetch full dashboard data:', error);
    throw error;
  }
};