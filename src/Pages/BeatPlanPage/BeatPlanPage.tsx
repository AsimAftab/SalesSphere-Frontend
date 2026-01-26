import React from 'react';
import { useSearchParams } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import NavigationTabs from '../../components/UI/NavigationTabs/NavigationTabs';
import ErrorBoundary from '../../components/UI/ErrorBoundary/ErrorBoundary';
import { List, MapPin, CheckCircle } from 'lucide-react';

// Tabs
import BeatListTab from './tabs/BeatList/BeatListTab';
import ActiveBeatsTab from './tabs/ActiveBeats/ActiveBeatsTab';
import CompletedBeatsTab from './tabs/CompletedBeatsTab';

const BeatPlanPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = (searchParams.get('tab') as 'templates' | 'active' | 'completed') || 'templates';
    // const { hasPermission } = useAuth(); // Assuming generic permission check for the page, or specific per tab

    const handleTabChange = (tabId: string) => {
        setSearchParams({ tab: tabId });
    };

    const tabs = [
        { id: 'templates', label: 'Beat Lists', icon: <List className="w-4 h-4" /> },
        { id: 'active', label: 'Active Beats', icon: <MapPin className="w-4 h-4" /> },
        { id: 'completed', label: 'Completed Beats', icon: <CheckCircle className="w-4 h-4" /> },
    ];

    return (
        <Sidebar>
            <div className="-mx-4 sm:-mx-6 lg:-mx-8 -my-10 h-[calc(100vh-4rem)]">
                <div className="flex flex-col h-full overflow-hidden pt-6">
                    <NavigationTabs
                        tabs={tabs}
                        activeTab={activeTab}
                        onTabChange={handleTabChange}
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
