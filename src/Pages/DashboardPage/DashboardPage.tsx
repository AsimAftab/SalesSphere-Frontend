import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import DashboardContent from './DashboardContent';
import { getFullDashboardData } from '../../api/dashboardService';
import type { FullDashboardData } from '../../api/dashboardService';
import { useAuth } from '../../api/authService';

const DASHBOARD_QUERY_KEY = ['dashboardData'];

const DashboardPage: React.FC = () => {
  // Extract isFeatureEnabled and auth loading state from the hook
  const { user, isFeatureEnabled, isLoading: authLoading } = useAuth();

  const {
    data: dashboardData,
    isLoading: dataLoading,
    error,
  } = useQuery<FullDashboardData, Error>({
    queryKey: DASHBOARD_QUERY_KEY,
    // Logic update: Pass the feature checker function to the service
    queryFn: () => getFullDashboardData(isFeatureEnabled),
    // Ensure the query only runs once the authentication state is determined
    enabled: !authLoading && typeof isFeatureEnabled === 'function',
    // Optional: Add refetch interval if you want live updates
    // refetchInterval: 30000, 
  });

  // Combine auth loading and data loading for the UI
  const loading = authLoading || dataLoading;

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