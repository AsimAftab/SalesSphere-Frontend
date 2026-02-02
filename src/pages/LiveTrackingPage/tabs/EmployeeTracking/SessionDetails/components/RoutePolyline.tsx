import { useEffect } from 'react';
import { useMap } from "@vis.gl/react-google-maps";

const RoutePolyline = ({ path }: { path: google.maps.LatLngLiteral[] }) => {
    const map = useMap();
    useEffect(() => {
        if (!map || path.length < 2) return;
        const poly = new google.maps.Polyline({
            path,
            strokeColor: '#ef4444',
            strokeOpacity: 0.6,
            strokeWeight: 3,
            geodesic: true,
            map,
        });
        return () => { poly.setMap(null); };
    }, [map, path]);
    return null;
};

export default RoutePolyline;
