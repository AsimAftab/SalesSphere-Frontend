import { useMemo, useState, useEffect } from 'react';
import {
    APIProvider,
    Map,
    AdvancedMarker,
    Pin,
    type MapCameraChangedEvent,
} from '@vis.gl/react-google-maps';
import { findDensestCluster } from '../../../../../api/mapService';
import { Target } from 'lucide-react';

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

// Main Map Component (internal)
function MyTerritoryMap({
    locations,
    selectedLocationId,
    onMarkerClick,
    defaultCenter = { lat: 27.7172, lng: 85.3240 }, // Default to Kathmandu
    defaultZoom = 12,
}: TerritoryMapProps) {
    // Memoize the locations to prevent unnecessary re-renders
    const memoizedLocations = useMemo(() => locations, [locations]);

    // Calculate the densest cluster center (where most markers are concentrated)
    const calculatedCenter = useMemo(() => {
        return findDensestCluster(memoizedLocations);
    }, [memoizedLocations]);

    // STATE FOR CONTROLLED MAP - Allows zoom/pan to work properly
    // Use calculated center on initial load, fall back to defaultCenter
    const [currentCenter, setCurrentCenter] = useState(calculatedCenter || defaultCenter);
    const [currentZoom, setCurrentZoom] = useState(defaultZoom);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [hasMovedFromCenter, setHasMovedFromCenter] = useState(false);

    // Update center when selected location changes - but only after initial load
    useEffect(() => {
        if (selectedLocationId && isInitialLoad) {
            setIsInitialLoad(false);
            return; // Skip on initial load to let clustering center take effect
        }

        if (selectedLocationId && !isInitialLoad) {
            const selectedLocation = locations.find(loc => loc.id === selectedLocationId);
            if (selectedLocation) {
                setCurrentCenter(selectedLocation.coords);
                setCurrentZoom(14); // Zoom in on selected location
            }
        }
    }, [selectedLocationId, locations, isInitialLoad]);

    // Handle camera changes (zoom, pan, etc.)
    const handleCameraChange = (e: MapCameraChangedEvent) => {
        setCurrentCenter(e.detail.center);
        setCurrentZoom(e.detail.zoom);

        // Check if map has moved from the original calculated center
        if (calculatedCenter) {
            const threshold = 0.001; // Small threshold to account for minor floating point differences
            const latDiff = Math.abs(e.detail.center.lat - calculatedCenter.lat);
            const lngDiff = Math.abs(e.detail.center.lng - calculatedCenter.lng);
            const zoomDiff = Math.abs(e.detail.zoom - defaultZoom);

            // Consider moved if center changed significantly or zoom changed
            if (latDiff > threshold || lngDiff > threshold || zoomDiff > 0.5) {
                setHasMovedFromCenter(true);
            } else {
                setHasMovedFromCenter(false);
            }
        }
    };

    // Recenter map to densest cluster
    const handleRecenter = () => {
        if (calculatedCenter) {
            setCurrentCenter(calculatedCenter);
            setCurrentZoom(defaultZoom);
            setHasMovedFromCenter(false);
        }
    };

    return (
        <div className="w-full h-full min-h-[400px] relative">
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
                keyboardShortcuts={false}
                style={{ width: '100%', height: '100%', minHeight: '400px' }}
            >
                {memoizedLocations
                    .filter((location) => {
                        // Filter out locations with invalid coordinates
                        const coords = location.coords;
                        return (
                            coords &&
                            typeof coords.lat === 'number' &&
                            typeof coords.lng === 'number' &&
                            !isNaN(coords.lat) &&
                            !isNaN(coords.lng)
                        );
                    })
                    .map((location) => {
                        const isSelected = location.id === selectedLocationId;
                        const colors = colorConfig[location.type];
                        return (
                            <AdvancedMarker
                                key={location.id}
                                position={{ lat: location.coords.lat, lng: location.coords.lng }}
                                onClick={() => onMarkerClick(location.id)}
                            >
                                <div className="relative cursor-pointer">
                                    <Pin
                                        background={colors.background}
                                        glyphColor={colors.glyphColor}
                                        borderColor={colors.borderColor}
                                        scale={isSelected ? 1.3 : 1}
                                    />
                                </div>
                            </AdvancedMarker>
                        );
                    })}
            </Map>

            {/* Recenter Button - Only show when map has moved from center */}
            {hasMovedFromCenter && (
                <button
                    type="button"
                    onClick={handleRecenter}
                    className="absolute top-4 right-4 bg-white hover:bg-gray-50 text-gray-700 font-medium px-4 py-2 rounded-lg shadow-lg border border-gray-200 flex items-center gap-2 transition-all duration-200 hover:shadow-xl z-10"
                    title="Recenter map to show all locations"
                >
                    <Target size={18} />
                    <span className="hidden sm:inline">Recenter</span>
                </button>
            )}
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