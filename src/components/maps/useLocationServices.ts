import { useState, useEffect, useCallback } from 'react';
import { useMapsLibrary } from '@vis.gl/react-google-maps';
import { useDebounce } from './useDebounce';
import toast from 'react-hot-toast';

export interface Suggestion {
    description: string;
    place_id: string;
}

export interface LocationResult {
    lat: number;
    lng: number;
    address: string;
}

export function useLocationServices(isViewerMode: boolean) {
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    // Preserved Business Logic: 5000ms debounce
    const debouncedSearchQuery = useDebounce(searchQuery, 5000);
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

    // --- Core Logic Refactored from Component ---

    const searchPlaces = useCallback(async (query: string, center?: google.maps.LatLngLiteral): Promise<Suggestion[]> => {
        if (isViewerMode || !placesLib || !autocompleteSessionToken || query.length < 3) {
            setSuggestions([]);
            return [];
        }

        try {
            // Migration: New Places API (AutocompleteSuggestion)
            if (placesLib.AutocompleteSuggestion) {
                const { suggestions: resultSuggestions } = await placesLib.AutocompleteSuggestion.fetchAutocompleteSuggestions({
                    input: query,
                    sessionToken: autocompleteSessionToken,
                    // Preserved Business Logic: 50km Radius Bias
                    locationBias: center ? { center, radius: 50000 } : undefined,
                });

                const mappedSuggestions = resultSuggestions
                    .filter((s: any) => s.placePrediction)
                    .map((s: any) => ({
                        description: s.placePrediction.text.toString(),
                        place_id: s.placePrediction.placeId,
                    }));

                setSuggestions(mappedSuggestions);
                return mappedSuggestions;
            } else {
                setSuggestions([]);
                return [];
            }
        } catch {

            setSuggestions([]);
            return [];
        }
    }, [placesLib, isViewerMode, autocompleteSessionToken]);

    const fetchPlaceDetails = useCallback(async (placeId: string): Promise<LocationResult | null> => {
        if (!placesLib || isViewerMode) return null;

        try {
            // Migration: New Places API (Place Class)
            const place = new placesLib.Place({ id: placeId });

            await place.fetchFields({
                fields: ['location', 'displayName', 'formattedAddress'],
            });

            const location = place.location;
            const chosenAddress = place.formattedAddress; // Fallback handled by caller usually, but API returns this.

            if (location && chosenAddress) {
                return {
                    lat: location.lat(),
                    lng: location.lng(),
                    address: chosenAddress
                };
            }
        } catch {

            toast.error('Failed to fetch place details. Ensure "Places API (New)" is enabled.');
        }
        return null;
    }, [placesLib, isViewerMode]);

    const geocodeAddress = useCallback(async (address: string): Promise<LocationResult | null> => {
        if (!geocoder || isViewerMode) return null;

        return new Promise((resolve) => {
            geocoder.geocode({ address: address.trim() }, (results, status) => {
                if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
                    const loc = results[0].geometry.location;
                    resolve({
                        lat: loc.lat(),
                        lng: loc.lng(),
                        address: results[0].formatted_address || address
                    });
                } else {
                    toast.error(`Geocode failed: ${status}`);
                    resolve(null);
                }
            });
        });
    }, [geocoder, isViewerMode]);

    const reverseGeocode = useCallback(async (pos: google.maps.LatLngLiteral): Promise<string | null> => {
        if (!geocoder || isViewerMode) return null;

        return new Promise((resolve) => {
            geocoder.geocode({ location: pos }, (results, status) => {
                if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
                    resolve(results[0].formatted_address);
                } else {
                    resolve(null);
                }
            });
        });
    }, [geocoder, isViewerMode]);


    return {
        // State
        searchQuery, setSearchQuery,
        isSearching, setIsSearching,
        suggestions, setSuggestions,
        debouncedSearchQuery,
        isSuggestionSelected, setIsSuggestionSelected,

        // Actions
        searchPlaces,
        fetchPlaceDetails,
        geocodeAddress,
        reverseGeocode
    };
}
