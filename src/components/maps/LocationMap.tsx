import { useEffect, useState, useCallback } from 'react'; // <--- Removed useMemo
import { Search, Navigation, X } from 'lucide-react';
import {
  APIProvider,
  Map,
  useMapsLibrary,
  AdvancedMarker,
  type MapMouseEvent,
  useMap,
  type MapCameraChangedEvent 
} from '@vis.gl/react-google-maps';
// Assuming the component is in 'src/components/maps/'
// and Button is in 'src/components/UI/Button/'
import Button from '../UI/Button/Button'; 

// --- DEBOUNCE HOOK (Utility - Unchanged) ---
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => { setDebouncedValue(value); }, delay);
    return () => { clearTimeout(handler); };
  }, [value, delay]);
  return debouncedValue;
};

// --- SUGGESTION TYPE (Unchanged) ---
interface Suggestion {
  description: string;
  place_id: string;
}

// --- MODIFIED PROPS: Added isViewerMode ---
interface LocationMapProps {
  position: { lat: number; lng: number }; // Initial center
  onLocationChange: (location: { lat: number; lng: number }) => void;
  onAddressGeocoded: (address: string) => void; // Sends text address to modal
  isViewerMode?: boolean; // Flag to hide search/interaction elements
}

// --- REMOVED MyGeocodeResponse INTERFACE ---

// --- CustomMarker (Visual Component - Unchanged) ---
const CustomMarker = () => (
    <div style={{ position: 'relative', width: '32px', height: '32px' }}>
      <div style={{
        width: '32px', height: '32px', background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        borderRadius: '50% 50% 50% 0', transform: 'rotate(-45deg)',
        boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)', border: '3px solid white',
      }} />
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%) rotate(45deg)',
        width: '12px', height: '12px', background: 'white', borderRadius: '50%',
      }} />
    </div>
);

// --- Custom Hook to Isolate Search State/Services ---
function useSearchStateAndServices(isViewerMode: boolean) {
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const debouncedSearchQuery = useDebounce(searchQuery, 400);
    const [isSuggestionSelected, setIsSuggestionSelected] = useState(false);

    const placesLib = useMapsLibrary('places'); 
    const geocodingLib = useMapsLibrary('geocoding'); 

    const [autocompleteService, setAutocompleteService] = useState<google.maps.places.AutocompleteService | null>(null);
    const [geocoder, setGeocoder] = useState<google.maps.Geocoder | null>(null);

    // Initialize services
    useEffect(() => {
        if (!isViewerMode && placesLib) { setAutocompleteService(new google.maps.places.AutocompleteService()); } 
        else if (isViewerMode) { setAutocompleteService(null); }
    }, [placesLib, isViewerMode]);

    useEffect(() => {
        if (!isViewerMode && geocodingLib) { setGeocoder(new google.maps.Geocoder()); } 
        else if (isViewerMode) { setGeocoder(null); }
    }, [geocodingLib, isViewerMode]);

    return {
        searchQuery, setSearchQuery, isSearching, setIsSearching,
        suggestions, setSuggestions, debouncedSearchQuery,
        isSuggestionSelected, setIsSuggestionSelected,
        placesLib, geocodingLib, autocompleteService, geocoder
    };
}

