/// <reference types="@types/google.maps" />

import { InfoWindow } from "@vis.gl/react-google-maps";
import { useEffect, useMemo, useRef, useState, type ElementType } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Clock, Route, MapPin,Target } from "lucide-react";
import { useQuery } from "@tanstack/react-query"; // --- KEPT ---
import Sidebar from "../../components/layout/Sidebar/Sidebar";
import { useSocket } from "../../context/SocketContext";
import {
  getEmployeeSessionData,
  type Location,
  type EmployeeSessionData,
  type SessionBreadcrumbs
} from "../../api/liveTrackingService";

import {
  getBeatPlanById,
  type BeatPlan,
} from "../../api/beatPlanService";

import {
  APIProvider,
  Map as GoogleMap,
  AdvancedMarker,
  Pin,
  useMap,
  type MapCameraChangedEvent,
} from "@vis.gl/react-google-maps";

import {
  calculateAverageCenter,
  type UnifiedLocation,
} from "../../api/mapService";


const colorConfig: Record<string, { background: string; glyphColor: string; borderColor: string }> = {
  Party: { background: "#4285F4", glyphColor: "#FFFFFF", borderColor: "#3578E5" },
  Prospect: { background: "#34A853", glyphColor: "#FFFFFF", borderColor: "#2C9C47" },
  Site: { background: "#fb7405", glyphColor: "#000000", borderColor: "#F2B000" },
  default: { background: "#EA4335", glyphColor: "#FFFFFF", borderColor: "#D93025" },
};

/* ----------------------------------------------------------
   Helpers
   ---------------------------------------------------------- */
// ... (toRadians and calculateHaversineDistance functions remain the same)
function toRadians(deg: number) {
  return deg * (Math.PI / 180);
}
function calculateHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

interface TimelineItem {
  time: string;
  title: string;
  subtitle?: string;
  icon: ElementType;
  color: string;
  isCurrent?: boolean;
}

/* Format breadcrumb -> timeline item */
// ... (formatBreadcrumb function remains the same)
const formatBreadcrumb = (loc: Location, nameMap: Map<string, string>, isCurrent = false): TimelineItem => {
  // Use formatted address as title if available, otherwise use location update
  const title = loc.address?.formattedAddress ||
                loc.address?.locality ||
                loc.address?.city ||
                "Location Update";

  // Show nearest directory as subtitle if available
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

/* Route Polyline */
// ... (RoutePolyline component remains the same)
const RoutePolyline = ({ path }: { path: google.maps.LatLngLiteral[] }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || path.length < 2) return;

    // Simple polyline - NO Directions API to save costs
    const poly = new google.maps.Polyline({
      path,
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 4,
      map,
    });

    return () => {
      poly.setMap(null);
    };
  }, [map, path]);

  return null;
};

