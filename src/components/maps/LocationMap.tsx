import { useEffect, useState, useCallback } from 'react';
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

interface LocationMapProps {
  position: { lat: number; lng: number };
  onLocationChange: (location: { lat: number; lng: number }) => void;
  onAddressGeocoded: (address: string) => void;
  isViewerMode?: boolean;
}

// --- Main Map Component (Internal) ---
function MyLocationMap({ position, onLocationChange, onAddressGeocoded, isViewerMode = false }: LocationMapProps) {

  const mapInstance = useMap();
  const [markerPos, setMarkerPos] = useState<google.maps.LatLngLiteral | null>(position);

  const [currentZoom, setCurrentZoom] = useState(isViewerMode ? 14 : 13);
  const [currentCenter, setCurrentCenter] = useState(position);

  const {
    searchQuery, setSearchQuery, isSearching, setIsSearching,
    suggestions, setSuggestions, debouncedSearchQuery,
    isSuggestionSelected, setIsSuggestionSelected,
    placesLib,
    autocompleteSessionToken,
    geocoder
  } = useLocationServices(isViewerMode);

  useEffect(() => {
    setMarkerPos(position);
    setCurrentCenter(position);
  }, [position]);

  useEffect(() => {
    if (mapInstance) {
      const timer = setTimeout(() => {
        google.maps.event.trigger(mapInstance, 'resize');
        mapInstance.setCenter(currentCenter);
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [mapInstance, currentCenter]);

  const handleCameraChange = (e: MapCameraChangedEvent) => {
    setCurrentZoom(e.detail.zoom);
    setCurrentCenter(e.detail.center);
  };

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
          setCurrentCenter(newPos);
          setCurrentZoom(13);
          reverseGeocodeAndUpdate(newPos);
        },
        () => {
          toast.error('Failed to get current location');
        }
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

  const fetchSuggestions = useCallback(async (query: string): Promise<Suggestion[]> => {
    if (isViewerMode || !placesLib || !autocompleteSessionToken || query.length < 3) {
      setSuggestions([]);
      return [];
    }

    try {
      const { suggestions: newSuggestions } = await google.maps.places.AutocompleteSuggestion.fetchAutocompleteSuggestions({
        input: query,
        sessionToken: autocompleteSessionToken
      });

      if (newSuggestions) {
        const mappedSuggestions = newSuggestions.map((p: any) => ({
          description: p.placePrediction.text.text,
          place_id: p.placePrediction.placeId,
        }));
        setSuggestions(mappedSuggestions);
        return mappedSuggestions;
      } else {
        setSuggestions([]);
        return [];
      }
    } catch (error) {
      setSuggestions([]);
      return [];
    }
  }, [placesLib, isViewerMode, autocompleteSessionToken]);

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

    let currentSuggestions = suggestions;

    // If no suggestions are visible, try to fetch them first
    if (suggestions.length === 0 && searchQuery.trim().length >= 3) {
      currentSuggestions = await fetchSuggestions(searchQuery);
    }

    // Now if we have suggestions, use the first one or just show them?
    // User asked: "after hitting enter also it shows the suggestions"
    // If we just fetched suggestions and found some, we should just let the user see them (the state update in fetchSuggestions handles the UI).
    // But if the user explicitly hit Enter, usually they expect action.
    // Let's implement this logic:
    // 1. If we just fetched suggestions and found them, STOP and show them.
    // 2. If suggestions were ALREADY there (user saw them and hit enter), go to the first one.

    // However, checking "if suggestions.length === 0" before fetch implies they weren't there.
    if (suggestions.length === 0 && currentSuggestions.length > 0) {
      // We just found suggestions. Show them.
      setIsSearching(false);
      return;
    }

    let geocodePromise: Promise<any> = Promise.reject(new Error("No valid search query provided."));
    let chosenAddress: string = searchQuery;

    if (currentSuggestions.length > 0) {
      // Use the first suggestion
      chosenAddress = currentSuggestions[0].description;
      geocodePromise = new Promise((resolve, reject) => {
        geocoder.geocode({ placeId: currentSuggestions[0].place_id }, (results, status) => {
          if (status === google.maps.GeocoderStatus.OK && results) {
            resolve({ results, status });
          } else {
            reject('Geocode was not successful for place ID: ' + status);
          }
        });
      });
    } else if (searchQuery.trim()) {
      // Fallback: No suggestions found at all (even after fetch), try raw address geocode
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

        if (currentSuggestions.length === 0) { chosenAddress = response.results[0].formatted_address || searchQuery; }

        setMarkerPos(newPos);
        setCurrentCenter(newPos);
        setCurrentZoom(13);
        setSearchQuery(chosenAddress);
        onLocationChange(newPos);
        onAddressGeocoded(chosenAddress);
        setSuggestions([]); // Clear suggestions after successful navigation
      } else {
        toast.error(`Geocode failed: ${response.status}`);
      }
    } catch (error) {
      toast.error('Search failed');
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

        setMarkerPos(newPos);
        setCurrentCenter(newPos);
        setCurrentZoom(13);
        onLocationChange(newPos);
        onAddressGeocoded(chosenAddress);
      } else {
        toast.error(`Geocode failed: ${status}`);
      }
    });
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
      {/* Extracted Search UI */}
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

        <div className="flex-grow w-full relative z-10"
          style={{ pointerEvents: 'auto' }}
        >
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