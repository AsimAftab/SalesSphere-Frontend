import api from './api';

// --- Interfaces ---

export interface DashboardStats {
  totalPartiesToday: number;
  totalParties: number;
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

export interface PartyDistributionItem {
  type: string;
  count: number;
}

export interface PartyDistributionData {
  distribution: PartyDistributionItem[];
  total: number;
}

// --- Domain Mapper (Enterprise Logic Layer) ---

/**
 * Centralizes formatting and default state logic.
 * Ensures UI components, charts, and exports display data identically.
 */
export class DashboardMapper {
  static formatCurrency(value: string | number): string {
    const numericValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numericValue)) return '₹0.00';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(numericValue);
  }

  static formatChartDate(dateString: string): string {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  }

  // ADD THIS METHOD TO FIX THE ERROR
  static formatRate(rate: number): string {
    return `${rate}%`;
  }

  static getInitials(name: string): string {
    return name ? name.substring(0, 1).toUpperCase() : '';
  }

  // Fallback "Null Objects" for restricted or failed requests
  static readonly INITIAL_STATS: DashboardStats = {
    totalPartiesToday: 0,
    totalParties: 0,
    totalSalesToday: '0',
    totalOrdersToday: 0,
    pendingOrders: 0,
  };

  static readonly INITIAL_ATTENDANCE: AttendanceSummary = {
    teamStrength: 0,
    present: 0,
    absent: 0,
    onLeave: 0,
    halfDay: 0,
    weeklyOff: 0,
    attendanceRate: 0,
  };
}

// --- Fetch Functions (Private to module) ---

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

export interface CollectionTrendItem {
  amount: number;
  partyName: string;
  paymentMethod: string;
}

export interface CollectionTrendData {
  date: string;
  amount: number;
  collections: CollectionTrendItem[];
}

export const getPartyDistribution = async () => {
  const response = await api.get<{ data: PartyDistributionData }>('/dashboard/party-distribution');
  return response.data.data;
};

export const getCollectionTrend = async () => {
  const response = await api.get<{ data: CollectionTrendData[] }>('/dashboard/collection-trend');
  return response.data.data;
};

// --- Main Aggregator Fetcher ---

/**
 * Fetches full dashboard data with permission-based isolation and error resilience.
 * Use Promise.all with individual catch handlers to ensure a single failing 
 * microservice doesn't break the entire dashboard UI.
 */
export const getFullDashboardData = async (
  isFeatureEnabled: (module: string, feature: string) => boolean
): Promise<FullDashboardData> => {
  const check = typeof isFeatureEnabled === 'function' ? isFeatureEnabled : () => false;

  // 1. Define promises with conditional logic based on permissions
  const statsPromise = check('dashboard', 'viewStats')
    ? fetchDashboardStats()
    : Promise.resolve({ data: { data: DashboardMapper.INITIAL_STATS } });

  const teamPromise = check('dashboard', 'viewTeamPerformance')
    ? fetchTeamPerformance()
    : Promise.resolve({ data: { data: [] } });

  const attendancePromise = check('dashboard', 'viewAttendanceSummary')
    ? fetchAttendanceSummary()
    : Promise.resolve({ data: { data: DashboardMapper.INITIAL_ATTENDANCE } });

  const trendPromise = check('dashboard', 'viewSalesTrend')
    ? fetchSalesTrend()
    : Promise.resolve({ data: { data: [] } });

  const livePromise = check('liveTracking', 'viewLiveTracking')
    ? fetchLiveActivities()
    : Promise.resolve({ data: { data: [] } });

  try {
    // 2. Execute parallel fetches with individual error isolation (Resilience Pattern)
    const [stats, team, attendance, trend, live] = await Promise.all([
      statsPromise.catch(() => {

        return { data: { data: DashboardMapper.INITIAL_STATS } };
      }),
      teamPromise.catch(() => {

        return { data: { data: [] as TeamMemberPerformance[] } };
      }),
      attendancePromise.catch(() => {

        return { data: { data: DashboardMapper.INITIAL_ATTENDANCE } };
      }),
      trendPromise.catch(() => {

        return { data: { data: [] as SalesTrendData[] } };
      }),
      livePromise.catch(() => {

        return { data: { data: [] as LiveActivity[] } };
      }),
    ]);

    // 3. Return aggregated data
    return {
      stats: stats.data.data,
      teamPerformance: team.data.data,
      attendanceSummary: attendance.data.data,
      salesTrend: trend.data.data,
      liveActivities: live.data.data,
    };
  } catch (criticalError) {
    // Return empty dataset rather than crashing the page
    return {
      stats: DashboardMapper.INITIAL_STATS,
      teamPerformance: [],
      attendanceSummary: DashboardMapper.INITIAL_ATTENDANCE,
      salesTrend: [],
      liveActivities: [],
    };
  }
};