import React from 'react';

export interface TabItem {
    id: string;
    label: string;
    icon?: React.ReactNode;
}

interface NavigationTabsProps {
    tabs: TabItem[];
    activeTab: string;
    onTabChange: (tabId: string) => void;
    className?: string;
    tabListClassName?: string;
}

const NavigationTabs: React.FC<NavigationTabsProps> = ({ tabs, activeTab, onTabChange, className = '', tabListClassName = '' }) => {
    return (
        <div className={`bg-gray-100 ${className}`}>
            <div className={`flex gap-2 px-6 py-3 overflow-x-auto ${tabListClassName}`}>
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={`
                            group flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap
                            ${tab.id === activeTab
                                ? 'active bg-secondary text-white shadow-sm'
                                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                            }
                        `}
                    >
                        {tab.icon}
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default NavigationTabs;
