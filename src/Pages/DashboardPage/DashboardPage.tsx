import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import DashboardContent from './DashboardContent';
import { getFullDashboardData } from '../../api/dashboardService';
import type { FullDashboardData } from '../../api/dashboardService';
import { useAuth } from '../../api/authService';

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
    // Optional: Add refetch interval if you want live updates
    // refetchInterval: 30000, 
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