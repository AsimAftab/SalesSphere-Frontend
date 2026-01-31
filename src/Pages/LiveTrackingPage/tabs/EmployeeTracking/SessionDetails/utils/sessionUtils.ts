// Utility functions for Session Tracking
import { MapPin } from "lucide-react";
import type { ElementType } from "react";
import type { Location } from "../../../../../../api/liveTrackingService";

export function toRadians(deg: number) {
    return deg * (Math.PI / 180);
}

export function calculateHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371;
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) ** 2;
    return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export interface TimelineItem {
    time: string;
    timestamp: number;
    title: string;
    subtitle?: string;
    icon: ElementType;
    color: string;
    isCurrent?: boolean;
    type: 'location' | 'visit';
    directoryType?: string;
}

export const formatBreadcrumb = (loc: Location, nameMap: Map<string, string>, isCurrent = false): TimelineItem => {
    // Try to get a meaningful title
    let title = loc.address?.formattedAddress ||
        loc.address?.locality ||
        loc.address?.city;

    let subtitle: string | undefined;

    // Calculate nearest directory info
    let directoryName = "Unknown";
    let distanceStr = "";

    if (loc.nearestDirectory) {
        directoryName = nameMap.get(loc.nearestDirectory.directoryId) ??
            loc.nearestDirectory.name ??
            loc.nearestDirectory.directoryType;

        if (loc.nearestDirectory.distance) {
            distanceStr = `${loc.nearestDirectory.distance.toFixed(2)} km`;
        }
    }

    // Fallback Logic: If no address, use "Near [Landmark]" as title
    if (!title && loc.nearestDirectory) {
        title = `Near ${directoryName}`;
        subtitle = distanceStr ? `Distance: ${distanceStr}` : undefined;
    } else if (!title) {
        title = "Location Update";
    } else {
        // Normal case: Address is title, "Near..." is subtitle
        subtitle = loc.nearestDirectory
            ? distanceStr ? `Near ${directoryName} (${distanceStr})` : `Near ${directoryName}`
            : undefined;
    }

    return {
        time: new Date(loc.timestamp).toLocaleTimeString(),
        timestamp: new Date(loc.timestamp).getTime(),
        title,
        subtitle,
        icon: MapPin,
        color: isCurrent ? "text-red-500" : "text-blue-500",
        isCurrent,
        type: 'location'
    };
};

import { CheckCircle } from "lucide-react";

interface VisitEntry {
    directoryId: string;
    directoryType?: string;
    visitedAt?: string;
    status: string;
}

export const formatVisit = (visit: VisitEntry, nameMap: Map<string, string>, addressMap: Map<string, string>): TimelineItem => {
    const directoryName = nameMap.get(visit.directoryId) || "Unknown Location";
    const address = addressMap.get(visit.directoryId) || "Address not available";
    const typeLabel = visit.directoryType ? visit.directoryType.charAt(0).toUpperCase() + visit.directoryType.slice(1) : 'Stop';

    return {
        time: visit.visitedAt ? new Date(visit.visitedAt).toLocaleTimeString() : 'Unknown Time',
        timestamp: visit.visitedAt ? new Date(visit.visitedAt).getTime() : 0,
        title: directoryName, // Just name, "Visited" is implied by context/icon
        subtitle: address,
        icon: CheckCircle,
        color: "text-green-600",
        isCurrent: false,
        type: 'visit',
        directoryType: typeLabel
    };
};

export const colorConfig: Record<string, { background: string; glyphColor: string; borderColor: string }> = {
    Party: { background: "#4285F4", glyphColor: "#FFFFFF", borderColor: "#3578E5" },
    Prospect: { background: "#34A853", glyphColor: "#FFFFFF", borderColor: "#2C9C47" },
    Site: { background: "#fb7405", glyphColor: "#000000", borderColor: "#F2B000" },
    default: { background: "#EA4335", glyphColor: "#FFFFFF", borderColor: "#D93025" },
};
