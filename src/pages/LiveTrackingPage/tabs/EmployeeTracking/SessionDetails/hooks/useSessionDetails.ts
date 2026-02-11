import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSocket } from '@/providers/SocketProvider';
import {
    getEmployeeSessionData,
    type Location,
    type EmployeeSessionData,
    type SessionBreadcrumbs
} from '../../../../../../api/liveTrackingService';
import {
    getBeatPlanById,
    getArchivedBeatPlanById,
    type BeatPlan,
} from '../../../../../../api/beatPlanService';
import {
    calculateAverageCenter,
    type UnifiedLocation,
} from '../../../../../../api/mapService';
import { calculateHaversineDistance, formatBreadcrumb, formatVisit, type TimelineItem } from '../utils/sessionUtils';

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
        refetchInterval: 10000, // Poll every 5s to ensure live data sync
    });

    const summary = sessionData?.summary;
    const beatPlanId = summary?.beatPlan
        ? (typeof summary.beatPlan === 'object' ? summary.beatPlan._id : summary.beatPlan)
        : undefined;

    const {
        data: beatPlan,
        isLoading: isBeatPlanLoading,
        error: beatPlanError,
    } = useQuery<BeatPlan, Error>({
        queryKey: ['beatPlan', beatPlanId],
        queryFn: () => {
            if (summary?.status === 'completed') {
                return getArchivedBeatPlanById(beatPlanId!);
            }
            return getBeatPlanById(beatPlanId!);
        },
        enabled: !!beatPlanId,
        refetchInterval: 10000, // Poll every 5s to sync Visits updates
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

    const directoryAddressMap = useMemo(() => {
        return new Map<string, string>(directoryLocations.map((l) => [l.id, l.address ?? ""]));
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

    // 2. Build Timeline (Merged Breadcrumbs + Visits)
    useEffect(() => {
        let items: TimelineItem[] = [];

        // 1. Add Location Updates (Breadcrumbs)
        if (breadcrumbs && breadcrumbs.breadcrumbs.length > 0) {
            items = breadcrumbs.breadcrumbs.map((b) => formatBreadcrumb(b, directoryNameMap));
        }

        // 2. Add Visits (Check-Ins)
        if (beatPlan && beatPlan.visits) {
            const visits = beatPlan.visits
                .filter(v => v.status === 'visited' && v.visitedAt)
                .map(v => formatVisit(v, directoryNameMap, directoryAddressMap));
            items = [...items, ...visits];
        }

        // 3. Sort by Time (Newest First)
        items.sort((a, b) => b.timestamp - a.timestamp);

        // 4. Mark most recent LOCATION update as current (Live Position)
        // We only mark 'location' types as current for the pulsing effect, or visits if that's what user wants?
        // Usually "Current" refers to where the GPS IS.
        // 4. Mark most recent LOCATION update as current (Live Position) - ONLY IF ACTIVE
        const firstLocationIndex = items.findIndex(i => i.type === 'location');
        if (firstLocationIndex !== -1 && liveStatus === 'active') {
            items[firstLocationIndex].isCurrent = true;
        }

        setTimeline(items);
    }, [breadcrumbs, beatPlan, directoryNameMap, directoryAddressMap, liveStatus]);

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
                prev ? { ...prev, breadcrumbs: [...prev.breadcrumbs, newLoc] } : { sessionId: sessionId!, beatPlanId: '', userId: '', status: 'active', breadcrumbs: [newLoc], totalPoints: 1 } as SessionBreadcrumbs
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
        if (!beatPlan || !beatPlan.visits) return new Set<string>();

        const ids = new Set<string>();
        beatPlan.visits.forEach(visit => {
            if (visit.status === 'visited') {
                ids.add(visit.directoryId);
            }
        });
        return ids;
    }, [beatPlan]);

    // --- Stats Calculation (Frontend) ---
    const calculatedStats = useMemo(() => {
        if (!breadcrumbs || breadcrumbs.breadcrumbs.length === 0 || !summary) {
            return summary?.summary || { totalDistance: 0, totalDuration: 0, directoriesVisited: 0 };
        }

        // If session is completed, trust the backend summary BUT override visits
        if (summary.status === 'completed' && summary.summary.totalDistance > 0) {
            return {
                ...summary.summary,
                directoriesVisited: visitedDirectoryIds.size // Recalculate accurately from beatPlan
            };
        }

        // For Active/Check-ins, calculate locally
        let totalDistance = 0;
        const points = breadcrumbs.breadcrumbs;
        for (let i = 1; i < points.length; i++) {
            totalDistance += calculateHaversineDistance(
                points[i - 1].latitude,
                points[i - 1].longitude,
                points[i].latitude,
                points[i].longitude
            );
        }

        const startTime = new Date(summary.sessionStartedAt).getTime();
        const endTime = summary.sessionEndedAt ? new Date(summary.sessionEndedAt).getTime() : Date.now();
        // Ensure duration is at least 1 minute to avoid division by zero or tiny spans
        const durationMinutes = Math.max(1, (endTime - startTime) / (1000 * 60));

        const averageSpeed = durationMinutes > 0 ? (totalDistance / durationMinutes) * 60 : 0;

        return {
            totalDistance,
            totalDuration: durationMinutes,
            averageSpeed,
            hours: Math.floor(durationMinutes / 60),
            minutes: Math.floor(durationMinutes % 60),
            directoriesVisited: visitedDirectoryIds.size, // Use count from BeatPlan.visits
        };
    }, [breadcrumbs, summary, visitedDirectoryIds]);

    // --- Map Center Logic ---
    // Logic extracted from original file
    const mapCenter = useMemo(() => {


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
            summary: summary ? { ...summary, summary: { ...summary.summary, ...calculatedStats } } : undefined, // Merge calculated with backend (preserve visits)
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
