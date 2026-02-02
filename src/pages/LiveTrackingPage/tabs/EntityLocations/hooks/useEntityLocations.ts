import { useState, useMemo, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMapLocations } from '@/api/mapService';
import type { UnifiedLocation } from '@/api/mapService';

export const filterConfig: { label: string; type: UnifiedLocation['type']; color: string }[] = [
    { label: 'Parties', type: 'Party', color: 'blue' },
    { label: 'Prospects', type: 'Prospect', color: 'green' },
    { label: 'Sites', type: 'Site', color: 'orange' },
];

export const useEntityLocations = (enabledEntityTypes?: UnifiedLocation['type'][]) => {
    // --- State ---
    const [selectedLocation, setSelectedLocation] = useState<UnifiedLocation | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Initialize filters: Only enable filters for allowed types
    const [typeFilters, setTypeFilters] = useState<Record<UnifiedLocation['type'], boolean>>(() => {
        const initialFilters = {
            Party: true,
            Prospect: true,
            Site: true,
        };

        // If specific types are enabled, disable others by default or just assume 'true' for check?
        // Actually, we should probably just control what is visible.
        // Let's default to TRUE for enabled ones, FALSE for disabled ones (though they won't show in UI)
        if (enabledEntityTypes) {
            return {
                Party: enabledEntityTypes.includes('Party'),
                Prospect: enabledEntityTypes.includes('Prospect'),
                Site: enabledEntityTypes.includes('Site'),
            };
        }
        return initialFilters;
    });

    // --- Refs ---
    const selectedItemRef = useRef<HTMLLIElement | null>(null);
    const listContainerRef = useRef<HTMLUListElement | null>(null);

    // --- Data Fetching ---
    const { data: rawLocations = [], isLoading, isError, error, refetch } = useQuery<UnifiedLocation[], Error>({
        queryKey: ['territoryLocations'],
        queryFn: getMapLocations,
    });

    // Filter raw data by enabled types immediately (Security/Permission check)
    const allLocations = useMemo(() => {
        if (!enabledEntityTypes) return rawLocations;
        return rawLocations.filter(loc => enabledEntityTypes.includes(loc.type));
    }, [rawLocations, enabledEntityTypes]);

    // --- Effects ---
    // Scroll selected item into view
    useEffect(() => {
        if (selectedLocation && selectedItemRef.current && listContainerRef.current) {
            selectedItemRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            });
        }
    }, [selectedLocation]);

    // --- Derived State (Business Logic) ---
    const locationCounts = useMemo(() => {
        return allLocations.reduce((acc, loc) => {
            acc[loc.type] = (acc[loc.type] || 0) + 1;
            return acc;
        }, {} as Record<UnifiedLocation['type'], number>);
    }, [allLocations]);

    const filteredLocations = useMemo(() => {
        const filtered = allLocations.filter(loc => {
            // Check if type matches allowed types
            if (enabledEntityTypes && !enabledEntityTypes.includes(loc.type)) return false;

            const matchesType = typeFilters[loc.type];
            const matchesSearch = searchTerm.trim() === '' ||
                loc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                loc.address.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesType && matchesSearch;
        });

        // Move selected location to the top of the list
        if (selectedLocation) {
            const selectedIdx = filtered.findIndex(loc => loc.id === selectedLocation.id);
            if (selectedIdx > 0) {
                const [selected] = filtered.splice(selectedIdx, 1);
                filtered.unshift(selected);
            }
        }

        return filtered;
    }, [searchTerm, typeFilters, allLocations, enabledEntityTypes, selectedLocation]);

    // --- Actions ---
    const toggleFilter = (type: UnifiedLocation['type']) => {
        setTypeFilters(prev => ({ ...prev, [type]: !prev[type] }));
    };

    const selectLocation = (location: UnifiedLocation | null) => {
        setSelectedLocation(location);
    };

    const handleMarkerClick = (locationId: string) => {
        const location = allLocations.find(loc => loc.id === locationId);
        if (location) {
            setSelectedLocation(location);
        }
    };

    return {
        // State
        allLocations,
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
    };
};
