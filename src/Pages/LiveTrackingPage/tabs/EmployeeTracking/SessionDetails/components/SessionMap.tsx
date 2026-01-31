import React, { useEffect, useState, useRef } from 'react';
import {
    APIProvider,
    Map as GoogleMap,
    AdvancedMarker,
    Pin,
    InfoWindow,
    type MapCameraChangedEvent,
} from "@vis.gl/react-google-maps";
import { Target } from "lucide-react";
import { colorConfig } from '../utils/sessionUtils';
import type { UnifiedLocation } from '../../../../../../api/mapService';
import type { BeatPlan } from '../../../../../../api/beatPlanService';
import type { Location } from '../../../../../../api/liveTrackingService';
import RoutePolyline from './RoutePolyline';
import PlannedRoutes from './PlannedRoutes';

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
        <div className="h-full rounded-lg border overflow-hidden bg-gray-100 relative min-h-0 min-w-0">
            <APIProvider apiKey={mapsApiKey}>
                <GoogleMap
                    center={currentCenter}
                    zoom={currentZoom}
                    onCameraChanged={handleCameraChange}
                    mapId={'YOUR_MAP_ID'}
                    gestureHandling={'greedy'}
                    disableDefaultUI={false}
                    mapTypeControl={false}
                    streetViewControl={false}
                    mapTypeId={'roadmap'}
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
                                <Pin
                                    background={colors.background}
                                    glyphColor={colors.glyphColor}
                                    borderColor={colors.borderColor}
                                    scale={scale}
                                />
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
                                {/* Outer Pulse */}
                                <div className="absolute w-12 h-12 bg-red-500 opacity-20 rounded-full animate-ping"></div>
                                {/* Inner Glow */}
                                <div className="absolute w-6 h-6 bg-red-500 opacity-40 rounded-full shadow-[0_0_15px_rgba(239,68,68,0.6)]"></div>
                                {/* Core Dot */}
                                <div className="relative w-3.5 h-3.5 bg-red-600 rounded-full border-2 border-white shadow-md z-10 box-content"></div>
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
                            headerContent={<div className="font-bold text-gray-900">{hoveredMarker.name}</div>}
                        >
                            <div
                                className="min-w-[180px] max-w-[220px] pb-1"
                                onMouseEnter={() => {
                                    if (hideTimerRef.current) {
                                        window.clearTimeout(hideTimerRef.current);
                                        hideTimerRef.current = null;
                                    }
                                }}
                                onMouseLeave={() => hideInfoDelayed(120)}
                            >
                                <div className="flex items-center gap-2 mb-1.5">
                                    <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-100">
                                        {hoveredMarker.type}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-600 leading-snug">
                                    {hoveredMarker.address || "Address unavailable"}
                                </p>
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