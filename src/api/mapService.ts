import api from './api';

// Type for a single location point from the new API
export interface ApiLocation {
  _id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  type: 'party' | 'prospect' | 'site';
}

// Type for the 'data' object in the API response
interface MapData {
  parties: ApiLocation[];
  prospects: ApiLocation[];
  sites: ApiLocation[];
}

// Type for the full API response
interface MapApiResponse {
  success: boolean;
  count: {
    total: number;
    parties: number;
    prospects: number;
    sites: number;
  };
  data: MapData;
}

// Unified Location type for the frontend view
export interface UnifiedLocation {
  id: string;
  type: 'Party' | 'Prospect' | 'Site';
  name:string;
  address: string;
  coords: { lat: number; lng: number };
}

// Helper to capitalize the first letter of a string
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/**
 * Maps a single ApiLocation to the frontend's UnifiedLocation format.
 * @param apiLocation - The location object from the API.
 * @returns A UnifiedLocation object.
 */
const mapApiToFrontend = (apiLocation: ApiLocation): UnifiedLocation => ({
  id: apiLocation._id,
  name: apiLocation.name,
  // The API type is lowercase ('party'), but the view uses capitalized ('Party')
  type: capitalize(apiLocation.type) as 'Party' | 'Prospect' | 'Site',
  address: apiLocation.address,
  coords: {
    lat: apiLocation.latitude,
    lng: apiLocation.longitude,
  },
});

/**
 * Fetches all map locations (parties, prospects, sites) from the new endpoint
 * and transforms them into a single, unified array for the map view.
 */
export const getMapLocations = async (): Promise<UnifiedLocation[]> => {
  try {
    const response = await api.get<MapApiResponse>('/map/locations');

    if (response.data.success) {
      const { parties, prospects, sites } = response.data.data;
      const allLocations = [
        ...parties,
        ...prospects,
        ...sites,
      ];
      return allLocations.map(mapApiToFrontend);
    } else {
      throw new Error('Failed to fetch map locations from the server.');
    }
  } catch (error) {
    console.error('Error fetching map locations:', error);
    throw error;
  }
};
