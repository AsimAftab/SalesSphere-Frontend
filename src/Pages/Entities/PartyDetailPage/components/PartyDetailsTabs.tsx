import React from 'react';
import type { TabConfigItem } from '../types';
import NavigationTabs from '../../../../components/UI/NavigationTabs/NavigationTabs';

interface PartyDetailsTabsProps {
    activeTab: string;
    onTabChange: (tabId: string) => void;
    allowedTabs: TabConfigItem[];
    rightContent?: React.ReactNode;
    loading?: boolean;
}

export const PartyDetailsTabs: React.FC<PartyDetailsTabsProps> = ({
    activeTab,
    onTabChange,
    allowedTabs,
    rightContent,
    loading = false
}) => {
    if (loading) {
        return (
            <div className="bg-gray-100 flex flex-col md:flex-row md:justify-between md:items-center gap-3 md:gap-0 pb-2 md:pb-0">
                <div className="flex gap-2 px-0 py-0 pb-1">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-9 w-24 bg-gray-200 rounded-lg animate-pulse" />
                    ))}
                </div>
                {/* Right Content Skeleton (Total Orders Badge) */}
                <div className="md:pl-4 self-end md:self-auto px-4 md:px-0">
                    <div className="h-8 w-32 bg-gray-200 rounded-full animate-pulse" />
                </div>
            </div>
        );
    }
    return (
        <div className="bg-gray-100 flex flex-col md:flex-row md:justify-between md:items-center gap-3 md:gap-0 pb-2 md:pb-0">
            <div className="w-full md:w-auto overflow-hidden">
                <style>{`
                    .no-scrollbar::-webkit-scrollbar {
                        display: none;
                    }
                `}</style>
                <NavigationTabs // Reusable component
                    tabs={allowedTabs}
                    activeTab={activeTab}
                    onTabChange={onTabChange}
                    className="bg-transparent" // Override default bg
                    tabListClassName="!px-0 !py-0 pb-1 no-scrollbar" // Custom padding & scrollbar hiding
                />
            </div>
            {rightContent && (
                <div className="md:pl-4 self-end md:self-auto px-4 md:px-0">
                    {rightContent}
                </div>
            )}
        </div>
    );
};
