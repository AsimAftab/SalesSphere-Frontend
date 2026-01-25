import React from 'react';
import { useSearchParams } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import AnalyticsContent from './AnalyticsContent';
import { useAuth } from '../../api/authService';
import { useAnalytics } from './useAnalytics';
import ErrorBoundary from '../../components/UI/ErrorBoundary/ErrorBoundary';
import NavigationTabs, { type TabItem } from '../../components/UI/NavigationTabs/NavigationTabs';
import { BarChart3, UserSearch, Building2, Package } from 'lucide-react';
import ProspectsAnalytics from './ProspectsAnalytics/ProspectsAnalytics';
import SitesAnalytics from './SitesAnalytics/SitesAnalytics';
import RawMaterialAnalytics from './RawMaterialAnalytics/RawMaterialAnalytics';

const AnalyticsPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'sales';

    // 1. Get Authentication & Permissions
    const { hasPermission, isLoading: isAuthLoading } = useAuth();

    // 2. Use Custom Hook for Logic & State (Only for Sales Analytics for now)
    const {
        state,
        actions,
        permissions
    } = useAnalytics(hasPermission, isAuthLoading, activeTab === 'sales');

    const handleTabChange = (tabId: string) => {
        setSearchParams({ tab: tabId });
    };

    const analyticsTabs: TabItem[] = [
        { id: 'sales', label: 'Sales', icon: <BarChart3 className="w-4 h-4" /> },
        { id: 'prospects', label: 'Prospects', icon: <UserSearch className="w-4 h-4" /> },
        { id: 'sites', label: 'Sites', icon: <Building2 className="w-4 h-4" /> },
        { id: 'raw-material', label: 'Raw & Material', icon: <Package className="w-4 h-4" /> }
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'sales':
                return (
                    <AnalyticsContent
                        state={state}
                        actions={actions}
                        permissions={permissions}
                    />
                );
            case 'prospects':
                return <ProspectsAnalytics />;
            case 'sites':
                return <SitesAnalytics />;
            case 'raw-material':
                return <RawMaterialAnalytics />;
            default:
                return null;
        }
    };

    return (
        <Sidebar>
            <div className="-mx-4 sm:-mx-6 lg:-mx-8 -my-10 h-[calc(100vh-4rem)]">
                <div className="flex flex-col h-full overflow-hidden pt-6">
                    <NavigationTabs
                        tabs={analyticsTabs}
                        activeTab={activeTab}
                        onTabChange={handleTabChange}
                    />

                    <div className="flex-1 overflow-y-auto px-6 py-2">
                        <ErrorBoundary>
                            {renderContent()}
                        </ErrorBoundary>
                    </div>
                </div>
            </div>
        </Sidebar>
    );
};

export default AnalyticsPage;