/* Planned Routes */
// ... (PlannedRoutes component remains the same)
const PlannedRoutes = ({
  currentLocation,
  beatPlan,
  enabled
}: {
  currentLocation: Location | null;
  beatPlan: BeatPlan | null;
  enabled: boolean;
}) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !currentLocation || !beatPlan || !enabled) return;

    const directionsService = new google.maps.DirectionsService();
    const polylines: google.maps.Polyline[] = [];

    const origin = { lat: currentLocation.latitude, lng: currentLocation.longitude };

    // Collect all directory locations
    const destinations: Array<{ lat: number; lng: number; type: string; name: string }> = [];

    // Add parties
    beatPlan.parties.forEach(party => {
      if (party.location.latitude && party.location.longitude) {
        destinations.push({
          lat: party.location.latitude,
          lng: party.location.longitude,
          type: 'party',
          name: party.partyName,
        });
      }
    });

    // Add sites
    beatPlan.sites.forEach(site => {
      if (site.location.latitude && site.location.longitude) {
        destinations.push({
          lat: site.location.latitude,
          lng: site.location.longitude,
          type: 'site',
          name: site.siteName,
        });
      }
    });

    // Add prospects
    beatPlan.prospects.forEach(prospect => {
      if (prospect.location.latitude && prospect.location.longitude) {
        destinations.push({
          lat: prospect.location.latitude,
          lng: prospect.location.longitude,
          type: 'prospect',
          name: prospect.prospectName,
        });
      }
    });

    // COST OPTIMIZATION: Only show 3 nearest routes to minimize API calls
    const maxRoutes = 3;

    // Sort by distance to show nearest ones
    destinations.sort((a, b) => {
      const distA = Math.sqrt(Math.pow(a.lat - origin.lat, 2) + Math.pow(a.lng - origin.lng, 2));
      const distB = Math.sqrt(Math.pow(b.lat - origin.lat, 2) + Math.pow(b.lng - origin.lng, 2));
      return distA - distB;
    });

    console.log(`🗺️ Drawing ${maxRoutes} nearest routes (cost optimization)`);

    // Draw route to nearest destinations only
    destinations.slice(0, maxRoutes).forEach((dest, index) => {
      setTimeout(() => {
        const request: google.maps.DirectionsRequest = {
          origin,
          destination: { lat: dest.lat, lng: dest.lng },
          travelMode: google.maps.TravelMode.DRIVING,
        };

        directionsService.route(request, (result, status) => {
          if (status === 'OK' && result && result.routes[0]) {
            console.log(`✅ Route ${index + 1}/${maxRoutes} to ${dest.name}`);

            const route = result.routes[0];
            const path: google.maps.LatLng[] = [];

            route.legs.forEach(leg => {
              leg.steps.forEach(step => {
                path.push(step.start_location);
                if (step.path) {
                  step.path.forEach(point => path.push(point));
                }
              });
            });

            if (route.legs.length > 0) {
              path.push(route.legs[route.legs.length - 1].end_location);
            }

            const polyline = new google.maps.Polyline({
              path,
              strokeColor: '#4285F4',
              strokeOpacity: 0,
              strokeWeight: 3,
              icons: [{
                icon: {
                  path: 'M 0,-1 0,1',
                  strokeOpacity: 1,
                  strokeColor: '#4285F4',
                  scale: 3,
                },
                offset: '0',
                repeat: '20px',
              }],
              map,
            });

            polylines.push(polyline);
          } else {
            console.warn(`⚠️ Route ${index + 1} failed:`, status);
          }
        });
      }, index * 400); // 400ms delay
    });

    return () => {
      polylines.forEach(polyline => polyline.setMap(null));
    };
  }, [map, currentLocation, beatPlan, enabled]);

  return null;
};

/* ----------------------------------------------------------
   Main component
   ---------------------------------------------------------- */
