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

// Updated based on API Response (Screenshot 2)
export interface AttendanceSummary {
  teamStrength: number;
  present: number;
  absent: number;
  onLeave: number;
  halfDay: number;    // Added field
  weeklyOff: number;  // Added field
  attendanceRate: number;
}

// Updated based on API Response (Screenshot 1)
export interface SalesTrendData {
  date: string;
  sales: number; // Changed to number to match API response (e.g., 442)
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

// Updated: Replaced Mock Data with Real API Call
const fetchSalesTrend = () =>
  api.get<{ data: SalesTrendData[] }>('/dashboard/sales-trend');

const fetchLiveActivities = () =>
  api.get<{ data: LiveActivity[] }>('/beat-plans/tracking/active');

// --- Main Data Fetcher ---

export const getFullDashboardData = async (): Promise<FullDashboardData> => {
  try {
    const [
      statsResponse,
      teamPerformanceResponse,
      attendanceSummaryResponse,
      salesTrendResponse,
      liveActivitiesResponse,
    ] = await Promise.all([
      fetchDashboardStats(),
      fetchTeamPerformance(),
      fetchAttendanceSummary(),
      fetchSalesTrend(),
      fetchLiveActivities(),
    ]);

    return {
      stats: statsResponse.data.data,
      teamPerformance: teamPerformanceResponse.data.data,
      attendanceSummary: attendanceSummaryResponse.data.data,
      salesTrend: salesTrendResponse.data.data,
      liveActivities: liveActivitiesResponse.data.data,
    };
  } catch (error) {
    console.error('Failed to fetch full dashboard data:', error);
    throw error;
  }
};