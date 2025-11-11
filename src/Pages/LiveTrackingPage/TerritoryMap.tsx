import { useMemo, useState, useEffect } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  type MapCameraChangedEvent,
} from '@vis.gl/react-google-maps';

// --- TYPE DEFINITIONS ---
export type UnifiedLocation = {
  id: string;
  type: 'Party' | 'Prospect' | 'Site';
  name: string;
  address: string;
  coords: { lat: number; lng: number };
};

interface TerritoryMapProps {
  locations: UnifiedLocation[];
  selectedLocationId?: string | null;
  onMarkerClick: (locationId: string) => void;
  defaultCenter?: { lat: number; lng: number };
  defaultZoom?: number;
}

// --- COLOR CONFIGURATION ---
const colorConfig: Record<UnifiedLocation['type'], { background: string; glyphColor: string; borderColor: string }> = {
  Party: { background: '#4285F4', glyphColor: '#FFFFFF', borderColor: '#3578E5' }, // Google Blue
  Prospect: { background: '#34A853', glyphColor: '#FFFFFF', borderColor: '#2C9C47' }, // Google Green
  Site: { background: '#fb7405ff', glyphColor: '#000000', borderColor: '#F2B000' }, // Google Yellow
};

// --- Main Map Component (Internal) ---
function MyTerritoryMap({
  locations,
  selectedLocationId,
  onMarkerClick,
  defaultCenter = { lat: 27.7172, lng: 85.3240 }, // Default to Kathmandu
  defaultZoom = 12,
}: TerritoryMapProps) {
  // Memoize the locations to prevent unnecessary re-renders
  const memoizedLocations = useMemo(() => locations, [locations]);

  // STATE FOR CONTROLLED MAP - Allows zoom/pan to work properly
  const [currentCenter, setCurrentCenter] = useState(defaultCenter);
  const [currentZoom, setCurrentZoom] = useState(defaultZoom);

  // DEBUG: Log all locations being rendered
  useEffect(() => {
    console.log('🗺️ TerritoryMap - Total locations to render:', memoizedLocations.length);
    const byType = memoizedLocations.reduce((acc, loc) => {
      acc[loc.type] = (acc[loc.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    console.log('📊 Breakdown by type:', byType);
    console.log('📍 All locations:', memoizedLocations);
  }, [memoizedLocations]);

  // Update center when selected location changes
  useEffect(() => {
    if (selectedLocationId) {
      const selectedLocation = locations.find(loc => loc.id === selectedLocationId);
      if (selectedLocation) {
        setCurrentCenter(selectedLocation.coords);
        setCurrentZoom(14); // Zoom in on selected location
      }
    }
  }, [selectedLocationId, locations]);

  // Handle camera changes (zoom, pan, etc.)
  const handleCameraChange = (e: MapCameraChangedEvent) => {
    setCurrentCenter(e.detail.center);
    setCurrentZoom(e.detail.zoom);
  };

  return (
    <div className="w-full h-full">
      <Map
        center={currentCenter}
        zoom={currentZoom}
        onCameraChanged={handleCameraChange}
        mapId={'YOUR_MAP_ID'}
        disableDefaultUI={false}
        zoomControl={true}
        fullscreenControl={false}
        streetViewControl={false}
        mapTypeControl={false}
        gestureHandling={'greedy'}
        scrollwheel={true}
      >
        {memoizedLocations.map((location) => {
          const isSelected = location.id === selectedLocationId;
          const colors = colorConfig[location.type];
          
          return (
            <AdvancedMarker
              key={location.id}
              position={location.coords}
              onClick={() => onMarkerClick(location.id)}
            >
              <Pin
                background={colors.background}
                glyphColor={colors.glyphColor}
                borderColor={colors.borderColor}
                scale={isSelected ? 1.2 : 1}
              />
            </AdvancedMarker>
          );
        })}
      </Map>
    </div>
  );
}

// --- Main Export with ApiProvider ---
export function TerritoryMap(props: TerritoryMapProps) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-red-100 text-red-700 border-2 border-red-500 font-medium p-4">
        Error: Google Maps API Key is missing.
      </div>
    );
  }

  return (
    <APIProvider apiKey={apiKey}>
      <MyTerritoryMap {...props} />
    </APIProvider>
  );
}