const EmployeeTrackingDetailsPage = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { socket, isConnected } = useSocket();
  const mapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  // --- state & refs ---
  // --- CHANGED: Removed summary, beatPlan, isLoading, error states ---
  const [breadcrumbs, setBreadcrumbs] = useState<SessionBreadcrumbs | null>(null);
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [liveLocation, setLiveLocation] = useState<Location | null>(null);
  const [liveStatus, setLiveStatus] = useState<string>("");
  const [showPlannedRoutes, setShowPlannedRoutes] = useState(false);
  const [hasMoved, setHasMoved] = useState(false); // <-- ADD THIS

  // InfoWindow hover state
  const [hoveredMarker, setHoveredMarker] = useState<{
    lat: number;
    lng: number;
    name: string;
    type: string;
    address: string;
  } | null>(null);

  const hideTimerRef = useRef<number | null>(null);

  // --- CHANGED: Fetching with TanStack Query ---

  // Query 1: Fetch the core session data
  const {
    data: sessionData,
    isLoading: isSessionLoading,
    isError: isSessionError,
    error: sessionError,
  } = useQuery<EmployeeSessionData, Error>({
    queryKey: ['employeeSession', sessionId],
    queryFn: () => getEmployeeSessionData(sessionId!),
    enabled: !!sessionId, // Only run if sessionId is present
  });

  // Extract summary and beatPlanId for clarity
  const summary = sessionData?.summary;
  const beatPlanId = summary?.beatPlan._id;

  // Query 2: Fetch the beat plan, enabled only *after* beatPlanId is loaded
  const {
    data: beatPlan,
    isLoading: isBeatPlanLoading,
    isError: isBeatPlanError,
    error: beatPlanError,
  } = useQuery<BeatPlan, Error>({
    queryKey: ['beatPlan', beatPlanId],
    queryFn: () => getBeatPlanById(beatPlanId!),
    enabled: !!beatPlanId, // Only run if beatPlanId is present
  });

  // --- CHANGED: Combined loading and error states ---
  const isLoading = isSessionLoading || isBeatPlanLoading;
  const error = sessionError || beatPlanError;

  // --- Create location list and name map from the beat plan ---
  // 1. Create the unified list of locations from the beat plan
  const directoryLocations = useMemo(() => {
    if (!beatPlan) return [];

    const locations: UnifiedLocation[] = [];

    // Add parties
    beatPlan.parties.forEach(party => {
      if (party.location.latitude && party.location.longitude) {
        locations.push({
          id: party._id,
          type: 'Party',
          name: party.partyName,
          address: party.location.address || 'Address not available',
          coords: { lat: party.location.latitude, lng: party.location.longitude }
        });
      }
    });

    // Add sites
    beatPlan.sites.forEach(site => {
      if (site.location.latitude && site.location.longitude) {
        locations.push({
          id: site._id,
          type: 'Site',
          name: site.siteName,
          address: site.location.address || 'Address not available',
          coords: { lat: site.location.latitude, lng: site.location.longitude }
        });
      }
    });

    // Add prospects
    beatPlan.prospects.forEach(prospect => {
      if (prospect.location.latitude && prospect.location.longitude) {
        locations.push({
          id: prospect._id,
          type: 'Prospect',
          name: prospect.prospectName,
          address: prospect.location.address || 'Address not available',
          coords: { lat: prospect.location.latitude, lng: prospect.location.longitude }
        });
      }
    });

    return locations;
  }, [beatPlan]); // This list now updates ONLY when the beat plan is loaded

  // 2. Create the name map from our new list
  const directoryNameMap = useMemo(() => {
    return new Map<string, string>(directoryLocations.map((l) => [l.id, l.name]));
  }, [directoryLocations]);
  

  /* -------------------------------
     CHANGED: This useEffect now *only* syncs query data to state
     It no longer fetches data itself.
     ------------------------------- */
  useEffect(() => {
    if (sessionData) {
      setBreadcrumbs(sessionData.breadcrumbs);
      setLiveStatus(sessionData.summary.status);
      // set last known location as liveLocation so the map shows something initially
      if (sessionData.breadcrumbs?.breadcrumbs?.length) {
        setLiveLocation(sessionData.breadcrumbs.breadcrumbs[sessionData.breadcrumbs.breadcrumbs.length - 1]);
      }
    }
  }, [sessionData]); // This runs once when sessionData loads

  /* -------------------------------
     Build timeline when breadcrumbs or directoryNameMap updates.
     ------------------------------- */
  useEffect(() => {
    if (!breadcrumbs) {
      setTimeline([]);
      return;
    }
    const items = breadcrumbs.breadcrumbs.map((b) => formatBreadcrumb(b, directoryNameMap));
    if (items.length) items[items.length - 1].isCurrent = true;
    setTimeline(items.reverse());
  }, [breadcrumbs, directoryNameMap]); // CHANGED: Dependency

  /* -------------------------------
     WebSocket live updates
     ------------------------------- */
  useEffect(() => {
    // --- CHANGED: Uses summary from useQuery ---
    if (!socket || !isConnected || !summary) return;
    
    socket.emit("watch-beatplan", { beatPlanId: summary.beatPlan._id });

    const onLocationUpdate = (data: { location: Location; nearestDirectory?: Location["nearestDirectory"] }) => {
      const newLoc: Location = { ...data.location, nearestDirectory: data.nearestDirectory };
      setLiveLocation(newLoc);

      // prepend new item to timeline (mark previous as not current)
      setTimeline((prev) => {
        const prevClean = prev.map((p) => ({ ...p, isCurrent: false }));
        const newItem = formatBreadcrumb(newLoc, directoryNameMap, true);
        return [newItem, ...prevClean];
      });

      // append to breadcrumbs stored state so map polyline updates
      setBreadcrumbs((prev) =>
        prev ? { ...prev, breadcrumbs: [...prev.breadcrumbs, newLoc] } : { sessionId: sessionId! , breadcrumbs: [newLoc], totalPoints: 1 } as any
      );
    };

    socket.on("location-update", onLocationUpdate);

    return () => {
      socket.emit("unwatch-beatplan", { beatPlanId: summary.beatPlan._id });
      socket.off("location-update", onLocationUpdate);
    };
  }, [socket, isConnected, summary, directoryNameMap]); // --- CHANGED: Dependencies ---

  /* -------------------------------
     Map derived values
     ------------------------------- */
  // ... (mapLocations useMemo remains the same)
  const mapLocations = useMemo(() => {
    if (!breadcrumbs) return [];

    const allPoints = breadcrumbs.breadcrumbs.map((b) => ({
      ...b,
      lat: b.latitude,
      lng: b.longitude
    }));

    // Remove consecutive duplicates (same lat/lng)
    const filtered: typeof allPoints = [];
    for (let i = 0; i < allPoints.length; i++) {
      const current = allPoints[i];
      const previous = filtered[filtered.length - 1];

      // Add if it's the first point or coordinates changed
      if (!previous || current.lat !== previous.lat || current.lng !== previous.lng) {
        filtered.push(current);
      }
    }

    return filtered;
  }, [breadcrumbs]);
  
  // ... (visitedDirectoryIds useMemo remains the same)
  const visitedDirectoryIds = useMemo(() => {
    if (!breadcrumbs) return new Set<string>();

    const ids = new Set<string>();
    breadcrumbs.breadcrumbs.forEach(b => {
      if (b.nearestDirectory?.directoryId) {
        ids.add(b.nearestDirectory.directoryId);
      }
    });
    return ids;
  }, [breadcrumbs]);
  
  // ... (plannedRoute useMemo remains the same)
  const plannedRoute = useMemo(() => {
    if (!beatPlan) return [];

    const coordinates: google.maps.LatLngLiteral[] = [];

    // Add all parties
    beatPlan.parties.forEach(party => {
      if (party.location.latitude && party.location.longitude) {
        coordinates.push({
          lat: party.location.latitude,
          lng: party.location.longitude
        });
      }
    });

    // Add all sites
    beatPlan.sites.forEach(site => {
      if (site.location.latitude && site.location.longitude) {
        coordinates.push({
          lat: site.location.latitude,
          lng: site.location.longitude
        });
      }
    });

    // Add all prospects
    beatPlan.prospects.forEach(prospect => {
      if (prospect.location.latitude && prospect.location.longitude) {
        coordinates.push({
          lat: prospect.location.latitude,
          lng: prospect.location.longitude
        });
      }
    });

    return coordinates;
  }, [beatPlan]);
  
  // ... (liveDistance useMemo remains the same)
  const liveDistance = useMemo(() => {
    if (!breadcrumbs || breadcrumbs.breadcrumbs.length < 2) return 0;
    let sum = 0;
    for (let i = 1; i < breadcrumbs.breadcrumbs.length; i++) {
      const a = breadcrumbs.breadcrumbs[i - 1];
      const b = breadcrumbs.breadcrumbs[i];
      sum += calculateHaversineDistance(a.latitude, a.longitude, b.latitude, b.longitude);
    }
    return sum;
  }, [breadcrumbs]);
  
  // ... (mapCenter useMemo remains the same)
  const mapCenter = useMemo(() => {
    // If we have planned route, center on all planned locations for better overview
    if (plannedRoute.length > 0) {
      const unified: UnifiedLocation[] = plannedRoute.map((coord, idx) => ({
        id: `planned-${idx}`,
        type: "Party",
        name: "Point",
        address: "",
        coords: coord,
      }));
      return calculateAverageCenter(unified);
    }

    // Fallback to breadcrumbs if no planned route
    if (breadcrumbs && breadcrumbs.breadcrumbs.length > 0) {
      const unified: UnifiedLocation[] = breadcrumbs.breadcrumbs.map((loc) => ({
        id: loc._id,
        type: "Party",
        name: "Point",
        address: "",
        coords: { lat: loc.latitude, lng: loc.longitude },
      }));
      return calculateAverageCenter(unified);
    }

    // Default fallback
    return { lat: 27.7172, lng: 85.324 };
  }, [plannedRoute, breadcrumbs]);

  // Controlled map state for proper dragging/panning
  const [currentCenter, setCurrentCenter] = useState(mapCenter);
  const [currentZoom, setCurrentZoom] = useState(14);

  // Update center when mapCenter changes
  useEffect(() => {
    setCurrentCenter(mapCenter);
  }, [mapCenter]);

  // Handle camera changes (zoom, pan, etc.)
