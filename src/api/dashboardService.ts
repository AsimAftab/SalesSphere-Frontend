import api from './api';

// 1. Define the data types for each API response

// For the top stat cards
export interface DashboardStats {
  totalParties: number;
  totalSales: string;
  totalOrders: number;
  pendingOrders: number;
}

// For the Team Performance list
export interface TeamMemberPerformance {
  id: string;
  name: string;
  orders: number;
  sales: string;
  avatarInitials: string;
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
  labels: string[]; // e.g., ['Mon', 'Tue', 'Wed']
  data: number[];   // e.g., [150, 230, 224]
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
const fetchSalesTrend = () => api.get<{ data: SalesTrendData }>('/dashboard/sales-trend'); // Changed from /sales-trend
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

