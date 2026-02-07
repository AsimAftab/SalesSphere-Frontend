import React, { useRef, useState, useEffect, useCallback } from 'react';
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
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [showLeftFade, setShowLeftFade] = useState(false);
    const [showRightFade, setShowRightFade] = useState(false);

    const tabs: Tab[] = [
        { id: 'customization', label: 'Customization', icon: <Settings className="w-4 h-4" /> },
        { id: 'permission', label: 'Roles & Permissions', icon: <Users className="w-4 h-4" /> },
        { id: 'hierarchy', label: 'Reporting Structure', icon: <GitBranch className="w-4 h-4" /> },
        { id: 'org-hierarchy', label: 'Organization Hierarchy', icon: <Network className="w-4 h-4" /> },
        { id: 'subscription', label: 'Subscription', icon: <CreditCard className="w-4 h-4" /> },
    ];

    const checkScroll = useCallback(() => {
        const container = scrollContainerRef.current;
        if (container) {
            const { scrollLeft, scrollWidth, clientWidth } = container;
            setShowLeftFade(scrollLeft > 0);
            setShowRightFade(scrollLeft < scrollWidth - clientWidth - 1);
        }
    }, []);

    useEffect(() => {
        // Initial check with slight delay to ensure DOM is ready
        const timer = setTimeout(checkScroll, 100);
        const container = scrollContainerRef.current;
        if (container) {
            container.addEventListener('scroll', checkScroll);
            window.addEventListener('resize', checkScroll);
        }
        return () => {
            clearTimeout(timer);
            if (container) {
                container.removeEventListener('scroll', checkScroll);
            }
            window.removeEventListener('resize', checkScroll);
        };
    }, [checkScroll]);

    return (
        <div className="bg-gray-100">
            {/* Scrollbar hiding styles */}
            <style>{`
                .tabs-no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .tabs-no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>

            <div className="relative overflow-hidden">
                {/* Left fade indicator */}
                <div
                    className={`absolute left-0 top-0 bottom-0 w-12 z-20 pointer-events-none transition-opacity duration-200 md:hidden ${showLeftFade ? 'opacity-100' : 'opacity-0'}`}
                    style={{ background: 'linear-gradient(to right, rgb(243 244 246), transparent)' }}
                />

                <div
                    ref={scrollContainerRef}
                    className="flex gap-2 px-4 sm:px-6 py-3 overflow-x-auto tabs-no-scrollbar"
                >
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange?.(tab.id)}
                            className={`
                                flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-all whitespace-nowrap shrink-0
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

                {/* Right fade indicator */}
                <div
                    className={`absolute right-0 top-0 bottom-0 w-12 z-20 pointer-events-none transition-opacity duration-200 md:hidden ${showRightFade ? 'opacity-100' : 'opacity-0'}`}
                    style={{ background: 'linear-gradient(to left, rgb(243 244 246), transparent)' }}
                />
            </div>
        </div>
    );
};

export default TabNavigation;