const handleCameraChange = (e: MapCameraChangedEvent) => {
  setCurrentCenter(e.detail.center);
  setCurrentZoom(e.detail.zoom);

  // Check if map has moved from the original calculated center
  const threshold = 0.001; // Small threshold for float comparison
  const initialZoom = 14;  // Your default zoom
  
  // mapCenter comes from your useMemo hook
  const latDiff = Math.abs(e.detail.center.lat - mapCenter.lat);
  const lngDiff = Math.abs(e.detail.center.lng - mapCenter.lng);
  const zoomDiff = Math.abs(e.detail.zoom - initialZoom);

  // If center or zoom has changed, mark as moved
  if (latDiff > threshold || lngDiff > threshold || zoomDiff > 0.5) {
    setHasMoved(true);
  } else {
    setHasMoved(false);
  }
};

// Recenter map to the initial calculated center
const handleRecenter = () => {
  setCurrentCenter(mapCenter); // mapCenter is from your useMemo
  setCurrentZoom(14);         // Set back to initial zoom
  setHasMoved(false);
};

  /* -------------------------------
     InfoWindow hover helpers
     ------------------------------- */
  // ... (showInfoFor and hideInfoDelayed functions remain the same)
  const showInfoFor = (lat: number, lng: number, meta: { name: string; type: string; address: string } | undefined) => {
    if (!meta) return;
    if (hideTimerRef.current) {
      window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
    setHoveredMarker({ lat, lng, name: meta.name, type: meta.type, address: meta.address });
  };

  const hideInfoDelayed = (delay = 180) => {
    if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);
    hideTimerRef.current = window.setTimeout(() => {
      setHoveredMarker(null);
      hideTimerRef.current = null;
    }, delay);
  };

  /* -------------------------------
     Loading / errors render
     ------------------------------- */
  // --- CHANGED: Updated loading/error logic ---
  if (isLoading) return <Sidebar><p>Loading session details...</p></Sidebar>;
  if (isSessionError || isBeatPlanError) return <Sidebar><p className="text-red-500">{error?.message || "Failed to load session details."}</p></Sidebar>;
  if (!summary) return <Sidebar><p>No session data found.</p></Sidebar>; // summary comes from query now

  const currentStatus = liveStatus || summary.status;

  /* -------------------------------
     Render
     ------------------------------- */
  return (
    // The entire <Sidebar> ... </Sidebar> JSX remains unchanged
    // It correctly uses `summary` and `beatPlan` which are now provided
    // by the `useQuery` hooks at the top.
    <Sidebar>
       <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">

         {/* Header */}
         <header className="bg-white shadow-sm z-10 px-4 flex-shrink-0">
           <div className="flex items-center h-16">
             <Link to="/live-tracking" className="mr-4 text-gray-500 hover:text-gray-700">
               <ArrowLeft size={20} />
             </Link>

             <span className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold mr-3">
               {summary.user.name.substring(0, 2).toUpperCase()}
             </span>

             <div>
               <h1 className="text-lg font-bold">{summary.user.name}</h1>
               <p className={`text-xs font-semibold ${currentStatus === "active" ? "text-green-500" : "text-yellow-500"}`}>
                 {currentStatus}
               </p>
             </div>
           </div>
         </header>

         {/* Main - Fixed height, no scroll */}
         {/* --- THIS IS THE GRID LAYOUT FIX --- */}
         <main className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_20rem] gap-4 p-4 min-h-0 overflow-y-auto lg:overflow-hidden">

          {/* Map - Fixed to viewport */}
          {/* --- THIS IS THE GRID LAYOUT FIX --- */}
          <div className="h-[50vh] lg:h-auto rounded-lg border overflow-hidden bg-gray-100 relative min-h-0 min-w-0">
             <APIProvider apiKey={mapsApiKey!}>
               <GoogleMap
                 center={currentCenter}
                 zoom={currentZoom}
                 onCameraChanged={handleCameraChange}
                 mapId={'YOUR_MAP_ID'}
                 gestureHandling={'greedy'}
                 disableDefaultUI={false}
                 zoomControl={true}
                 scrollwheel={true}
                 keyboardShortcuts={false}
                 mapTypeControl={false}
                 streetViewControl={false}
                 fullscreenControl={false}
                 style={{ width: '100%', height: '100%' }}
               >
                 {/* Directory markers (from beat plan) */}
                 {directoryLocations.map((directory) => {
                   const rawType = directory.type ?? "default";
                   const capType = rawType.charAt(0).toUpperCase() + rawType.slice(1).toLowerCase();
                   const colors = colorConfig[capType] || colorConfig.default;
                   const meta = { name: directory.name, type: capType, address: directory.address ?? "" };

                   // Highlight visited directories with larger scale
                   const isVisited = visitedDirectoryIds.has(directory.id);
                   const scale = isVisited ? 1.2 : 0.8;

                   return (
                     <AdvancedMarker
                       key={`dir-${directory.id}`}
                       position={directory.coords}
                       onMouseEnter={() => showInfoFor(directory.coords.lat, directory.coords.lng, meta)}
                       onMouseLeave={() => hideInfoDelayed(200)}
                     >
                       <Pin
                         background={colors.background}
                         glyphColor={colors.glyphColor}
                         borderColor={colors.borderColor}
                         scale={scale}
                       />
                     </AdvancedMarker>
                   );
                 })}

                 {/* Route polyline snapped to roads using Directions API */}
                 {mapLocations.length > 1 && <RoutePolyline path={mapLocations} />}

                 {/* Planned routes from current location to all directories */}
                 <PlannedRoutes currentLocation={liveLocation} beatPlan={beatPlan || null} enabled={showPlannedRoutes} />

                 {/* live marker */}
                 {liveLocation && (
                   <AdvancedMarker position={{ lat: liveLocation.latitude, lng: liveLocation.longitude }} zIndex={999}>
                     <div className="relative flex items-center justify-center">
                       <div className="absolute w-10 h-10 bg-red-500 opacity-40 rounded-full animate-ping"></div>
                       <div className="absolute w-6 h-6 bg-red-600 opacity-60 rounded-full"></div>
                       <div className="relative w-4 h-4 bg-red-700 rounded-full border-2 border-white shadow-lg"></div>
                     </div>
                   </AdvancedMarker>
                 )}

                 {/* InfoWindow rendered when hoveredMarker exists (styled) */}
                 {hoveredMarker && (
                   <InfoWindow
                     position={{ lat: hoveredMarker.lat, lng: hoveredMarker.lng }}
                     onCloseClick={() => setHoveredMarker(null)}
                     shouldFocus={false}
                     disableAutoPan
                   >
                     {/* The div inside InfoWindow captures mouse enter/leave to stop blinking */}
                     <div
                       className="max-w-xs text-sm text-gray-800 p-2"
                       onMouseEnter={() => {
                         if (hideTimerRef.current) {
                           window.clearTimeout(hideTimerRef.current);
                           hideTimerRef.current = null;
                         }
                       }}
                       onMouseLeave={() => hideInfoDelayed(120)}
                     >
                       <p className="font-bold">{hoveredMarker.name}</p>
                       <p className="text-xs text-blue-600">Type: {hoveredMarker.type}</p>
                       <p className="text-xs text-gray-600">{hoveredMarker.address}</p>
                     </div>
                   </InfoWindow>
                 )}
               </GoogleMap>
             </APIProvider>
             {hasMoved && (
              <button
                type="button"
                onClick={handleRecenter}
                className="absolute top-4 right-4 bg-white hover:bg-gray-50 text-gray-700 font-medium px-4 py-2 rounded-lg shadow-lg border border-gray-200 flex items-center gap-2 transition-all duration-200 hover:shadow-xl z-10"
                title="Recenter map"
              >
                <Target size={18} />
                <span className="hidden sm:inline">Recenter</span>
              </button>
            )}
           </div>

           {/* Right sidebar - Fixed height, no overflow */}
           {/* --- THIS IS THE GRID LAYOUT FIX --- */}
           <aside className="flex flex-col gap-3 lg:min-h-0">
             {/* Map Legend */}
             <div className="bg-white p-3 rounded-lg shadow flex-shrink-0">
               <h3 className="text-sm font-semibold text-gray-500 mb-2">Map Legend</h3>
               <div className="space-y-1.5">
                 <div className="flex items-center gap-2">
                   <div className="w-3 h-4 bg-blue-500 rounded-t-full" style={{ borderRadius: '50% 50% 50% 0' }}></div>
                   <span className="text-xs text-gray-600">Party</span>
                 </div>
                 <div className="flex items-center gap-2">
                   <div className="w-3 h-4 bg-green-500 rounded-t-full" style={{ borderRadius: '50% 50% 50% 0' }}></div>
                   <span className="text-xs text-gray-600">Prospect</span>
                 </div>
                 <div className="flex items-center gap-2">
                   <div className="w-3 h-4 bg-orange-500 rounded-t-full" style={{ borderRadius: '50% 50% 50% 0' }}></div>
                   <span className="text-xs text-gray-600">Site</span>
                 </div>
                 <div className="flex items-center gap-2">
                   <div className="h-1 w-6 bg-red-500"></div>
                   <span className="text-xs text-gray-600">Traveled Route</span>
                 </div>
                 <div className="flex items-center gap-2">
                   <div className="h-0.5 w-6 bg-blue-500" style={{ backgroundImage: 'repeating-linear-gradient(to right, #4285F4 0, #4285F4 8px, transparent 8px, transparent 16px)' }}></div>
                   <span className="text-xs text-gray-600">To Destinations</span>
                 </div>
                 <div className="flex items-center gap-2">
                   <div className="relative w-3 h-3">
                     <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                   </div>
                   <span className="text-xs text-gray-600">Live Position</span>
                 </div>
               </div>
             </div>

             <div className="bg-white p-4 rounded-lg shadow flex-shrink-0">
               <h3 className="text-sm font-semibold text-gray-500 mb-3">Quick Stats</h3>

               <div className="grid gap-3">
                 <div className="flex items-center">
                   <Clock className="text-blue-500 mr-2" size={16} />
                   <div>
                     <span className="text-xs text-gray-500">Check In</span>
                     <p className="text-sm font-bold">{new Date(summary.sessionStartedAt).toLocaleTimeString()}</p>
                   </div>
                 </div>

                 <div className="flex items-center">
                   <Route className="text-blue-500 mr-2" size={16} />
                   <div>
                     <span className="text-xs text-gray-500">Distance</span>
                     <p className="text-sm font-bold">{liveDistance.toFixed(2)} km</p>
                   </div>
                 </div>

                 <div className="flex items-center">
                   <MapPin className="text-blue-500 mr-2" size={16} />
                   <div>
                     <span className="text-xs text-gray-500">Updates</span>
                     <p className="text-sm font-bold">{breadcrumbs?.totalPoints || breadcrumbs?.breadcrumbs.length || 0}</p>
                   </div>
                 </div>

                 {beatPlan && (
                   <div className="flex items-center">
                     <Route className="text-green-500 mr-2" size={16} />
                     <div>
                       <span className="text-xs text-gray-500">Planned</span>
                       <p className="text-sm font-bold">
                         {beatPlan.parties.length + beatPlan.sites.length + beatPlan.prospects.length} stops
                       </p>
                     </div>
                   </div>
                 )}
               </div>

               {beatPlan && (
                 <button
                   onClick={() => setShowPlannedRoutes(!showPlannedRoutes)}
                   className={`mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                     showPlannedRoutes
                       ? 'bg-blue-500 text-white hover:bg-blue-600'
                       : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                   }`}
                 >
                   <Route size={16} />
                   {showPlannedRoutes ? 'Hide Routes to 3 Nearest' : 'Show Routes to 3 Nearest'}
                 </button>
               )}
             </div>

             {/* Route History - ONLY THIS SCROLLS */}
             <div className="bg-white rounded-lg shadow lg:flex-1 lg:min-h-0 flex flex-col">
               <h3 className="text-sm font-semibold text-gray-500 p-4 pb-2">Route History</h3>
               <div className="lg:flex-1 lg:overflow-y-auto px-4 pb-4">
                 <div className="relative pl-6">
                   <div className="absolute left-3 top-1 bottom-1 w-0.5 bg-gray-200"></div>

                   {timeline.map((item, idx) => (
                     <div key={idx} className="relative pb-5 last:pb-0">
                       <div className="absolute top-1 -left-1.5 w-4 h-4 bg-white border-4 border-gray-200 rounded-full">
                         <item.icon size={14} className={`absolute -top-1.5 -left-1.5 ${item.color}`} />
                       </div>

                       {item.isCurrent && <div className="absolute top-1 -left-1.5 w-4 h-4 bg-red-100 border-4 border-red-200 rounded-full animate-pulse"></div>}

                       <div className="pl-6">
                         <p className="text-xs text-gray-400">{item.time}</p>
                         <p className={`text-sm font-medium ${item.isCurrent ? "text-red-600" : "text-gray-700"}`}>{item.title}</p>
                         {item.subtitle && <p className="text-xs text-gray-500 mt-0.5">{item.subtitle}</p>}
                         {item.isCurrent && <span className="text-xs font-bold text-red-600">Live</span>}
                       </div>
                     </div>
                   ))}

                   {timeline.length === 0 && <p className="text-sm text-gray-500">No history yet...</p>}
                 </div>
               </div>
             </div>
           </aside>
         </main>
       </div>
     </Sidebar>
  );
};

export default EmployeeTrackingDetailsPage;