import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import DashboardContent from './DashboardContent';
import { getFullDashboardData } from '../../api/dashboardService';
import type {
  DashboardStats,
  TeamMemberPerformance,
  AttendanceSummary,
  SalesTrendData,
  LiveActivity, // --- 1. IMPORT LiveActivity type ---
} from '../../api/dashboardService';
import { useAuth } from '../../api/authService';

export interface FullDashboardData {
  stats: DashboardStats;
  teamPerformance: TeamMemberPerformance[];
  attendanceSummary: AttendanceSummary;
  salesTrend: SalesTrendData[];
  liveActivities: LiveActivity[]; // --- 2. ADD liveActivities to interface ---
}

const DASHBOARD_QUERY_KEY = ['dashboardData'];

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  const {
    data: dashboardData,
    isLoading: loading,
    error,
  } = useQuery<FullDashboardData, Error>({
    queryKey: DASHBOARD_QUERY_KEY,
    queryFn: getFullDashboardData,
  });

  return (
    <Sidebar>
      <DashboardContent
        data={dashboardData || null}
        loading={loading}
        error={error ? error.message : null}
        userName={user?.name || 'User'}
      />
    </Sidebar>
  );
};

export default DashboardPage;