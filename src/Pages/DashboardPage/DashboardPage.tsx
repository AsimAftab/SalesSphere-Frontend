import React from 'react';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import DashboardContent from './DashboardContent';
import ErrorBoundary from "../../components/UI/ErrorBoundary/ErrorBoundary";
import { useAuth } from '../../api/authService';
import { useDashboardViewState } from './components/useDashboardViewState';

const DashboardPage: React.FC = () => {
  // 1. Extract auth details
  const { user, hasPermission, isLoading: authLoading } = useAuth();

  // 2. Use the custom logic hook
  // We now destructure 'permissions' which was added during the useDashboard refactor
  const {
    data: dashboardData,
    isLoading: dataLoading,
    error,
    permissions,
    statCardsData
  } = useDashboardViewState(hasPermission, authLoading);

  // 3. Combine loading states
  const loading = authLoading || dataLoading;

  return (
    <Sidebar>
      <ErrorBoundary>
        <DashboardContent
          data={dashboardData || null}
          loading={loading}
          error={error ? error.message : null}
          userName={user?.name || 'User'}
          // Pass the pre-derived permissions object
          permissions={permissions}
          statCardsData={statCardsData}
        />
      </ErrorBoundary>
    </Sidebar>
  );
};

export default DashboardPage;