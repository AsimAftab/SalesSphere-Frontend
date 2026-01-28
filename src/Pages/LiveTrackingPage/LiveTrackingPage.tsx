import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Users, MapPin, History } from 'lucide-react';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import NavigationTabs from '../../components/UI/NavigationTabs/NavigationTabs';
import ErrorBoundary from '../../components/UI/ErrorBoundary/ErrorBoundary';

// Custom Hook
import { useLiveTracking } from './hooks/useLiveTracking';

// Lazy Loaded Tabs
const EmployeeTrackingTab = React.lazy(() => import('./tabs/EmployeeTracking/EmployeeTrackingTab'));
const EntityLocationsTab = React.lazy(() => import('./tabs/EntityLocations/EntityLocationsTab'));
const CompletedTrackingTab = React.lazy(() => import('./tabs/CompletedTracking/CompletedTrackingTab'));



const LiveTrackingPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = (searchParams.get('tab') as 'employees' | 'locations' | 'completed') || 'employees';

  // Centralized Data Fetching
  const {
    isLoading,
    isError,
    error,
    stats,
    activeSessions,
    completedSessions
  } = useLiveTracking();

  const handleTabChange = (tabId: string) => {
    setSearchParams({ tab: tabId });
  };

  const tabs = [
    { id: 'employees', label: 'Employee Tracking', icon: <Users className="w-4 h-4" /> },
    { id: 'locations', label: 'Entity Locations', icon: <MapPin className="w-4 h-4" /> },
    { id: 'completed', label: 'Tracking History', icon: <History className="w-4 h-4" /> },
  ];

  const getRightContent = () => {
    // Optional: Add simple counts or refresh button
    return null;
  };

  return (
    <Sidebar>
      <div className="-mx-4 sm:-mx-6 lg:-mx-8 -my-10">
        <div className="flex flex-col h-full overflow-hidden pt-6 gap-2">
          {/* Header / Navigation Tabs */}
          <NavigationTabs
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            className="border-b border-gray-200/50"
            tabListClassName="!py-0 pb-1"
            rightContent={getRightContent()}
          />

          {/* Content Area */}
          <div className="py-2 px-6 flex-1 overflow-hidden">
            <ErrorBoundary>
              {isError && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg my-4">
                  <p>Error loading live tracking data: {error instanceof Error ? error.message : 'Unknown error'}</p>
                </div>
              )}

              {/* Render Tabs with Content or Loading State directly */}
              {!isError && (
                <>
                  {activeTab === 'employees' && (
                    <EmployeeTrackingTab
                      stats={stats}
                      sessions={activeSessions}
                      isLoading={isLoading}
                    />
                  )}
                  {activeTab === 'locations' && (
                    <EntityLocationsTab />
                  )}
                  {activeTab === 'completed' && (
                    <CompletedTrackingTab
                      sessions={completedSessions}
                      isLoading={isLoading}
                    />
                  )}
                </>
              )}
            </ErrorBoundary>
          </div>
        </div>
      </div>
    </Sidebar>
  );
};

export default LiveTrackingPage;