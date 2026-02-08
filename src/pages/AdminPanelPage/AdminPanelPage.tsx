import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '@/components/layout/Sidebar/Sidebar';
import { Navigate, useSearchParams } from 'react-router-dom';
import { ReportingStructureTab } from './ReportingStructureTab';
import {OrganizationHierarchyTab} from './OrganizationHierarchyTab';
import { RolesPermissionsTab } from './RolesPermissionsTab';
import { PlanBillingTab } from './PlanBillingTab';
import { CustomFieldsTab } from './CustomFieldsTab';
import TabNavigation from './TabNavigation';
import { useAuth } from '@/api/authService';


const AdminPanelPage: React.FC = () => {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'custom-fields';

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
  }, [searchParams, activeTab]);

  // Tab titles and descriptions
  const tabContent: Record<string, { title: string; description: string }> = {
    'custom-fields': { title: 'Custom Fields', description: 'Manage custom fields and configurable options' },
    'roles-permissions': { title: 'Roles & Permissions', description: 'Manage user roles, platform access, and module-level permissions' },
    'reporting-structure': { title: 'Reporting Structure', description: 'Manage supervisor-subordinate assignments' },
    'org-hierarchy': { title: 'Organization Hierarchy', description: 'View the complete organization structure and reporting hierarchy' },
    'plan-billing': { title: 'Plan & Billing', description: 'Manage your plan details and billing history' }
  };

  const currentTab = tabContent[activeTab] || tabContent['custom-fields'];

  // Access Control: Strict check for Admin roles only
  if (user && !['superadmin', 'developer', 'admin'].includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

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
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex-1 flex flex-col min-h-0 overflow-hidden"
              >
                {/* Page Title Section - Some tabs render their own header for skeleton support */}
                {activeTab !== 'roles-permissions' && activeTab !== 'reporting-structure' && activeTab !== 'org-hierarchy' && activeTab !== 'plan-billing' && activeTab !== 'custom-fields' && (
                  <div className="px-4 sm:px-6 pt-4 sm:pt-6">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-[#202224]">{currentTab.title}</h1>
                    <p className="text-xs sm:text-sm text-gray-500">{currentTab.description}</p>
                  </div>
                )}

                {/* Permission Tab - handles its own header + skeleton */}
                {activeTab === 'roles-permissions' && <RolesPermissionsTab />}

                {/* Hierarchy Tabs */}
                {activeTab === 'reporting-structure' && <ReportingStructureTab />}
                {activeTab === 'org-hierarchy' && <OrganizationHierarchyTab />}

                {/* Plan & Billing Tab - handles its own header */}
                {activeTab === 'plan-billing' && <PlanBillingTab />}

                {/* Custom Fields Tab - handles its own header */}
                {activeTab === 'custom-fields' && <CustomFieldsTab />}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </Sidebar>
  );
};

export default AdminPanelPage;