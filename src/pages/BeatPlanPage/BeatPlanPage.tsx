import React from 'react';
import { useSearchParams } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar/Sidebar';
import {
  CheckCircle,
  List,
  MapPin,
} from 'lucide-react';

// Tabs
import BeatListTab from './tabs/BeatList/BeatListTab';
import ActiveBeatsTab from './tabs/ActiveBeats/ActiveBeatsTab';
import CompletedBeatsTab from './tabs/CompletedBeats/CompletedBeatsTab';

import { useBeatPlanCounts } from './hooks/useBeatPlanCounts';
import { useBeatPlanPermissions } from './hooks/useBeatPlanPermissions';
import { NavigationTabs, ErrorBoundary } from '@/components/ui';

const BeatPlanPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const permissions = useBeatPlanPermissions();

    // Fetch counts for tabs
    const counts = useBeatPlanCounts();

    const allTabs = [
        { id: 'templates', label: 'Beat Lists', icon: <List className="w-4 h-4" />, visible: permissions.canViewTemplates },
        { id: 'active', label: 'Active Beats', icon: <MapPin className="w-4 h-4" />, visible: permissions.canViewList },
        { id: 'completed', label: 'Completed Beats', icon: <CheckCircle className="w-4 h-4" />, visible: permissions.canViewList },
    ];

    const tabs = allTabs.filter(t => t.visible);
    const activeTab = (searchParams.get('tab') as string) || tabs[0]?.id || 'templates';

    const handleTabChange = (tabId: string) => {
        setSearchParams({ tab: tabId });
    };

    // Badge configuration based on active tab
    const getRightContent = () => {
        switch (activeTab) {
            case 'templates':
                if (counts.templates === null) return <div className="h-8 w-32 bg-gray-200 rounded-full animate-pulse" />;
                return (
                    <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm font-bold border border-secondary/20 shadow-sm animate-in fade-in zoom-in duration-300">
                        Total Beat Lists: {counts.templates}
                    </span>
                );
            case 'active':
                if (counts.active === null) return <div className="h-8 w-32 bg-gray-200 rounded-full animate-pulse" />;
                return (
                    <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-bold border border-green-200 shadow-sm animate-in fade-in zoom-in duration-300">
                        Active Beats: {counts.active}
                    </span>
                );
            case 'completed':
                if (counts.completed === null) return <div className="h-8 w-32 bg-gray-200 rounded-full animate-pulse" />;
                return (
                    <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-bold border border-green-200 shadow-sm animate-in fade-in zoom-in duration-300">
                        Completed Beats: {counts.completed}
                    </span>
                );
            default:
                return null;
        }
    };

    return (
        <Sidebar>
            <div className="-mx-4 sm:-mx-6 lg:-mx-8 -my-10 h-[calc(100vh-4rem)]">
                <div className="flex flex-col h-full overflow-hidden pt-6 gap-2">
                    {/* Navigation Tabs with Badge */}
                    <NavigationTabs
                        tabs={tabs}
                        activeTab={activeTab}
                        onTabChange={handleTabChange}
                        className="border-b border-gray-200/50"
                        tabListClassName="!py-0 pb-1"
                        rightContent={getRightContent()}
                    />

                    <div className="py-2 px-6 flex-1 overflow-y-auto">
                        <ErrorBoundary>
                            {activeTab === 'templates' && <BeatListTab />}
                            {activeTab === 'active' && <ActiveBeatsTab />}
                            {activeTab === 'completed' && <CompletedBeatsTab />}
                        </ErrorBoundary>
                    </div>
                </div>
            </div>
        </Sidebar>
    );
};

export default BeatPlanPage;
