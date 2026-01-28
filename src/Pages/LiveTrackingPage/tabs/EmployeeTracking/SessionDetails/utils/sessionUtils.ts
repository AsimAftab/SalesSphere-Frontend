// Utility functions for Session Tracking
import { MapPin } from "lucide-react";
import type { ElementType } from "react";
import type { Location } from "../../../../../api/liveTrackingService";

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
    title: string;
    subtitle?: string;
    icon: ElementType;
    color: string;
    isCurrent?: boolean;
}

export const formatBreadcrumb = (loc: Location, nameMap: Map<string, string>, isCurrent = false): TimelineItem => {
    const title = loc.address?.formattedAddress ||
        loc.address?.locality ||
        loc.address?.city ||
        "Location Update";

    let subtitle: string | undefined;
    if (loc.nearestDirectory) {
        const directoryName = nameMap.get(loc.nearestDirectory.directoryId) ??
            loc.nearestDirectory.name ??
            loc.nearestDirectory.directoryType;
        const distance = loc.nearestDirectory.distance
            ? `${loc.nearestDirectory.distance.toFixed(2)} km`
            : '';
        subtitle = distance ? `Near ${directoryName} (${distance})` : `Near ${directoryName}`;
    }

    return {
        time: new Date(loc.timestamp).toLocaleTimeString(),
        title,
        subtitle,
        icon: MapPin,
        color: isCurrent ? "text-red-500" : "text-blue-500",
        isCurrent,
    };
};

export const colorConfig: Record<string, { background: string; glyphColor: string; borderColor: string }> = {
    Party: { background: "#4285F4", glyphColor: "#FFFFFF", borderColor: "#3578E5" },
    Prospect: { background: "#34A853", glyphColor: "#FFFFFF", borderColor: "#2C9C47" },
    Site: { background: "#fb7405", glyphColor: "#000000", borderColor: "#F2B000" },
    default: { background: "#EA4335", glyphColor: "#FFFFFF", borderColor: "#D93025" },
};
