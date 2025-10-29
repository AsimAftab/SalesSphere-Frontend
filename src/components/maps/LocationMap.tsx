import { useEffect, useRef, useState, useCallback } from 'react';
import { Search, Navigation } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Button from '../../components/UI/Button/Button';

// --- DEBOUNCE HOOK (Utility) ---
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
};

// --- SUGGESTION TYPE ---
interface Suggestion {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

interface LocationMapProps {
  position: { lat: number; lng: number };
  onLocationChange: (location: { lat: number; lng: number }) => void;
}

export function LocationMap({ position, onLocationChange }: LocationMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<L.Map | null>(null);
  const [marker, setMarker] = useState<L.Marker | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // --- State for suggestions ---
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const debouncedSearchQuery = useDebounce(searchQuery, 400);

  // Initialize map
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
    const newMarker = L.marker([position.lat, position.lng], { icon: customIcon }).addTo(
      newMap
    );
    newMap.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      newMarker.setLatLng([lat, lng]);
      onLocationChange({ lat, lng });
    });
    setMap(newMap);
    setMarker(newMarker);
    return () => {
      newMap.remove();
    };
  }, []); // Empty dependency array is correct here to init map once

  // Update marker position when position prop changes
  useEffect(() => {
    if (marker && map) {
      marker.setLatLng([position.lat, position.lng]);
      map.setView([position.lat, position.lng], map.getZoom());
    }
  }, [position, marker, map]);

  // Fetch suggestions based on search query
  const fetchSuggestions = useCallback(async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }
    try {
      // Removed country code to allow global search
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&limit=5`
      );
      const data: Suggestion[] = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    }
  }, []);

  // Trigger search when debounced query changes
  useEffect(() => {
    if (debouncedSearchQuery) {
      fetchSuggestions(debouncedSearchQuery);
    } else {
      setSuggestions([]);
    }
  }, [debouncedSearchQuery, fetchSuggestions]);

  // Search for location (Search Button logic)
  const handleSearch = async () => {
    if (!searchQuery.trim() || !map) return;

    setIsSearching(true);
    setSuggestions([]); // Hide suggestions on manual search
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}&limit=5`
      );
      const data = await response.json();
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        if (marker) {
          marker.setLatLng([lat, lng]);
        }
        map.setView([lat, lng], 13);
        onLocationChange({ lat, lng });
      }
    } catch (error) {
      console.error('Error searching location:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle clicking a suggestion
  const handleSuggestionClick = (suggestion: Suggestion) => {
    const lat = parseFloat(suggestion.lat);
    const lng = parseFloat(suggestion.lon);

    if (map && marker) {
      marker.setLatLng([lat, lng]);
      map.setView([lat, lng], 13);
      onLocationChange({ lat, lng });
    }

    setSearchQuery('');
    setSuggestions([]);
  };

  // Get current location
  const handleGetCurrentLocation = () => {
    if ('geolocation' in navigator && map && marker) {
      navigator.geolocation.getCurrentPosition(
        (geoPosition) => {
          const lat = geoPosition.coords.latitude;
          const lng = geoPosition.coords.longitude;
          marker.setLatLng([lat, lng]);
          map.setView([lat, lng], 13);
          onLocationChange({ lat, lng });
        },
        (error) => {
          console.error('Error getting current location:', error);
        }
      );
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search for location (e.g., Kathmandu, Nepal)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleSearch())}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          
          {/* --- FIX: Changed z-10 to z-50 --- */}
          {suggestions.length > 0 && (
            <ul className="absolute z-50 w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1 max-h-48 overflow-y-auto">
              {suggestions.map((suggestion) => (
                <li
                  key={suggestion.place_id}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-100"
                >
                  {suggestion.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>
        <Button
          type="button"
          onClick={handleSearch}
          disabled={isSearching}
          variant="secondary"
          className="flex items-center gap-2"
        >
          <Search className="w-4 h-4" />
          {isSearching ? 'Searching...' : 'Search'}
        </Button>
        <Button
          type="button"
          onClick={handleGetCurrentLocation}
          variant="secondary"
          className="flex items-center justify-center"
          title="Get current location"
        >
          <Navigation className="w-4 h-4" />
        </Button>
      </div>

      {/* Map Container */}
      <div className="border-2 border-gray-200 rounded-lg overflow-hidden shadow-lg">
        <div className="bg-blue-50 px-4 py-2 border-b border-gray-200">
          <p className="text-sm text-gray-600">
            Click on the map to pinpoint the exact location
          </p>
        </div>
        <div ref={mapRef} className="h-80 w-full" />
      </div>
    </div>
  );
}