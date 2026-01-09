import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import { Navigate, useSearchParams } from 'react-router-dom';
import { SupervisorHierarchyTab } from './SupervisorHierarchyTab';
import OrganizationHierarchyTab from './OrganizationHierarchyTab';
import { PermissionTab } from './PermissionTab';
import TabNavigation from './TabNavigation';
import { useAuth } from '../../api/authService';


const AdminPanelPage: React.FC = () => {
  const { user, isLoading: isAuthLoading } = useAuth();

  // Access Control: Strict check for Admin roles only
  if (user && !['superadmin', 'developer', 'admin'].includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'customization';

  // Tab State
  const [activeTab, setActiveTabState] = useState(initialTab);

  // Sync state with URL
  const setActiveTab = (tab: string) => {
    setActiveTabState(tab);
    setSearchParams({ tab });
  };

  // Sync URL changes back to state (e.g. browser back button)
  useEffect(() => {
    const currentTab = searchParams.get('tab');
    if (currentTab && currentTab !== activeTab) {
      setActiveTabState(currentTab);
    }
  }, [searchParams]);

  // Tab titles and descriptions
  const tabContent: Record<string, { title: string; description: string }> = {
    customization: { title: 'Customization', description: 'Customize role settings and permissions' },
    permission: { title: 'User Role & Permission', description: 'Define and manage user roles with granular access control and module permissions' },
    hierarchy: { title: 'Supervisor Hierarchy', description: 'Assign and view supervisor-subordinate relationships' },
    'org-hierarchy': { title: 'Organization Hierarchy', description: 'View the complete organization structure and reporting hierarchy' },
    subscription: { title: 'Subscription', description: 'Manage subscription plans and features' }
  };

  const currentTab = tabContent[activeTab] || tabContent.customization;

  return (
    <Sidebar>
      {/* Fixed height container - counteracts Sidebar layout py-10 padding */}
      <div className="-mx-4 sm:-mx-6 lg:-mx-8 -my-10 h-[calc(100vh-4rem)]">
        <div className="flex flex-col h-full overflow-hidden pt-6">
          {/* Tab Navigation */}
          <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Loading State */}
          {isAuthLoading ? (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" />
            </div>
          ) : (
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
              {/* Page Title Section */}
              <div className="px-6 pt-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">{currentTab.title}</h1>
                <p className="text-sm text-gray-500">{currentTab.description}</p>
              </div>

              {/* Permission Tab */}
              {activeTab === 'permission' && <PermissionTab />}

              {/* Hierarchy Tabs */}
              {activeTab === 'hierarchy' && <SupervisorHierarchyTab />}
              {activeTab === 'org-hierarchy' && <OrganizationHierarchyTab />}

              {/* Placeholder Tabs */}
              {(activeTab === 'customization' || activeTab === 'subscription') && (
                <div className="flex-1 flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <p className="text-gray-500">This feature is coming soon...</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Sidebar>
  );
};

export default AdminPanelPage;