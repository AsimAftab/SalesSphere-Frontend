import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSocket } from '../../../../../../context/SocketContext';
import {
    getEmployeeSessionData,
    type Location,
    type EmployeeSessionData,
    type SessionBreadcrumbs
} from '../../../../../../api/liveTrackingService';
import {
    getBeatPlanById,
    type BeatPlan,
} from '../../../../../../api/beatPlanService';
import {
    calculateAverageCenter,
    type UnifiedLocation,
} from '../../../../../../api/mapService';
import { calculateHaversineDistance, formatBreadcrumb, type TimelineItem } from '../utils/sessionUtils';

export const useSessionDetails = (sessionId: string | undefined) => {
    const { socket, isConnected } = useSocket();

    // --- State ---
    const [breadcrumbs, setBreadcrumbs] = useState<SessionBreadcrumbs | null>(null);
    const [timeline, setTimeline] = useState<TimelineItem[]>([]);
    const [liveLocation, setLiveLocation] = useState<Location | null>(null);
    const [liveStatus, setLiveStatus] = useState<string>("");
    const [hoveredMarker, setHoveredMarker] = useState<{
        lat: number;
        lng: number;
        name: string;
        type: string;
        address: string;
    } | null>(null);

    // --- Data Fetching ---
    const {
        data: sessionData,
        isLoading: isSessionLoading,
        error: sessionError,
    } = useQuery<EmployeeSessionData, Error>({
        queryKey: ['employeeSession', sessionId],
        queryFn: () => getEmployeeSessionData(sessionId!),
        enabled: !!sessionId,
    });

    const summary = sessionData?.summary;
    const beatPlanId = summary?.beatPlan._id;

    const {
        data: beatPlan,
        isLoading: isBeatPlanLoading,
        error: beatPlanError,
    } = useQuery<BeatPlan, Error>({
        queryKey: ['beatPlan', beatPlanId],
        queryFn: () => getBeatPlanById(beatPlanId!),
        enabled: !!beatPlanId,
    });

    // --- Derived Data ---
    const directoryLocations = useMemo(() => {
        if (!beatPlan) return [];
        const locations: UnifiedLocation[] = [];
        beatPlan.parties.forEach(p => p.location.latitude && locations.push({ id: p._id, type: 'Party', name: p.partyName, address: p.location.address || '', coords: { lat: p.location.latitude!, lng: p.location.longitude! } }));
        beatPlan.sites.forEach(s => s.location.latitude && locations.push({ id: s._id, type: 'Site', name: s.siteName, address: s.location.address || '', coords: { lat: s.location.latitude!, lng: s.location.longitude! } }));
        beatPlan.prospects.forEach(p => p.location.latitude && locations.push({ id: p._id, type: 'Prospect', name: p.prospectName, address: p.location.address || '', coords: { lat: p.location.latitude!, lng: p.location.longitude! } }));
        return locations;
    }, [beatPlan]);

    const directoryNameMap = useMemo(() => {
        return new Map<string, string>(directoryLocations.map((l) => [l.id, l.name]));
    }, [directoryLocations]);

    // --- Effects ---
    // 1. Sync Session Data
    useEffect(() => {
        if (sessionData) {
            setBreadcrumbs(sessionData.breadcrumbs);
            setLiveStatus(sessionData.summary.status);
            if (sessionData.breadcrumbs?.breadcrumbs?.length) {
                setLiveLocation(sessionData.breadcrumbs.breadcrumbs[sessionData.breadcrumbs.breadcrumbs.length - 1]);
            }
        }
    }, [sessionData]);

    // 2. Build Timeline
    useEffect(() => {
        if (!breadcrumbs) {
            setTimeline([]);
            return;
        }
        const items = breadcrumbs.breadcrumbs.map((b) => formatBreadcrumb(b, directoryNameMap));
        if (items.length) items[items.length - 1].isCurrent = true;
        setTimeline(items.reverse());
    }, [breadcrumbs, directoryNameMap]);

    // 3. Socket Subscription
    useEffect(() => {
        if (!socket || !isConnected || !summary || summary.status !== 'active') return;

        socket.emit("watch-beatplan", { beatPlanId: summary.beatPlan._id });

        const onLocationUpdate = (data: { location: Location; nearestDirectory?: Location["nearestDirectory"] }) => {
            const newLoc: Location = { ...data.location, nearestDirectory: data.nearestDirectory };
            setLiveLocation(newLoc);

            setTimeline((prev) => {
                const prevClean = prev.map((p) => ({ ...p, isCurrent: false }));
                const newItem = formatBreadcrumb(newLoc, directoryNameMap, true);
                return [newItem, ...prevClean];
            });

            setBreadcrumbs((prev) =>
                prev ? { ...prev, breadcrumbs: [...prev.breadcrumbs, newLoc] } : { sessionId: sessionId!, breadcrumbs: [newLoc], totalPoints: 1 } as any
            );
        };

        socket.on("location-update", onLocationUpdate);
        return () => {
            socket.emit("unwatch-beatplan", { beatPlanId: summary.beatPlan._id });
            socket.off("location-update", onLocationUpdate);
        };
    }, [socket, isConnected, summary, directoryNameMap, sessionId]);

    // --- Derived Map Data ---
    const visitedDirectoryIds = useMemo(() => {
        if (!breadcrumbs) return new Set<string>();
        const ids = new Set<string>();
        breadcrumbs.breadcrumbs.forEach(b => {
            if (b.nearestDirectory?.directoryId) ids.add(b.nearestDirectory.directoryId);
        });

        // Fallback proximity check for archived sessions
        if (ids.size === 0 && directoryLocations.length > 0) {
            const VISIT_THRESHOLD_KM = 0.05;
            breadcrumbs.breadcrumbs.forEach(point => {
                directoryLocations.forEach(dir => {
                    const dist = calculateHaversineDistance(point.latitude, point.longitude, dir.coords.lat, dir.coords.lng);
                    if (dist <= VISIT_THRESHOLD_KM) ids.add(dir.id);
                });
            });
        }
        return ids;
    }, [breadcrumbs, directoryLocations]);

    // --- Map Center Logic ---
    // Logic extracted from original file
    const mapCenter = useMemo(() => {
        // (Simpler version of original logic, assuming plannedRoute calculation is outside or needed here?)
        // We need plannedRoute for center. Let's calculate plannedRoute here too or just use breadcrumbs fallback.
        // If we want FULL parity, we need plannedRoute here.

        const plannedCoords: google.maps.LatLngLiteral[] = [];
        if (beatPlan) {
            beatPlan.parties.forEach(p => p.location.latitude && plannedCoords.push({ lat: p.location.latitude!, lng: p.location.longitude! }));
            beatPlan.sites.forEach(s => s.location.latitude && plannedCoords.push({ lat: s.location.latitude!, lng: s.location.longitude! }));
            beatPlan.prospects.forEach(p => p.location.latitude && plannedCoords.push({ lat: p.location.latitude!, lng: p.location.longitude! }));
        }

        if (plannedCoords.length > 0) {
            return calculateAverageCenter(plannedCoords.map((c, i) => ({ id: `p${i}`, type: 'Party', name: '', address: '', coords: c })));
        }

        if (breadcrumbs && breadcrumbs.breadcrumbs.length > 0) {
            return calculateAverageCenter(breadcrumbs.breadcrumbs.map(b => ({ id: b._id, type: 'Party', name: '', address: '', coords: { lat: b.latitude, lng: b.longitude } })));
        }

        return { lat: 27.7172, lng: 85.324 };
    }, [beatPlan, breadcrumbs]);


    return {
        sessionData: {
            summary,
            beatPlan,
            breadcrumbs,
            timeline,
            liveLocation,
            liveStatus,
            directoryLocations,
            directoryNameMap,
            visitedDirectoryIds,
            mapCenter // Return initial center
        },
        uiState: {
            hoveredMarker,
            setHoveredMarker,
            isLoading: isSessionLoading || isBeatPlanLoading,
            error: sessionError || beatPlanError,
        }
    };
};
