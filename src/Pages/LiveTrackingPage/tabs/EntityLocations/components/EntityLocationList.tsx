import React from 'react';
import { MapPin, Search } from 'lucide-react';
import type { UnifiedLocation } from '../../../../../api/mapService';
import { EmptyState } from '../../../../../components/UI/EmptyState/EmptyState';
import { filterConfig } from '../hooks/useEntityLocations';
import ErrorFallback from '../../../../../components/UI/ErrorBoundary/ErrorFallback';

interface EntityLocationListProps {
    locations: UnifiedLocation[];
    selectedLocation: UnifiedLocation | null;
    onSelect: (location: UnifiedLocation) => void;
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
    onRetry?: () => void;
    selectedItemRef: React.RefObject<HTMLLIElement | null>;
    listContainerRef: React.RefObject<HTMLUListElement | null>;
}

const EntityLocationList: React.FC<EntityLocationListProps> = ({
    locations,
    selectedLocation,
    onSelect,
    isLoading,
    isError,
    error,
    onRetry,
    selectedItemRef,
    listContainerRef
}) => {
    // --- Error State ---
    if (isError) {
        return (
            <div className="h-full bg-gray-50 rounded-lg p-2 flex items-center justify-center">
                <ErrorFallback
                    error={error}
                    onRetry={onRetry}
                    message="Failed to load location data."
                />
            </div>
        );
    }

    // --- Loading State ---
    if (isLoading) {
        return (
            <div className="h-full bg-gray-50 rounded-lg p-4 flex flex-col items-center justify-center space-y-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                <p className="text-sm text-gray-500">Loading locations...</p>
            </div>
        );
    }

    // --- Empty State ---
    if (locations.length === 0) {
        return (
            <div
                className="h-full bg-gray-50 rounded-lg p-2 flex items-center justify-center"
                style={{ height: '560px', maxHeight: '560px' }}
            >
                <EmptyState
                    title="No Locations Found"
                    description="Try adjusting your search or filters to see results."
                    icon={<Search className="w-12 h-12 text-gray-300 mx-auto mb-2" />}
                />
            </div>
        );
    }

    // --- List Content ---
    return (
        <div
            className="lg:col-span-1 bg-gray-50 rounded-lg p-3 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200"
            style={{ height: '560px', maxHeight: '560px' }}
        >
            <ul className="space-y-2" ref={listContainerRef}>
                {locations.map(loc => {
                    const config = filterConfig.find(f => f.type === loc.type);
                    return (
                        <li
                            key={loc.id}
                            ref={selectedLocation?.id === loc.id ? selectedItemRef : null}
                            onClick={() => onSelect(loc)}
                            className={`p-3 rounded-lg cursor-pointer border-l-4 transition-all duration-200 ${selectedLocation?.id === loc.id
                                ? 'bg-blue-50 border-blue-500 shadow-sm'
                                : 'bg-white hover:bg-gray-100 border-transparent shadow-sm hover:shadow'
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <span className="font-semibold text-sm text-gray-800 line-clamp-1">{loc.name}</span>
                                <span
                                    className={`px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-full text-white bg-${config?.color || 'gray'}-500`}
                                >
                                    {loc.type}
                                </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1.5 flex items-start leading-relaxed">
                                <MapPin size={12} className="mr-1.5 mt-0.5 flex-shrink-0 text-gray-400" />
                                <span className="line-clamp-2">{loc.address}</span>
                            </p>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default EntityLocationList;
