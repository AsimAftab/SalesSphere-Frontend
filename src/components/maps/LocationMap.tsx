import { useEffect, useRef, useState } from 'react';
import { Navigation, Loader2 } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Button from '../../components/UI/Button/Button';
import toast from 'react-hot-toast';

interface LocationMapProps {
  position: { lat: number; lng: number };
  onLocationChange: (location: { lat: number; lng: number }) => void;
}

export function LocationMap({ position, onLocationChange }: LocationMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<L.Map | null>(null);
  const [marker, setMarker] = useState<L.Marker | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const lastInternalPosition = useRef<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current || map) return;

    const newMap = L.map(mapRef.current, {
      center: [position.lat, position.lng],
      zoom: 13,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(newMap);

    const customIcon = L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="position: relative; width: 32px; height: 32px;">
          <div style="width: 32px; height: 32px; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); border-radius: 50% 50% 50% 0; transform: rotate(-45deg); box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4); border: 3px solid white;"></div>
          <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(45deg); width: 12px; height: 12px; background: white; border-radius: 50%;"></div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    });

    const newMarker = L.marker([position.lat, position.lng], {
      icon: customIcon,
      draggable: true // Make marker draggable for better UX
    }).addTo(newMap);

    // Update position when marker is dragged
    newMarker.on('dragend', () => {
      const latlng = newMarker.getLatLng();
      lastInternalPosition.current = { lat: latlng.lat, lng: latlng.lng };
      onLocationChange({ lat: latlng.lat, lng: latlng.lng });
    });

    // Update position when map is clicked
    newMap.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      lastInternalPosition.current = { lat, lng };
      newMarker.setLatLng([lat, lng]);
      onLocationChange({ lat, lng });
    });

    setMap(newMap);
    setMarker(newMarker);

    return () => {
      newMap.remove();
    };
  }, []); // Empty dependency array is correct - only run once on mount

  useEffect(() => {
    if (!marker || !map) return;

    // Check if this position change came from within this component
    if (lastInternalPosition.current &&
        lastInternalPosition.current.lat === position.lat &&
        lastInternalPosition.current.lng === position.lng) {
      // This is our own update coming back, ignore it
      return;
    }

    // This is an external update, apply it
    marker.setLatLng([position.lat, position.lng]);
    map.setView([position.lat, position.lng], map.getZoom());
  }, [position, marker, map]);

  const handleInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
    if (query.length > 2) {
      try {
        const response = await fetch(`https://api.geoapify.com/v1/geocode/autocomplete?text=${query}&apiKey=${import.meta.env.VITE_GEOAPIFY_API_KEY}`);
        const data = await response.json();
        setSuggestions(data.features);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion: any) => {
    setSearchQuery(suggestion.properties.formatted);
    const [lon, lat] = suggestion.geometry.coordinates;
    if (marker && map) {
      // Store this as internal update
      lastInternalPosition.current = { lat, lng: lon };

      marker.setLatLng([lat, lon]);
      map.setView([lat, lon], 13);
      onLocationChange({ lat, lng: lon });
    }
    setSuggestions([]);
  };

  const handleGetCurrentLocation = () => {
    if (!('geolocation' in navigator)) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    if (!map || !marker) {
      toast.error('Map is not ready. Please try again.');
      return;
    }

    setIsGettingLocation(true);
    toast.info('Getting your location...', { duration: 2000 });

    navigator.geolocation.getCurrentPosition(
      (geoPosition) => {
        const lat = geoPosition.coords.latitude;
        const lng = geoPosition.coords.longitude;

        // Store this as internal update to prevent circular loop
        lastInternalPosition.current = { lat, lng };

        marker.setLatLng([lat, lng]);
        map.setView([lat, lng], 15);
        onLocationChange({ lat, lng });

        setIsGettingLocation(false);
        toast.success(`Location found!`, {
          description: `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`
        });
      },
      (error) => {
        console.error('Location error:', error);
        setIsGettingLocation(false);
        toast.error('Unable to get your location', {
          description: 'Please check your browser location permissions',
          duration: 5000
        });
      }
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search for location (e.g., Kathmandu, Nepal)"
            value={searchQuery}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {suggestions.length > 0 && (
            <ul className="absolute bg-white border border-gray-300 rounded-md mt-1 w-full z-[1001]">
              {suggestions.map((suggestion) => (
                <li
                  key={suggestion.properties.place_id}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  {suggestion.properties.formatted}
                </li>
              ))}
            </ul>
          )}
        </div>
        <Button
          type="button"
          onClick={handleGetCurrentLocation}
          variant="secondary"
          className="flex items-center justify-center"
          title="Get current location"
          disabled={isGettingLocation}
        >
          {isGettingLocation ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Navigation className="w-4 h-4" />
          )}
        </Button>
      </div>

      <div className="border-2 border-gray-200 rounded-lg overflow-hidden shadow-lg">
        <div className="bg-blue-50 px-4 py-2 border-b border-gray-200">
          <p className="text-sm text-gray-600">
            Click on the map or drag the marker to pinpoint the exact location
          </p>
        </div>
        <div ref={mapRef} className="h-80 w-full" />
      </div>
    </div>
  );
}
