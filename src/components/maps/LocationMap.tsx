import { useEffect, useState, useCallback, useRef } from 'react';
import toast from 'react-hot-toast';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  type MapMouseEvent,
  useMap,
  type MapCameraChangedEvent
} from '@vis.gl/react-google-maps';

// Imported Components & Hooks
import { CustomMarker } from './CustomMarker';
import { LocationSearchBox } from './LocationSearchBox';
import { useLocationServices, type Suggestion } from './useLocationServices';
import { useAuth } from '../../api/authService';

interface LocationMapProps {
  position: { lat: number; lng: number };
  onLocationChange: (location: { lat: number; lng: number }) => void;
  onAddressGeocoded: (address: string) => void;
  isViewerMode?: boolean;
  initialAddress?: string;
}

// --- Main Map Component (Internal) ---
function MyLocationMap({ position, onLocationChange, onAddressGeocoded, isViewerMode = false, initialAddress }: LocationMapProps) {
  const { user } = useAuth();
  const mapInstance = useMap();
  const [markerPos, setMarkerPos] = useState<google.maps.LatLngLiteral | null>(position);

  const [currentZoom, setCurrentZoom] = useState(isViewerMode ? 14 : 13);
  const [currentCenter, setCurrentCenter] = useState(position);
  const currentCenterRef = useRef<google.maps.LatLngLiteral>(position);

  const {
    searchQuery, setSearchQuery, isSearching, setIsSearching,
    suggestions, setSuggestions, debouncedSearchQuery,
    isSuggestionSelected, setIsSuggestionSelected,
    searchPlaces, fetchPlaceDetails, geocodeAddress, reverseGeocode
  } = useLocationServices(isViewerMode);

  // Initial Position Setup
  useEffect(() => {
    let effectivePos = position;
    const isDefault = Math.abs(position.lat - 27.7172) < 0.001 && Math.abs(position.lng - 85.324) < 0.001;

    if (isDefault && user?.organizationId && typeof user.organizationId !== 'string') {
      const org = user.organizationId as { _id: string; name: string; latitude?: number; longitude?: number };
      if (org.latitude && org.longitude) {
        effectivePos = { lat: org.latitude, lng: org.longitude };
        onLocationChange(effectivePos);
      }
    }

    setMarkerPos(effectivePos);
    setCurrentCenter(effectivePos);
    currentCenterRef.current = effectivePos;
  }, [position, user, onLocationChange]);

  // Map Resize Handler
  useEffect(() => {
    if (mapInstance) {
      const timer = setTimeout(() => {
        google.maps.event.trigger(mapInstance, 'resize');
        mapInstance.setCenter(currentCenter);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [mapInstance, currentCenter]);

  // Camera Change Handler
  const handleCameraChange = (e: MapCameraChangedEvent) => {
    setCurrentZoom(e.detail.zoom);
    setCurrentCenter(e.detail.center);
    currentCenterRef.current = e.detail.center;
  };

  // Helper to update Map State
  const updateMapState = useCallback((newPos: google.maps.LatLngLiteral, address: string) => {
    setMarkerPos(newPos);
    setCurrentCenter(newPos);
    setCurrentZoom(13);
    onLocationChange(newPos);
    onAddressGeocoded(address);
    setSearchQuery(address);
  }, [onLocationChange, onAddressGeocoded, setSearchQuery]);

  // Geocode initial address to center the map (without filling search bar)
  const [hasGeocodedInitial, setHasGeocodedInitial] = useState(false);
  useEffect(() => {
    if (!initialAddress || hasGeocodedInitial || !geocodeAddress) return;
    geocodeAddress(initialAddress).then((result) => {
      if (result) {
        setMarkerPos({ lat: result.lat, lng: result.lng });
        setCurrentCenter({ lat: result.lat, lng: result.lng });
        setCurrentZoom(13);
        onLocationChange({ lat: result.lat, lng: result.lng });
        onAddressGeocoded(result.address);
        setHasGeocodedInitial(true);
      }
    });
  }, [initialAddress, hasGeocodedInitial, geocodeAddress, onLocationChange, onAddressGeocoded]);

  // Reverse Geocoding Logic
  const handleReverseGeocode = useCallback(async (newPos: google.maps.LatLngLiteral) => {
    setMarkerPos(newPos);
    onLocationChange(newPos);

    if (isViewerMode) return;

    setSuggestions([]);
    setIsSuggestionSelected(false);

    const address = await reverseGeocode(newPos);
    if (address) {
      onAddressGeocoded(address);
      setSearchQuery(address);
    } else {
      const coords = `${newPos.lat.toFixed(6)}, ${newPos.lng.toFixed(6)}`;
      onAddressGeocoded(coords);
      setSearchQuery(coords);
    }
  }, [reverseGeocode, onLocationChange, onAddressGeocoded, isViewerMode, setSearchQuery, setIsSuggestionSelected, setSuggestions]);

  // Event Handlers
  const handleMapClick = (e: MapMouseEvent) => {
    if (!isViewerMode && e.detail.latLng) {
      const newPos = { lat: e.detail.latLng.lat, lng: e.detail.latLng.lng };
      handleReverseGeocode(newPos);
    }
  };

  const handleMarkerDragEnd = (e: google.maps.MapMouseEvent) => {
    if (!isViewerMode && e.latLng) {
      const newPos = { lat: e.latLng.lat(), lng: e.latLng.lng() };
      handleReverseGeocode(newPos);
    }
  };

  const handleGetCurrentLocation = () => {
    if (!isViewerMode && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (geoPosition) => {
          const newPos = { lat: geoPosition.coords.latitude, lng: geoPosition.coords.longitude };
          setCurrentCenter(newPos);
          setCurrentZoom(13);
          handleReverseGeocode(newPos);
        },
        () => toast.error('Failed to get current location')
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

  // Search Logic (Debounced)
  useEffect(() => {
    if (debouncedSearchQuery && !isSuggestionSelected && !isViewerMode) {
      searchPlaces(debouncedSearchQuery, currentCenterRef.current);
    } else {
      setSuggestions([]);
    }
  }, [debouncedSearchQuery, searchPlaces, isSuggestionSelected, isViewerMode, setSuggestions]);

  // Manual Search Handler (Button/Enter)
  const handleSearch = async () => {
    if (isViewerMode) return;
    setIsSearching(true);

    let currentSuggestions = suggestions;

    // Trigger fresh search on Enter/Click to ensure we have candidates
    if (searchQuery.trim().length >= 3) {
      currentSuggestions = await searchPlaces(searchQuery, currentCenter);
    }

    // Logic Update: If we found suggestions, show them. Do NOT auto-select.
    if (currentSuggestions && currentSuggestions.length > 0) {
      setIsSearching(false);
      return;
    }

    // Fallback: No suggestions found at all, try raw address geocode
    if (searchQuery.trim().length >= 3) {
      const result = await geocodeAddress(searchQuery);
      if (result) {
        updateMapState({ lat: result.lat, lng: result.lng }, result.address);
        setSuggestions([]);
      }
    } else {
      setIsSearching(false);
    }

    setIsSearching(false);
  };

  const handleSuggestionClick = async (suggestion: Suggestion) => {
    if (isViewerMode) return;
    setIsSuggestionSelected(true);
    setSearchQuery(suggestion.description);
    setSuggestions([]);

    const result = await fetchPlaceDetails(suggestion.place_id);
    if (result) {
      updateMapState({ lat: result.lat, lng: result.lng }, result.address || suggestion.description);
    }
  };

  if (isViewerMode) {
    return (
      <div className="flex-grow w-full h-full relative z-10" style={{ pointerEvents: 'auto' }}>
        <Map
          center={currentCenter}
          zoom={currentZoom}
          onCameraChanged={handleCameraChange}
          mapId={'YOUR_MAP_ID'}
          disableDefaultUI={true}
          zoomControl={true}
          fullscreenControl={false}
          streetViewControl={false}
          mapTypeControl={false}
          onClick={handleMapClick}
          keyboardShortcuts={false}
          gestureHandling={'greedy'}
          scrollwheel={true}
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

  return (
    <div className="flex flex-col h-full space-y-4 pt-4">
      <LocationSearchBox
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
        handleClearSearch={handleClearSearch}
        suggestions={suggestions}
        handleSuggestionClick={handleSuggestionClick}
        handleGetCurrentLocation={handleGetCurrentLocation}
        isSearching={isSearching}
        setIsSuggestionSelected={setIsSuggestionSelected}
      />

      <div className="border-2 border-gray-200 rounded-lg overflow-hidden shadow-lg flex flex-col flex-grow">
        <div className="bg-blue-50 px-4 py-2 border-b border-gray-200">
          <p className="text-sm text-gray-600">
            Click on the map or drag the marker to pinpoint the exact location
          </p>
        </div>

        <div className="flex-grow w-full relative z-10" style={{ pointerEvents: 'auto' }}>
          <Map
            center={currentCenter}
            zoom={currentZoom}
            onCameraChanged={handleCameraChange}
            mapId={'YOUR_MAP_ID'}
            disableDefaultUI={true}
            zoomControl={true}
            fullscreenControl={false}
            streetViewControl={false}
            mapTypeControl={false}
            onClick={handleMapClick}
            keyboardShortcuts={false}
            gestureHandling={'greedy'}
            scrollwheel={true}
          >
            {markerPos && (
              <AdvancedMarker
                position={markerPos}
                draggable={true}
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