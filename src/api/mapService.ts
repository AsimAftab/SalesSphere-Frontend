import api from './api';
import { API_ENDPOINTS } from './endpoints';

export interface ApiLocation {
  _id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  type: 'party' | 'prospect' | 'site';
}

interface MapData {
  parties: ApiLocation[];
  prospects: ApiLocation[];
  sites: ApiLocation[];
}

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

export interface UnifiedLocation {
  id: string;
  type: 'Party' | 'Prospect' | 'Site';
  name:string;
  address: string;
  coords: { lat: number; lng: number };
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);


export const calculateAverageCenter = (
  locations: UnifiedLocation[]
): { lat: number; lng: number } => {
  if (locations.length === 0) {
    
    return { lat: 27.7172, lng: 85.324 };
  }

  const validLocations = locations.filter(
    loc => loc.coords.lat != null && loc.coords.lng != null
  );

  if (validLocations.length === 0) {
   
    return { lat: 27.7172, lng: 85.324 };
  }

  const sumLat = validLocations.reduce((sum, loc) => sum + loc.coords.lat, 0);
  const sumLng = validLocations.reduce((sum, loc) => sum + loc.coords.lng, 0);

  return {
    lat: sumLat / validLocations.length,
    lng: sumLng / validLocations.length,
  };
};

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

  return { lat: avgLat, lng: avgLng };
};

const mapApiToFrontend = (apiLocation: ApiLocation): UnifiedLocation => ({
  id: apiLocation._id,
  name: apiLocation.name,
  type: capitalize(apiLocation.type) as 'Party' | 'Prospect' | 'Site',
  address: apiLocation.address,
  coords: {
    lat: apiLocation.latitude,
    lng: apiLocation.longitude,
  },
});

export const getMapLocations = async (): Promise<UnifiedLocation[]> => {
  const response = await api.get<MapApiResponse>(API_ENDPOINTS.map.LOCATIONS);

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
};
