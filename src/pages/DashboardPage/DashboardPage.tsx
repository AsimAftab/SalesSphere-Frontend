import React from 'react';
import Sidebar from '@/components/layout/Sidebar/Sidebar';
import DashboardContent from './DashboardContent';
import { useAuth } from '@/api/authService';
import { useDashboardViewState } from './components/useDashboardViewState';
import { ErrorBoundary } from '@/components/ui';

/**
 * DashboardPage Container
 * 
 * Responsibility: 
 * - Orchestrates the Dashboard View
 * - Handles top-level Error Boundary
 * - Manages Authentication and Permission Injection
 * - Combines Auth State with Dashboard Data State
 */
const DashboardPage: React.FC = () => {
  // 1. Extract auth details
  const { user, hasPermission, isPlanFeatureEnabled, isLoading: authLoading } = useAuth();

  // Custom checker: Checks Module Presence in Subscription Plan + Granular Role Permission
  // We use isPlanFeatureEnabled(module) without the feature arg to avoid strict checks on granular plan features 
  // which might be missing for core dashboard items, while still enforcing that the Module itself is enabled.
  const checkAccess = (module: string, feature: string) => {
    return isPlanFeatureEnabled(module) && hasPermission(module, feature);
  };

  // 2. Use the custom logic hook
  const {
    data: dashboardData,
    isLoading: dataLoading,
    error,
    permissions,
    statCardsData,
    partyDistribution,
    collectionTrend,
  } = useDashboardViewState(checkAccess, isPlanFeatureEnabled, authLoading);

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
          partyDistribution={partyDistribution}
          collectionTrend={collectionTrend}
        />
      </ErrorBoundary>
    </Sidebar>
  );
};

export default DashboardPage;