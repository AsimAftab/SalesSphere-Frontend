import { useState, useMemo, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMapLocations } from '../../../../../api/mapService';
import type { UnifiedLocation } from '../../../../../api/mapService';

export const filterConfig: { label: string; type: UnifiedLocation['type']; color: string }[] = [
    { label: 'Parties', type: 'Party', color: 'blue' },
    { label: 'Prospects', type: 'Prospect', color: 'green' },
    { label: 'Sites', type: 'Site', color: 'orange' },
];

export const useEntityLocations = () => {
    // --- State ---
    const [selectedLocation, setSelectedLocation] = useState<UnifiedLocation | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilters, setTypeFilters] = useState<Record<UnifiedLocation['type'], boolean>>({
        Party: true,
        Prospect: true,
        Site: true,
    });

    // --- Refs ---
    const selectedItemRef = useRef<HTMLLIElement | null>(null);
    const listContainerRef = useRef<HTMLUListElement | null>(null);

    // --- Data Fetching ---
    const { data: allLocations = [], isLoading, isError, error, refetch } = useQuery<UnifiedLocation[], Error>({
        queryKey: ['territoryLocations'],
        queryFn: getMapLocations,
    });

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
        return allLocations.filter(loc => {
            const matchesType = typeFilters[loc.type];
            const matchesSearch = searchTerm.trim() === '' ||
                loc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                loc.address.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesType && matchesSearch;
        });
    }, [searchTerm, typeFilters, allLocations]);

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
