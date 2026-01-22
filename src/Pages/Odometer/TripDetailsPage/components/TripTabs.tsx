import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../../../../components/UI/Button/Button';

interface TripTabsProps {
    trips: { id: string; tripNumber: number }[];
    activeTripId: string;
    onTabChange: (id: string) => void;
}

const TripTabs: React.FC<TripTabsProps> = ({ trips, activeTripId, onTabChange }) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(false);

    // Check scroll position to toggle arrows
    const checkScroll = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setShowLeftArrow(scrollLeft > 0);
            // Use a small buffer (1px) for floating point robustness
            setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
        }
    };

    // Initial check and resize listener
    useEffect(() => {
        checkScroll();
        window.addEventListener('resize', checkScroll);
        return () => window.removeEventListener('resize', checkScroll);
    }, [trips]);

    // Scroll active tab into view
    useEffect(() => {
        if (scrollContainerRef.current && activeTripId) {
            // Find the active button index
            const index = trips.findIndex(t => t.id === activeTripId);
            if (index !== -1) {
                const container = scrollContainerRef.current;
                const button = container.children[index] as HTMLElement;

                if (button) {
                    // Simple centering logic
                    const containerWidth = container.clientWidth;
                    const buttonLeft = button.offsetLeft;
                    const buttonWidth = button.clientWidth;

                    // target scroll position to center the button
                    const targetScroll = buttonLeft - (containerWidth / 2) + (buttonWidth / 2);

                    container.scrollTo({
                        left: targetScroll,
                        behavior: 'smooth'
                    });
                }
            }
        }
        // Small delay to allow layout to settle
        setTimeout(checkScroll, 100);
    }, [activeTripId, trips]);


    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const scrollAmount = container.clientWidth * 0.75; // Scroll 75% of view
            const targetLeft = direction === 'left'
                ? container.scrollLeft - scrollAmount
                : container.scrollLeft + scrollAmount;

            container.scrollTo({
                left: targetLeft,
                behavior: 'smooth'
            });

            // Check scroll arrows after animation (approximate)
            setTimeout(checkScroll, 300);
        }
    };

    return (
        <div className="relative w-full mb-6 group">

            {/* Left Arrow */}
            {showLeftArrow && (
                <div className="absolute left-0 top-0 bottom-0 z-10 flex items-center pr-4 bg-gradient-to-r from-white via-white to-transparent">
                    <button
                        onClick={() => scroll('left')}
                        className="p-1 rounded-full bg-white shadow-md border border-gray-100 text-gray-600 hover:text-blue-600 hover:scale-110 transition-all"
                    >
                        <ChevronLeft size={18} />
                    </button>
                </div>
            )}

            {/* Scrollable List */}
            <div
                ref={scrollContainerRef}
                onScroll={checkScroll}
                className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-1 px-1 scroll-smooth"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {trips.map((trip) => {
                    const isActive = activeTripId === trip.id;
                    return (
                        <Button
                            key={trip.id}
                            onClick={() => onTabChange(trip.id)}
                            variant={isActive ? 'primary' : 'outline'}
                            className={`
                                flex-shrink-0 min-w-[90px] rounded-full text-sm font-semibold transition-all duration-200
                                ${isActive
                                    ? 'bg-[#1976D2] hover:bg-[#1565C0] text-white shadow-md border border-[#1976D2] scale-105'
                                    : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300'}
                            `}
                        >
                            Trip #{trip.tripNumber}
                        </Button>
                    );
                })}
            </div>

            {/* Right Arrow */}
            {showRightArrow && (
                <div className="absolute right-0 top-0 bottom-0 z-10 flex items-center pl-4 bg-gradient-to-l from-white via-white to-transparent">
                    <button
                        onClick={() => scroll('right')}
                        className="p-1 rounded-full bg-white shadow-md border border-gray-100 text-gray-600 hover:text-blue-600 hover:scale-110 transition-all"
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default TripTabs;
