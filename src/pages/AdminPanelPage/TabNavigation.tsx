import React from 'react';
import { CreditCard, GitBranch, Network, Settings, Users } from 'lucide-react';

interface Tab {
    id: string;
    label: string;
    icon: React.ReactNode;
}

interface TabNavigationProps {
    activeTab: string;
    onTabChange?: (tabId: string) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
    const tabs: Tab[] = [
        { id: 'customization', label: 'Customization', icon: <Settings className="w-4 h-4" /> },
        { id: 'permission', label: 'User Role & Permission', icon: <Users className="w-4 h-4" /> },
        { id: 'hierarchy', label: 'Supervisor Hierarchy', icon: <GitBranch className="w-4 h-4" /> },
        { id: 'org-hierarchy', label: 'Organization Hierarchy', icon: <Network className="w-4 h-4" /> },
        { id: 'subscription', label: 'Subscription', icon: <CreditCard className="w-4 h-4" /> },
    ];

    return (
        <div className="bg-gray-100">
            <div className="flex gap-2 px-6 py-3">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange?.(tab.id)}
                        className={`
              flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all
              ${tab.id === activeTab
                                ? 'bg-secondary text-white shadow-sm'
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

export default TabNavigation;
