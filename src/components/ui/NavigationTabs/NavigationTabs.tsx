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
    const scrollContainerRef = React.useRef<HTMLDivElement>(null);
    const [showLeftFade, setShowLeftFade] = React.useState(false);
    const [showRightFade, setShowRightFade] = React.useState(false);

    const checkScroll = React.useCallback(() => {
        const container = scrollContainerRef.current;
        if (container) {
            const { scrollLeft, scrollWidth, clientWidth } = container;
            setShowLeftFade(scrollLeft > 0);
            setShowRightFade(scrollLeft < scrollWidth - clientWidth - 1);
        }
    }, []);

    React.useEffect(() => {
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
    }, [checkScroll, tabs]);

    return (
        <div className={`${className} flex flex-col md:flex-row md:justify-between md:items-center gap-3 md:gap-0`}>
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

            <div className="relative w-full md:w-auto overflow-hidden">
                {/* Left fade indicator */}
                <div
                    className={`absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-inherit via-gray-100/80 to-transparent z-20 pointer-events-none transition-opacity duration-200 md:hidden ${showLeftFade ? 'opacity-100' : 'opacity-0'}`}
                    style={{ background: 'linear-gradient(to right, rgb(243 244 246), transparent)' }}
                />

                <div
                    ref={scrollContainerRef}
                    className={`flex gap-2 px-4 sm:px-6 lg:px-8 py-3 overflow-x-auto no-scrollbar w-full md:w-auto ${tabListClassName}`}
                >
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={`
                                group flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-all whitespace-nowrap shrink-0
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

                {/* Right fade indicator */}
                <div
                    className={`absolute right-0 top-0 bottom-0 w-12 z-20 pointer-events-none transition-opacity duration-200 md:hidden ${showRightFade ? 'opacity-100' : 'opacity-0'}`}
                    style={{ background: 'linear-gradient(to left, rgb(243 244 246), transparent)' }}
                />
            </div>

            {rightContent && (
                <div className="px-4 sm:px-6 lg:px-8 pb-3 md:pb-0 self-end md:self-auto">
                    {rightContent}
                </div>
            )}
        </div>
    );
};

export default NavigationTabs;
