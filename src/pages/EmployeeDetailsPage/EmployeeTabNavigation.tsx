import React from 'react';
import { type TabConfigItem } from './tabs.config';
import { NavigationTabs } from '@/components/ui';

interface EmployeeTabNavigationProps {
    activeTab: string;
    onTabChange: (tabId: string) => void;
    allowedTabs: TabConfigItem[];
    rightContent?: React.ReactNode;
    loading?: boolean;
}

const EmployeeTabNavigation: React.FC<EmployeeTabNavigationProps> = ({
    activeTab,
    onTabChange,
    allowedTabs,
    rightContent,
    loading = false
}) => {
    if (loading) {
        return (
            <div className="bg-gray-100 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:justify-between md:items-center gap-3 md:gap-0 pb-2 md:pb-3">
                <div className="flex gap-2 px-0 py-0 pb-1 pt-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="h-9 w-24 bg-gray-200 rounded-lg animate-pulse shrink-0" />
                    ))}
                </div>
                {/* Right Content Skeleton */}
                {rightContent && (
                    <div className="md:pl-4 self-end md:self-auto pb-3 md:pb-0">
                        <div className="h-8 w-32 bg-gray-200 rounded-full animate-pulse" />
                    </div>
                )}
            </div>
        );
    }

    return (
        <NavigationTabs
            tabs={allowedTabs}
            activeTab={activeTab}
            onTabChange={onTabChange}
            className="bg-gray-100"
            tabListClassName="!py-0 pb-1"
            rightContent={rightContent}
        />
    );
};

export default EmployeeTabNavigation;
