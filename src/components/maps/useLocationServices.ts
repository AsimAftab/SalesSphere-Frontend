import { useState, useEffect } from 'react';
import { useMapsLibrary } from '@vis.gl/react-google-maps';
import { useDebounce } from './useDebounce';

export interface Suggestion {
    description: string;
    place_id: string;
}

export function useLocationServices(isViewerMode: boolean) {
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const debouncedSearchQuery = useDebounce(searchQuery, 200);
    const [isSuggestionSelected, setIsSuggestionSelected] = useState(false);

    const placesLib = useMapsLibrary('places');
    const geocodingLib = useMapsLibrary('geocoding');

    const [autocompleteSessionToken, setAutocompleteSessionToken] = useState<google.maps.places.AutocompleteSessionToken | null>(null);
    const [geocoder, setGeocoder] = useState<google.maps.Geocoder | null>(null);

    // Initialize services
    useEffect(() => {
        if (!isViewerMode && placesLib) {
            setAutocompleteSessionToken(new google.maps.places.AutocompleteSessionToken());
        }
    }, [placesLib, isViewerMode]);

    useEffect(() => {
        if (!isViewerMode && geocodingLib) {
            setGeocoder(new google.maps.Geocoder());
        } else if (isViewerMode) {
            setGeocoder(null);
        }
    }, [geocodingLib, isViewerMode]);

    return {
        searchQuery, setSearchQuery, isSearching, setIsSearching,
        suggestions, setSuggestions, debouncedSearchQuery,
        isSuggestionSelected, setIsSuggestionSelected,
        placesLib, geocodingLib, autocompleteSessionToken, geocoder
    };
}
