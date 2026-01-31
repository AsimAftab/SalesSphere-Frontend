import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import ErrorBoundary from '../../components/UI/ErrorBoundary/ErrorBoundary';
import NavigationTabs, { type TabItem } from '../../components/UI/NavigationTabs/NavigationTabs';
import { BarChart3 } from 'lucide-react';
import prospectsIcon from '../../assets/Image/icons/prospects-icon.svg';
import sitesIcon from '../../assets/Image/icons/sites-icon.svg';
import { useAuth } from '../../api/authService';
import SalesAnalytics from './SalesAnalytics/SalesAnalytics';
import ProspectsAnalytics from './ProspectsAnalytics/ProspectsAnalytics';
import SitesAnalytics from './SitesAnalytics/SitesAnalytics';
// import RawMaterialAnalytics from './RawMaterialAnalytics/RawMaterialAnalytics';

const AnalyticsPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { hasPermission, isFeatureEnabled } = useAuth();

    const handleTabChange = (tabId: string) => {
        setSearchParams({ tab: tabId });
    };

    const analyticsTabs = useMemo(() => {
        const allTabs: (TabItem & { visible: boolean })[] = [
            { id: 'sales', label: 'Sales Overview', icon: <BarChart3 className="w-4 h-4" />, visible: isFeatureEnabled('analytics') },
            { id: 'prospects', label: 'Prospects', icon: <img src={prospectsIcon} alt="" className="w-4 h-4" />, visible: isFeatureEnabled('prospects') && hasPermission('prospectDashboard', 'viewProspectDashStats') },
            { id: 'sites', label: 'Sites', icon: <img src={sitesIcon} alt="" className="w-4 h-4" />, visible: isFeatureEnabled('sites') && hasPermission('sitesDashboard', 'viewSitesDashStats') },
        ];
        return allTabs.filter(t => t.visible);
    }, [isFeatureEnabled, hasPermission]);
    const activeTab = searchParams.get('tab') || analyticsTabs[0]?.id || 'sales';

    const renderContent = () => {
        switch (activeTab) {
            case 'sales':
                return <SalesAnalytics />;
            case 'prospects':
                return <ProspectsAnalytics />;
            case 'sites':
                return <SitesAnalytics />;
            // case 'raw-material':
            //     return <RawMaterialAnalytics />;
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

                    <div className="flex-1 overflow-y-auto px-6 pt-2">
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
