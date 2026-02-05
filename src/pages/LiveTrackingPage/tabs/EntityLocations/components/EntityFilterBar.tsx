import React from 'react';
import type { UnifiedLocation } from '@/api/mapService';
import { filterConfig } from '../hooks/useEntityLocations';
import { SearchBar } from '@/components/ui';

interface EntityFilterBarProps {
    filters: Record<UnifiedLocation['type'], boolean>;
    onFilterChange: (type: UnifiedLocation['type']) => void;
    locationCounts: Record<UnifiedLocation['type'], number>;
    searchTerm: string;
    onSearchChange: (value: string) => void;
    totalCount: number;
    enabledEntityTypes?: UnifiedLocation['type'][];
}

const EntityFilterBar: React.FC<EntityFilterBarProps> = ({
    filters,
    onFilterChange,
    locationCounts,
    searchTerm,
    onSearchChange,
    totalCount,
    enabledEntityTypes
}) => {
    return (
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 p-1 mb-2 bg-white rounded-lg">
            {/* Left Side: Filter Toggles */}
            {/* Mobile: Flex-col to stack Count and Filters. Filters use flex-wrap for visibility. */}
            <div className="flex flex-col lg:flex-row items-center gap-4 w-full lg:w-auto">

                {/* Mobile: Top Row with Count */}
                <span className="lg:hidden text-sm font-bold text-gray-700 whitespace-nowrap bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100 w-full text-center">
                    {totalCount} Locations Found
                </span>

                {/* Desktop: Count */}
                <span className="hidden lg:block text-md font-bold text-gray-700 whitespace-nowrap px-3 py-1.5 rounded-full">
                    {totalCount} Locations Found
                </span>

                <div className="h-6 w-px bg-gray-200 hidden xl:block"></div>

                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider hidden xl:block">
                    Filter By:
                </span>

                {/* Filters Container: Wrapped on mobile to ensure all are visible */}
                <div className="flex flex-wrap lg:flex-nowrap items-center justify-center lg:justify-start gap-3 w-full lg:w-auto">
                    {filterConfig
                        .filter(f => !enabledEntityTypes || enabledEntityTypes.includes(f.type))
                        .map(filter => {
                            const isActive = filters[filter.type];
                            return (
                                <div
                                    key={filter.type}
                                    className="flex items-center gap-2 group cursor-pointer select-none border border-gray-100 rounded-full px-2 py-1 lg:border-none lg:p-0"
                                    onClick={() => onFilterChange(filter.type)}
                                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onFilterChange(filter.type)}
                                    role="button"
                                    tabIndex={0}
                                >
                                    <div className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isActive ? `bg-${filter.color}-500` : 'bg-gray-200 group-hover:bg-gray-300'
                                        }`}>
                                        <span
                                            aria-hidden="true"
                                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isActive ? 'translate-x-4' : 'translate-x-0'
                                                }`}
                                        />
                                    </div>
                                    <span className={`text-sm font-semibold transition-colors ${isActive ? 'text-gray-800' : 'text-gray-400 group-hover:text-gray-600'
                                        }`}>
                                        {filter.label}
                                        <span className="ml-1 text-xs opacity-70 font-normal">
                                            ({locationCounts[filter.type] || 0})
                                        </span>
                                    </span>
                                </div>
                            );
                        })}
                </div>
            </div>

            {/* Right Side: Search */}
            <div className="flex items-center gap-4 w-full lg:w-auto">
                <div className="flex-1">
                    <SearchBar
                        value={searchTerm}
                        onChange={onSearchChange}
                        placeholder="Search by Name or Address"
                        className="w-full shadow-sm"
                    />
                </div>
            </div>
        </div>
    );
};

export default EntityFilterBar;
