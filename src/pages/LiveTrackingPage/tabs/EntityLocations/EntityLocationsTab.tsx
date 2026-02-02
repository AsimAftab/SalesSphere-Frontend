import { TerritoryMap } from './components/TerritoryMap';
import { useEntityLocations } from './hooks/useEntityLocations';
import EntityFilterBar from './components/EntityFilterBar';
import EntityLocationList from './components/EntityLocationList';
import EntityLocationListMobile from './components/EntityLocationListMobile';
import EntityLocationsSkeleton from './components/EntityLocationsSkeleton';

import type { UnifiedLocation } from '@/api/mapService';

interface EntityLocationsTabProps {
    enabledEntityTypes?: UnifiedLocation['type'][];
}

const EntityLocationsTab: React.FC<EntityLocationsTabProps> = ({ enabledEntityTypes }) => {
    const {
        // State
        filteredLocations,
        selectedLocation,
        searchTerm,
        typeFilters,
        locationCounts,
        isLoading,
        isError,
        error,

        // Refs
        selectedItemRef,
        listContainerRef,

        // Actions
        setSearchTerm,
        toggleFilter,
        selectLocation,
        handleMarkerClick,
        refetch
    } = useEntityLocations(enabledEntityTypes);

    if (isLoading) {
        return <EntityLocationsSkeleton enabledEntityTypes={enabledEntityTypes} />;
    }

    const getSubtitleText = () => {
        if (!enabledEntityTypes || enabledEntityTypes.length === 0) return 'Manage and view entity locations';

        const typeLabels: Record<string, string> = {
            'Party': 'parties',
            'Prospect': 'prospects',
            'Site': 'sites'
        };

        // Map enabled types to labels, filter out undefined, join with commas and 'and'
        const labels = enabledEntityTypes.map(type => typeLabels[type]).filter(Boolean);

        if (labels.length === 0) return 'Manage and view entity locations';
        if (labels.length === 1) return `Manage and view ${labels[0]}`;
        if (labels.length === 2) return `Manage and view ${labels[0]} and ${labels[1]}`;

        const last = labels.pop();
        return `Manage and view ${labels.join(', ')}, and ${last}`;
    };

    return (
        <div className="flex flex-col h-full space-y-4 pb-4 ">
            {/* Header */}
            <div className="flex-shrink-0">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-black text-[#202224]">
                            Entity Locations
                        </h1>
                        <p className="text-xs sm:text-sm text-gray-500">
                            {getSubtitleText()}
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col flex-1 min-h-0">

                {/* Full Width Toolbar */}
                <div className="flex-shrink-0 mb-4 border-b border-gray-100 pb-2">
                    <EntityFilterBar
                        filters={typeFilters}
                        onFilterChange={toggleFilter}
                        locationCounts={locationCounts}
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        totalCount={filteredLocations.length}
                        enabledEntityTypes={enabledEntityTypes}
                    />
                </div>

                {/* Main Content Area */}
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0 overflow-hidden">
                    {/* Left Panel: Map */}
                    <div className="order-2 lg:order-1 lg:col-span-2 rounded-xl overflow-hidden shadow-inner border border-gray-200 h-full min-h-[300px] bg-slate-100 relative">
                        <TerritoryMap
                            locations={filteredLocations}
                            selectedLocationId={selectedLocation?.id}
                            onMarkerClick={handleMarkerClick}
                        />
                    </div>

                    {/* Right Panel: Location List */}
                    <div className="order-1 lg:order-2 flex flex-col min-h-0">
                        {/* Desktop List: Hidden on mobile, Flex on LG */}
                        <div className="hidden lg:flex h-full w-full">
                            <EntityLocationList
                                locations={filteredLocations}
                                selectedLocation={selectedLocation}
                                onSelect={selectLocation}
                                isLoading={isLoading}
                                isError={isError}
                                error={error}
                                onRetry={refetch}
                                selectedItemRef={selectedItemRef}
                                listContainerRef={listContainerRef}
                            />
                        </div>

                        {/* Mobile List: Flex on mobile, Hidden on LG */}
                        {/* Fixed height to prevent collapse. shrink-0 ensures flex doesn't crush it. */}
                        <div className="lg:hidden w-full h-[450px] shrink-0 overflow-y-auto mb-4 scrollbar-thin scrollbar-thumb-gray-300 border border-gray-100 rounded-lg shadow-sm">
                            <EntityLocationListMobile
                                locations={filteredLocations}
                                selectedLocation={selectedLocation}
                                onSelect={selectLocation}
                                isLoading={isLoading}
                                isError={isError}
                                error={error}
                                onRetry={refetch}
                                selectedItemRef={selectedItemRef}
                                listContainerRef={listContainerRef}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EntityLocationsTab;
