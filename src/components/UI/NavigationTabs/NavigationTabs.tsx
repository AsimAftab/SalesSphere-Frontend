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
    className?: string; // Applied to outer container
    tabListClassName?: string; // Applied to the scrollable list container
    rightContent?: React.ReactNode;
}

const NavigationTabs: React.FC<NavigationTabsProps> = ({
    tabs,
    activeTab,
    onTabChange,
    className = '',
    tabListClassName = '',
    rightContent
}) => {
    return (
        <div className={`bg-gray-100 ${className} flex flex-col md:flex-row md:justify-between md:items-center gap-3 md:gap-0`}>
            {/* Scrollbar hiding styles */}
            <style>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                button.active img {
                    filter: brightness(0) invert(1);
                }
            `}</style>

            <div className={`flex gap-2 px-6 py-3 overflow-x-auto no-scrollbar w-full md:w-auto ${tabListClassName}`}>
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

            {rightContent && (
                <div className="px-6 md:px-6 pb-3 md:pb-0 self-end md:self-auto">
                    {rightContent}
                </div>
            )}
        </div>
    );
};

export default NavigationTabs;
