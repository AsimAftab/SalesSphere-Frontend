import { useEffect } from 'react';
import { useMap } from "@vis.gl/react-google-maps";
import type { Location } from '@/api/liveTrackingService';
import type { BeatPlan } from '@/api/beatPlanService';

interface PlannedRoutesProps {
    currentLocation: Location | null;
    beatPlan: BeatPlan | null;
    enabled: boolean;
}

const PlannedRoutes = ({
    currentLocation,
    beatPlan,
    enabled
}: PlannedRoutesProps) => {
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

export default PlannedRoutes;
