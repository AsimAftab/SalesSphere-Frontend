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
 * Calculates the average center of all locations.
 * Useful for setting the initial map center to focus on where the markers are.
 * @param locations - Array of locations with coordinates.
 * @returns The average center as { lat, lng }, or a default center if no valid locations.
 */
export const calculateAverageCenter = (
  locations: UnifiedLocation[]
): { lat: number; lng: number } => {
  if (locations.length === 0) {
    // Default to Kathmandu if no locations
    return { lat: 27.7172, lng: 85.324 };
  }

  // Filter out locations with invalid coordinates
  const validLocations = locations.filter(
    loc => loc.coords.lat != null && loc.coords.lng != null
  );

  if (validLocations.length === 0) {
    // Default to Kathmandu if no valid locations
    return { lat: 27.7172, lng: 85.324 };
  }

  // Calculate average latitude and longitude
  const sumLat = validLocations.reduce((sum, loc) => sum + loc.coords.lat, 0);
  const sumLng = validLocations.reduce((sum, loc) => sum + loc.coords.lng, 0);

  return {
    lat: sumLat / validLocations.length,
    lng: sumLng / validLocations.length,
  };
};

/**
 * Finds the cluster (area with most markers) and returns its center.
 * Uses a simple distance-based clustering approach.
 * @param locations - Array of locations with coordinates.
 * @param searchRadius - Radius in degrees to consider for clustering (~0.05 = ~5km).
 * @returns The center of the densest cluster.
 */
export const findDensestCluster = (
  locations: UnifiedLocation[],
  searchRadius: number = 0.05 // ~5km at equator
): { lat: number; lng: number } => {
  if (locations.length === 0) {
    return { lat: 27.7172, lng: 85.324 };
  }

  // Filter valid locations
  const validLocations = locations.filter(
    loc => loc.coords.lat != null && loc.coords.lng != null
  );

  if (validLocations.length === 0) {
    return { lat: 27.7172, lng: 85.324 };
  }

  if (validLocations.length === 1) {
    return validLocations[0].coords;
  }

  // For each location, count how many other locations are nearby
  let maxClusterSize = 0;
  let densestPoint = validLocations[0].coords;

  for (const location of validLocations) {
    const nearbyCount = validLocations.filter(
      other =>
        Math.abs(other.coords.lat - location.coords.lat) <= searchRadius &&
        Math.abs(other.coords.lng - location.coords.lng) <= searchRadius
    ).length;

    if (nearbyCount > maxClusterSize) {
      maxClusterSize = nearbyCount;
      densestPoint = location.coords;
    }
  }

  // Calculate the center of all points within the densest cluster
  const clusterPoints = validLocations.filter(
    loc =>
      Math.abs(loc.coords.lat - densestPoint.lat) <= searchRadius &&
      Math.abs(loc.coords.lng - densestPoint.lng) <= searchRadius
  );

  if (clusterPoints.length === 0) {
    return densestPoint;
  }

  const avgLat = clusterPoints.reduce((sum, loc) => sum + loc.coords.lat, 0) / clusterPoints.length;
  const avgLng = clusterPoints.reduce((sum, loc) => sum + loc.coords.lng, 0) / clusterPoints.length;

  console.log(`🎯 Densest cluster found with ${clusterPoints.length} markers at (${avgLat.toFixed(4)}, ${avgLng.toFixed(4)})`);

  return { lat: avgLat, lng: avgLng };
};

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
