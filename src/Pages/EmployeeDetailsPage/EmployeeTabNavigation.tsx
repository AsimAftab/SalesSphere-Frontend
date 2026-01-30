import React from 'react';
import { type TabConfigItem } from './tabs.config';

interface EmployeeTabNavigationProps {
    activeTab: string;
    onTabChange: (tabId: string) => void;
    // Tabs are now filtered and passed down from the parent
    allowedTabs: TabConfigItem[];
    // Optional content to render on the right side of the tab bar
    rightContent?: React.ReactNode;
}

const EmployeeTabNavigation: React.FC<EmployeeTabNavigationProps> = ({
    activeTab,
    onTabChange,
    allowedTabs,
    rightContent
}) => {
    return (
        <div className="bg-gray-100 flex flex-col md:flex-row md:justify-between md:items-center gap-3 md:gap-0 pb-2 md:pb-0">
            <div
                className="flex gap-2 overflow-x-auto overflow-y-hidden pb-1 no-scrollbar w-full md:w-auto"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                <style>{`
                    .no-scrollbar::-webkit-scrollbar {
                        display: none;
                    }
                `}</style>
                {allowedTabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={`
                            flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap outline-none focus:ring-2 focus:ring-secondary/50
                            ${tab.id === activeTab
                                ? 'bg-secondary text-white shadow-sm'
                                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                            }
                        `}
                    >
                        <span className={`flex-shrink-0 ${tab.id === activeTab ? '[&>img]:[filter:brightness(0)_invert(1)]' : ''}`}>{tab.icon}</span>
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>
            {/* Right Side Content (e.g., Total Orders Count) */}
            {rightContent && (
                <div className="md:pl-4 self-end md:self-auto">
                    {rightContent}
                </div>
            )}
        </div>
    );
};

export default EmployeeTabNavigation;
