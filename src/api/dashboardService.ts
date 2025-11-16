import api from './api';

// Helper function (unchanged)
const getLast7Days = () => {
  const dates = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }
  return dates;
};

// Mock data (unchanged)
const mockSalesTrend = getLast7Days().map((date) => ({
  date,
  sales: (Math.random() * 100000 + 50000).toFixed(2),
}));

// 1. Data type definitions (DashboardStats, TeamMemberPerformance, etc. are unchanged)
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
  attendanceRate: number;
}

export interface SalesTrendData {
  date: string;
  sales: string;
}

// 2. --- NEW/UPDATED INTERFACE ---
// Based on your '/beat-plans/tracking/active' API response
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

// 3. Individual fetch functions
const fetchDashboardStats = () =>
  api.get<{ data: DashboardStats }>('/dashboard/stats');
const fetchTeamPerformance = () =>
  api.get<{ data: TeamMemberPerformance[] }>('/dashboard/team-performance');
const fetchAttendanceSummary = () =>
  api.get<{ data: AttendanceSummary }>('/dashboard/attendance-summary');
const fetchSalesTrend = () => {
  return Promise.resolve({ data: { data: mockSalesTrend } });
};

// 4. --- NEW/UPDATED FETCH FUNCTION ---
// Fetches data from the endpoint you provided
const fetchLiveActivities = () =>
  api.get<{ data: LiveActivity[] }>('/beat-plans/tracking/active');

// 5. Main function to fetch ALL data
export const getFullDashboardData = async () => {
  try {
    const [
      statsResponse,
      teamPerformanceResponse,
      attendanceSummaryResponse,
      salesTrendResponse,
      liveActivitiesResponse, // --- ADDED ---
    ] = await Promise.all([
      fetchDashboardStats(),
      fetchTeamPerformance(),
      fetchAttendanceSummary(),
      fetchSalesTrend(),
      fetchLiveActivities(), // --- ADDED ---
    ]);

    return {
      stats: statsResponse.data.data,
      teamPerformance: teamPerformanceResponse.data.data,
      attendanceSummary: attendanceSummaryResponse.data.data,
      salesTrend: salesTrendResponse.data.data,
      liveActivities: liveActivitiesResponse.data.data, // --- ADDED ---
    };
  } catch (error) {
    console.error('Failed to fetch full dashboard data:', error);
    throw error;
  }
};