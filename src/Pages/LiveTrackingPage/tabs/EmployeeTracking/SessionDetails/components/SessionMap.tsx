import React, { useEffect, useState, useRef } from 'react';
import {
    APIProvider,
    Map as GoogleMap,
    AdvancedMarker,
    Pin,
    useMap,
    InfoWindow,
    type MapCameraChangedEvent,
} from "@vis.gl/react-google-maps";
import { Target } from "lucide-react";
import { colorConfig } from '../utils/sessionUtils';
import type { UnifiedLocation } from '../../../../../../api/mapService';
import type { BeatPlan } from '../../../../../../api/beatPlanService';
import type { Location } from '../../../../../../api/liveTrackingService';

/* --- Helper Components (RoutePolyline, PlannedRoutes) --- */

const RoutePolyline = ({ path }: { path: google.maps.LatLngLiteral[] }) => {
    const map = useMap();
    useEffect(() => {
        if (!map || path.length < 2) return;
        const poly = new google.maps.Polyline({
            path,
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 4,
            map,
        });
        return () => { poly.setMap(null); };
    }, [map, path]);
    return null;
};

const PlannedRoutes = ({
    currentLocation,
    beatPlan,
    enabled
}: {
    currentLocation: Location | null;
    beatPlan: BeatPlan | null;
    enabled: boolean;
}) => {
    const map = useMap();
    useEffect(() => {
        if (!map || !currentLocation || !beatPlan || !enabled) return;
        const directionsService = new google.maps.DirectionsService();
        const polylines: google.maps.Polyline[] = [];
        const origin = { lat: currentLocation.latitude, lng: currentLocation.longitude };
        const destinations: Array<{ lat: number; lng: number; type: string; name: string }> = [];

        beatPlan.parties.forEach(p => p.location.latitude && destinations.push({ lat: p.location.latitude!, lng: p.location.longitude!, type: 'party', name: p.partyName }));
        beatPlan.sites.forEach(s => s.location.latitude && destinations.push({ lat: s.location.latitude!, lng: s.location.longitude!, type: 'site', name: s.siteName }));
        beatPlan.prospects.forEach(p => p.location.latitude && destinations.push({ lat: p.location.latitude!, lng: p.location.longitude!, type: 'prospect', name: p.prospectName }));

        const maxRoutes = 3;
        destinations.sort((a, b) => {
            const distA = Math.sqrt(Math.pow(a.lat - origin.lat, 2) + Math.pow(a.lng - origin.lng, 2));
            const distB = Math.sqrt(Math.pow(b.lat - origin.lat, 2) + Math.pow(b.lng - origin.lng, 2));
            return distA - distB;
        });

        destinations.slice(0, maxRoutes).forEach((dest, index) => {
            setTimeout(() => {
                const request: google.maps.DirectionsRequest = {
                    origin,
                    destination: { lat: dest.lat, lng: dest.lng },
                    travelMode: google.maps.TravelMode.DRIVING,
                };
                directionsService.route(request, (result, status) => {
                    if (status === 'OK' && result && result.routes[0]) {
                        const route = result.routes[0];
                        const path: google.maps.LatLng[] = [];
                        route.legs.forEach(leg => {
                            leg.steps.forEach(step => {
                                path.push(step.start_location);
                                if (step.path) step.path.forEach(point => path.push(point));
                            });
                        });
                        if (route.legs.length > 0) path.push(route.legs[route.legs.length - 1].end_location);

                        const polyline = new google.maps.Polyline({
                            path,
                            strokeColor: '#4285F4',
                            strokeOpacity: 0,
                            strokeWeight: 3,
                            icons: [{ icon: { path: 'M 0,-1 0,1', strokeOpacity: 1, strokeColor: '#4285F4', scale: 3 }, offset: '0', repeat: '20px' }],
                            map,
                        });
                        polylines.push(polyline);
                    }
                });
            }, index * 400);
        });
        return () => { polylines.forEach(p => p.setMap(null)); };
    }, [map, currentLocation, beatPlan, enabled]);
    return null;
};

/* --- Main SessionMap Component --- */

interface SessionMapProps {
    mapsApiKey: string;
    center: { lat: number; lng: number };
    liveLocation: Location | null;
    liveStatus: string;
    directoryLocations: UnifiedLocation[];
    visitedDirectoryIds: Set<string>;
    breadcrumbs: { lat: number; lng: number }[]; // Pre-processed coordinate list
    beatPlan: BeatPlan | null;
    showPlannedRoutes: boolean;
    // Interaction props
    hoveredMarker: { lat: number; lng: number; name: string; type: string; address: string } | null;
    setHoveredMarker: (marker: { lat: number; lng: number; name: string; type: string; address: string } | null) => void;
}