// --- Main Map Component (Internal) ---
function MyLocationMap({ position, onLocationChange, onAddressGeocoded, isViewerMode = false }: LocationMapProps) {
  
  const mapInstance = useMap(); 
  const [markerPos, setMarkerPos] = useState<google.maps.LatLngLiteral | null>(position);
  
  // --- STATE FOR CONTROLLED MAP (FIX for ZOOM) ---
  const [currentZoom, setCurrentZoom] = useState(isViewerMode ? 14 : 13);
  const [currentCenter, setCurrentCenter] = useState(position);
  
  const { 
    searchQuery, setSearchQuery, isSearching, setIsSearching, 
    suggestions, setSuggestions, debouncedSearchQuery, 
    isSuggestionSelected, setIsSuggestionSelected,
    autocompleteService, geocoder 
  } = useSearchStateAndServices(isViewerMode);

  // This hook syncs the marker AND center if the parent data changes
  useEffect(() => {
    setMarkerPos(position);
    setCurrentCenter(position);
  }, [position]);

  // --- HANDLER FOR MAP CHANGES (FIX for ZOOM) ---
  const handleCameraChange = (e: MapCameraChangedEvent) => {
    setCurrentZoom(e.detail.zoom);
    setCurrentCenter(e.detail.center);
  };

  // --- Handlers ---
  const reverseGeocodeAndUpdate = useCallback((newPos: google.maps.LatLngLiteral) => {
    setMarkerPos(newPos); 
    onLocationChange(newPos);

    if (isViewerMode || !geocoder) return;
    
    setSuggestions([]); 
    setIsSuggestionSelected(false); 

    geocoder.geocode({ location: newPos }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
        const address = results[0].formatted_address; 
        onAddressGeocoded(address); 
        setSearchQuery(address);
      } else {
        const address = `${newPos.lat.toFixed(6)}, ${newPos.lng.toFixed(6)}`; 
        onAddressGeocoded(address);
        setSearchQuery(address);
      }
    });
  }, [geocoder, onLocationChange, onAddressGeocoded, isViewerMode, setSearchQuery, setIsSuggestionSelected, setSuggestions]);


  const handleMapClick = (e: MapMouseEvent) => {
    if (!isViewerMode && e.detail.latLng) {
      const newPos = { lat: e.detail.latLng.lat, lng: e.detail.latLng.lng };
      reverseGeocodeAndUpdate(newPos);
    }
  };

  const handleMarkerDragEnd = (e: google.maps.MapMouseEvent) => {
    if (!isViewerMode && e.latLng) {
      const newPos = { lat: e.latLng.lat(), lng: e.latLng.lng() };
      reverseGeocodeAndUpdate(newPos);
    }
  };
  
  const handleGetCurrentLocation = () => {
    if (!isViewerMode && 'geolocation' in navigator && mapInstance) {
      navigator.geolocation.getCurrentPosition(
        (geoPosition) => {
          const newPos = { lat: geoPosition.coords.latitude, lng: geoPosition.coords.longitude, };
          // Set state to control map
          setCurrentCenter(newPos);
          setCurrentZoom(13);
          reverseGeocodeAndUpdate(newPos);
        },
        (error) => { console.error('Error getting current location:', error); }
      );
    }
  };

  const handleClearSearch = () => {
    if (!isViewerMode) {
      setSearchQuery('');
      setMarkerPos(position); 
      onAddressGeocoded('');
      onLocationChange(position); 
      setSuggestions([]); 
      setIsSuggestionSelected(false);
    }
  };

  const fetchSuggestions = useCallback(async (query: string) => {
    if (isViewerMode || !autocompleteService || query.length < 3) { setSuggestions([]); return; }
    
    autocompleteService.getPlacePredictions(
      { input: query },
      (predictions: google.maps.places.AutocompletePrediction[] | null, status: google.maps.places.PlacesServiceStatus) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
          setSuggestions(predictions.map((p: google.maps.places.AutocompletePrediction) => ({ description: p.description, place_id: p.place_id, })));
        } else { setSuggestions([]); }
      }
    );
  }, [autocompleteService, isViewerMode, setSuggestions]);

  useEffect(() => {
    if (debouncedSearchQuery && !isSuggestionSelected && !isViewerMode) { 
      fetchSuggestions(debouncedSearchQuery); 
    } else { 
      setSuggestions([]); 
    }
  }, [debouncedSearchQuery, fetchSuggestions, isSuggestionSelected, isViewerMode, setSuggestions]);


  const handleSearch = async () => {
    if (isViewerMode || !geocoder || !mapInstance) return;
    setIsSearching(true);

    let geocodePromise: Promise<any> = Promise.reject(new Error("No valid search query provided.")); 
    let chosenAddress: string = searchQuery; 

    if (suggestions.length > 0) { 
      chosenAddress = suggestions[0].description;
      geocodePromise = new Promise((resolve, reject) => {
        geocoder.geocode({ placeId: suggestions[0].place_id }, (results, status) => {
          if (status === google.maps.GeocoderStatus.OK && results) {
            resolve({ results, status });
          } else {
            reject('Geocode was not successful for place ID: ' + status);
          }
        });
      });
    } else if (searchQuery.trim()) {
      geocodePromise = new Promise((resolve, reject) => {
        geocoder.geocode({ address: searchQuery.trim() }, (results, status) => {
          if (status === google.maps.GeocoderStatus.OK && results) {
            resolve({ results, status });
          } else {
            reject('Geocode was not successful for address: ' + status);
          }
        });
      });
    } else {
      setIsSearching(false);
      return;
    }

    try {
      const response = await geocodePromise; 
      if (response.status === google.maps.GeocoderStatus.OK && response.results && response.results[0]) {
        const location = response.results[0].geometry.location;
        const newPos = { lat: location.lat(), lng: location.lng() };
        
        if (suggestions.length === 0) { chosenAddress = response.results[0].formatted_address || searchQuery; }

        // Set state to control map
        setMarkerPos(newPos); 
        setCurrentCenter(newPos);
        setCurrentZoom(13);
        setSearchQuery(chosenAddress); 
        onLocationChange(newPos); 
        onAddressGeocoded(chosenAddress); 
      } else { console.error('Geocode was not successful: ' + response.status); }
    } catch (error) { 
      console.error('Search failed:', error instanceof Error ? error.message : error);
    } finally { 
      setIsSearching(false); 
    }
  };


  const handleSuggestionClick = (suggestion: Suggestion) => {
    if (!geocoder || !mapInstance || isViewerMode) return; 

    setIsSuggestionSelected(true);
    const chosenAddress = suggestion.description;
    setSearchQuery(chosenAddress);
    setSuggestions([]);
    
    geocoder.geocode({ placeId: suggestion.place_id }, (results: google.maps.GeocoderResult[] | null, status: google.maps.GeocoderStatus) => {
      if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
        const location = results[0].geometry.location;
        const newPos = { lat: location.lat(), lng: location.lng() };
              
        // Set state to control map
        setMarkerPos(newPos); 
        setCurrentCenter(newPos);
        setCurrentZoom(13);
        onLocationChange(newPos); 
        onAddressGeocoded(chosenAddress); 
      } else { console.error('Geocode was not successful for the following reason: ' + status); }
    });
  };

  // --- CONDITIONAL JSX RENDER ---
  
  if (isViewerMode) {
    return (
      // Render ONLY the map wrapper for static view
      <div className="flex-grow w-full h-full relative z-10" style={{ pointerEvents: 'auto' }}>
        <Map
          center={currentCenter} // Use state
          zoom={currentZoom} // Use state
          onCameraChanged={handleCameraChange} // Add listener
          mapId={'YOUR_MAP_ID'}
          disableDefaultUI={true} 
          zoomControl={true} // Enabled
          fullscreenControl={false} 
          streetViewControl={false}
          mapTypeControl={false}
          onClick={handleMapClick} 
          keyboardShortcuts={false}
          gestureHandling={'none'} // Enabled
          scrollwheel={false} // Enabled
        >
          {markerPos && (
            <AdvancedMarker
              position={markerPos}
              draggable={false} 
              onDragEnd={handleMarkerDragEnd} 
            >
              <CustomMarker />
            </AdvancedMarker>
          )}
        </Map>
      </div>
    );
  }

  // --- DEFAULT RETURN FOR INTERACTIVE MODE ---
  return (
    <div className="flex flex-col h-full space-y-4 pt-4">
    
        {/* Search and Action Bar (This is !isViewerMode, so it will show) */}
        <div className="flex flex-col sm:flex-row gap-2">
            {/* Search Bar Input */}
            <div className="flex-1 relative w-full">
                <input
                    type="text"
                    placeholder="Search for location (e.g., Kathmandu, Nepal)"
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setIsSuggestionSelected(false); 
                    }}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleSearch())}
                    className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {searchQuery && ( 
                    <button
                        type="button"
                        onClick={handleClearSearch}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        aria-label="Clear search"
                    >
                        <X className="w-4 h-4" /> 
                    </button>
                )}
                {suggestions.length > 0 && (
                    <ul className="absolute z-50 w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1 max-h-48 overflow-y-auto">
                        {suggestions.map((suggestion) => (
                        <li
                            key={suggestion.place_id}
                            onClick={() => handleSuggestionClick(suggestion)} 
                            className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-100"
                        >
                            {suggestion.description}
                        </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Search and Geolocation Buttons */}
            <div className="flex gap-2 flex-shrink-0">
                <Button type="button" onClick={handleSearch} disabled={isSearching} variant="secondary" className="flex items-center gap-2">
                <Search className="w-4 h-4" />
                {isSearching ? 'Searching...' : 'Search'}
                </Button>
                <Button type="button" onClick={handleGetCurrentLocation} variant="secondary" className="flex items-center justify-center px-3" title="Get current location">
                <Navigation className="w-4 h-4" />
                </Button>
            </div>
        </div>

        {/* Map Container */}
        <div className="border-2 border-gray-200 rounded-lg overflow-hidden shadow-lg flex flex-col flex-grow">
            {/* Instruction Bar */}
            <div className="bg-blue-50 px-4 py-2 border-b border-gray-200">
                <p className="text-sm text-gray-600">
                Click on the map or drag the marker to pinpoint the exact location
                </p>
            </div>
            
            <div className="flex-grow w-full relative z-10"
                style={{ pointerEvents: 'auto' }}
            >
                <Map
                    center={currentCenter} // Use state
                    zoom={currentZoom} // Use state
                    onCameraChanged={handleCameraChange} // Add listener
                    mapId={'YOUR_MAP_ID'}
                    disableDefaultUI={true} 
                    zoomControl={true} 
                    fullscreenControl={false} 
                    streetViewControl={false}
                    mapTypeControl={false}
                    onClick={handleMapClick} 
                    keyboardShortcuts={false}
                    gestureHandling={'none'} 
                    scrollwheel={false} // Enabled
                >
                    {markerPos && (
                    <AdvancedMarker
                        position={markerPos}
                        draggable={false} 
                        onDragEnd={handleMarkerDragEnd} 
                    >
                        <CustomMarker />
                    </AdvancedMarker>
                    )}
                </Map>
            </div>
        </div>
    </div>
  );
}

// --- Main Export with ApiProvider ---
export function LocationMap(props: LocationMapProps) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY; 

  if (!apiKey) {
    return (
      <div className="h-full w-full relative z-10 flex items-center justify-center bg-red-100 text-red-700 border-2 border-red-500 font-medium p-4">
        Error: Google Maps API Key is missing.
      </div>
    );
  }

  return (
    <APIProvider apiKey={apiKey}>
      <MyLocationMap {...props} />
    </APIProvider>
  );
}