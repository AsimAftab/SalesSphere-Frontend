import api from './api';

// Helper function to generate last 7 days dates
const getLast7Days = () => {
  const dates = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }
  return dates;
};

// Mock data for testing
const mockSalesTrend = getLast7Days().map(date => ({
  date,
  sales: (Math.random() * 100000 + 50000).toFixed(2)
}));

// 1. Define the data types for each API response

// For the top stat cards
export interface DashboardStats {
  totalParties: number;
  totalSales: string;
  totalOrders: number;
  pendingOrders: number;
}

// In src/api/dashboardService.ts
export interface TeamMemberPerformance {
  _id: string; // <-- Add this
  avatarUrl?: string; // <-- Add this
  role: string; // <-- Add this
  name: string;
  orders: number;
  sales: number;
}

// For the Attendance Summary
export interface AttendanceSummary {
  teamStrength: number;
  present: number;
  absent: number;
  onLeave: number;
  attendanceRate: number;
}

// For the Sales Trend chart (assuming a simple structure)
export interface SalesTrendData {
  date: string;
  sales: string; // Or number, if your backend sends it as a number
}


// For Live Field Activities
/*export interface LiveActivity {
  id: string;
  agentName: string;
  activity: string;
  location: string;
  time: string;
}*/

// 2. Create individual functions to fetch data from each endpoint
const fetchDashboardStats = () => api.get<{ data: DashboardStats }>('/dashboard/stats'); // Changed from /stats
const fetchTeamPerformance = () => api.get<{ data: TeamMemberPerformance[] }>('/dashboard/team-performance');
const fetchAttendanceSummary = () => api.get<{ data: AttendanceSummary }>('/dashboard/attendance-summary');
const fetchSalesTrend = () => {
  // For development/testing, return mock data
  return Promise.resolve({ data: { data: mockSalesTrend } });
  // For production, use the actual API
  // return api.get<{ data: SalesTrendData[] }>('/dashboard/sales-trend');
};
//const fetchLiveActivities = () => api.get<{ data: LiveActivity[] }>('/dashboard/live-activities'); // This might need verification


// 3. Create a main function to fetch ALL dashboard data concurrently
export const getFullDashboardData = async () => {
  try {
    const [
      statsResponse,
      teamPerformanceResponse,
      attendanceSummaryResponse,
      salesTrendResponse,
      //liveActivitiesResponse
    ] = await Promise.all([
      fetchDashboardStats(),
      fetchTeamPerformance(),
      fetchAttendanceSummary(),
      fetchSalesTrend(),
      //fetchLiveActivities()
    ]);

    return {
      stats: statsResponse.data.data,
      teamPerformance: teamPerformanceResponse.data.data,
      attendanceSummary: attendanceSummaryResponse.data.data,
      salesTrend: salesTrendResponse.data.data,
      //liveActivities: liveActivitiesResponse.data.data,
    };
  } catch (error) {
    console.error("Failed to fetch full dashboard data:", error);
    throw error;
  }
};

