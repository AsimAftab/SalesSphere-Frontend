import React from 'react';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import DashboardContent from './DashboardContent';
import { useAuth } from '../../api/authService';
import { useDashboardData } from './useDashboard';


const DashboardPage: React.FC = () => {
  // Extract isFeatureEnabled, hasPermission and auth loading state from the hook
  const { user, hasPermission, isLoading: authLoading } = useAuth();

  // Use the custom logic hook (SRP)
  const { data: dashboardData, isLoading: dataLoading, error } = useDashboardData(hasPermission, authLoading);

  // Combine auth loading and data loading for the UI
  const loading = authLoading || dataLoading;

  return (
    <Sidebar>
      <DashboardContent
        data={dashboardData || null}
        loading={loading}
        error={error ? error.message : null}
        userName={user?.name || 'User'}
        hasPermission={hasPermission}
      />
    </Sidebar>
  );
};

export default DashboardPage;