const SessionMap: React.FC<SessionMapProps> = ({
    mapsApiKey,
    center,
    liveLocation,
    liveStatus,
    directoryLocations,
    visitedDirectoryIds,
    breadcrumbs,
    beatPlan,
    showPlannedRoutes,
    hoveredMarker,
    setHoveredMarker
}) => {
    // ...

    // Map State
    const [currentCenter, setCurrentCenter] = useState(center);
    const [currentZoom, setCurrentZoom] = useState(14);
    const [hasMoved, setHasMoved] = useState(false);
    const hideTimerRef = useRef<number | null>(null);

    // Sync center prop to state
    useEffect(() => {
        setCurrentCenter(center);
        setHasMoved(false);
    }, [center]);

    const handleCameraChange = (e: MapCameraChangedEvent) => {
        setCurrentCenter(e.detail.center);
        setCurrentZoom(e.detail.zoom);

        const latDiff = Math.abs(e.detail.center.lat - center.lat);
        const lngDiff = Math.abs(e.detail.center.lng - center.lng);
        const zoomDiff = Math.abs(e.detail.zoom - 14);

        if (latDiff > 0.001 || lngDiff > 0.001 || zoomDiff > 0.5) {
            setHasMoved(true);
        } else {
            setHasMoved(false);
        }
    };

    const handleRecenter = () => {
        setCurrentCenter(center);
        setCurrentZoom(14);
        setHasMoved(false);
    };

    const showInfoFor = (lat: number, lng: number, meta: { name: string; type: string; address: string } | undefined) => {
        if (!meta) return;
        if (hideTimerRef.current) {
            window.clearTimeout(hideTimerRef.current);
            hideTimerRef.current = null;
        }
        setHoveredMarker({ lat, lng, name: meta.name, type: meta.type, address: meta.address });
    };

    const hideInfoDelayed = (delay = 180) => {
        if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);
        hideTimerRef.current = window.setTimeout(() => {
            setHoveredMarker(null);
            hideTimerRef.current = null;
        }, delay);
    };

    return (
        <div className="h-[50vh] lg:h-auto rounded-lg border overflow-hidden bg-gray-100 relative min-h-0 min-w-0">
            <APIProvider apiKey={mapsApiKey}>
                <GoogleMap
                    center={currentCenter}
                    zoom={currentZoom}
                    onCameraChanged={handleCameraChange}
                    mapId={'YOUR_MAP_ID'}
                    gestureHandling={'greedy'}
                    disableDefaultUI={false}
                    zoomControl={true}
                    style={{ width: '100%', height: '100%' }}
                >
                    {/* Directory Markers */}
                    {directoryLocations.map((directory) => {
                        const rawType = directory.type ?? "default";
                        const capType = rawType.charAt(0).toUpperCase() + rawType.slice(1).toLowerCase();
                        const colors = colorConfig[capType] || colorConfig.default;
                        const meta = { name: directory.name, type: capType, address: directory.address ?? "" };
                        const isVisited = visitedDirectoryIds.has(directory.id);
                        const scale = isVisited ? 1.2 : 0.8;

                        return (
                            <AdvancedMarker
                                key={`dir-${directory.id}`}
                                position={directory.coords}
                                onMouseEnter={() => showInfoFor(directory.coords.lat, directory.coords.lng, meta)}
                                onMouseLeave={() => hideInfoDelayed(200)}
                            >
                                <Pin background={colors.background} glyphColor={colors.glyphColor} borderColor={colors.borderColor} scale={scale} />
                            </AdvancedMarker>
                        );
                    })}

                    {/* Route Polyline */}
                    {breadcrumbs.length > 1 && <RoutePolyline path={breadcrumbs} />}

                    {/* Planned Routes */}
                    <PlannedRoutes currentLocation={liveLocation} beatPlan={beatPlan} enabled={showPlannedRoutes} />

                    {/* Live Marker */}
                    {liveLocation && liveStatus === 'active' && (
                        <AdvancedMarker position={{ lat: liveLocation.latitude, lng: liveLocation.longitude }} zIndex={999}>
                            <div className="relative flex items-center justify-center">
                                <div className="absolute w-10 h-10 bg-red-500 opacity-40 rounded-full animate-ping"></div>
                                <div className="absolute w-6 h-6 bg-red-600 opacity-60 rounded-full"></div>
                                <div className="relative w-4 h-4 bg-red-700 rounded-full border-2 border-white shadow-lg"></div>
                            </div>
                        </AdvancedMarker>
                    )}

                    {/* InfoWindow */}
                    {hoveredMarker && (
                        <InfoWindow
                            position={{ lat: hoveredMarker.lat, lng: hoveredMarker.lng }}
                            onCloseClick={() => setHoveredMarker(null)}
                            shouldFocus={false}
                            disableAutoPan
                        >
                            <div
                                className="max-w-xs text-sm text-gray-800 p-2"
                                onMouseEnter={() => {
                                    if (hideTimerRef.current) {
                                        window.clearTimeout(hideTimerRef.current);
                                        hideTimerRef.current = null;
                                    }
                                }}
                                onMouseLeave={() => hideInfoDelayed(120)}
                            >
                                <p className="font-bold">{hoveredMarker.name}</p>
                                <p className="text-xs text-blue-600">Type: {hoveredMarker.type}</p>
                                <p className="text-xs text-gray-600">{hoveredMarker.address}</p>
                            </div>
                        </InfoWindow>
                    )}
                </GoogleMap>
            </APIProvider>

            {/* Recenter Button */}
            {hasMoved && (
                <button
                    type="button"
                    onClick={handleRecenter}
                    className="absolute top-4 right-4 bg-white hover:bg-gray-50 text-gray-700 font-medium px-4 py-2 rounded-lg shadow-lg border border-gray-200 flex items-center gap-2 transition-all duration-200 hover:shadow-xl z-10"
                    title="Recenter map"
                >
                    <Target size={18} />
                    <span className="hidden sm:inline">Recenter</span>
                </button>
            )}
        </div>
    );
};

export default SessionMap;
