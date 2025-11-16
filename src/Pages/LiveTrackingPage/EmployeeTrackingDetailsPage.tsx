/// <reference types="@types/google.maps" />

import { InfoWindow } from "@vis.gl/react-google-maps";
import { useEffect, useMemo, useRef, useState, type ElementType } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Clock, Route, MapPin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "../../components/layout/Sidebar/Sidebar";
import { useSocket } from "../../context/SocketContext";

import {
  getEmployeeSessionData,
  type SessionSummary,
  type SessionBreadcrumbs,
  type Location,
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
  getMapLocations,
  type UnifiedLocation,
} from "../../api/mapService";

/* ----------------------------------------------------------
   Colors for Party / Prospect / Site
   ---------------------------------------------------------- */
const colorConfig: Record<string, { background: string; glyphColor: string; borderColor: string }> = {
  Party: { background: "#4285F4", glyphColor: "#FFFFFF", borderColor: "#3578E5" },
  Prospect: { background: "#34A853", glyphColor: "#FFFFFF", borderColor: "#2C9C47" },
  Site: { background: "#fb7405", glyphColor: "#000000", borderColor: "#F2B000" },
  default: { background: "#EA4335", glyphColor: "#FFFFFF", borderColor: "#D93025" },
};

/* ----------------------------------------------------------
   Helpers
   ---------------------------------------------------------- */
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

/* Route Polyline - Simple polyline (NO API calls to save costs) */
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

/* Planned Routes - OPTIONAL (only when enabled to save API costs) */
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

  // --- state & refs
  const [summary, setSummary] = useState<SessionSummary | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<SessionBreadcrumbs | null>(null);
  const [beatPlan, setBeatPlan] = useState<BeatPlan | null>(null);
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [liveLocation, setLiveLocation] = useState<Location | null>(null);
  const [liveStatus, setLiveStatus] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPlannedRoutes, setShowPlannedRoutes] = useState(false);

  // InfoWindow hover state
  const [hoveredMarker, setHoveredMarker] = useState<{
    lat: number;
    lng: number;
    name: string;
    type: string;
    address: string;
  } | null>(null);

  const hideTimerRef = useRef<number | null>(null);

  // --- Fetch directory master once via react-query (cache, deduped)
  const { data: allLocations = [] } = useQuery<UnifiedLocation[]>({
    queryKey: ["territoryLocations"],
    queryFn: getMapLocations,
  });

  // quick name lookup map used to render timeline titles (no re-fetch)
  const directoryNameMap = new Map<string, string>(allLocations.map((l) => [l.id, l.name]));
  // metadata map for type/address
  

  /* -------------------------------
     Fetch session data ONCE (only depends on sessionId).
     Important: we intentionally DO NOT depend on allLocations here,
     so we don't repeatedly re-fetch when the directory list loads.
     Instead we compute the timeline separately below when both
     breadcrumbs and the name map are available.
     ------------------------------- */
  useEffect(() => {
    if (!sessionId) return;

    let mounted = true;
    const load = async () => {
      try {
        setIsLoading(true);
        const result = await getEmployeeSessionData(sessionId);
        if (!mounted) return;
        setSummary(result.summary);
        setBreadcrumbs(result.breadcrumbs);
        setLiveStatus(result.summary.status);
        // set last known location as liveLocation so the map shows something initially
        if (result.breadcrumbs?.breadcrumbs?.length) {
          setLiveLocation(result.breadcrumbs.breadcrumbs[result.breadcrumbs.breadcrumbs.length - 1]);
        }

        // Fetch beat plan to show planned route
        try {
          const plan = await getBeatPlanById(result.summary.beatPlan._id);
          if (mounted) setBeatPlan(plan);
        } catch (beatPlanErr) {
          console.error("Failed to load beat plan", beatPlanErr);
          // Not critical - just won't show planned route
        }
      } catch (err) {
        console.error("Failed to load session data", err);
        setError("Failed to load session details.");
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [sessionId]);

  /* -------------------------------
     Build timeline when breadcrumbs or directoryNameMap updates.
     This prevents re-fetch loops and also ensures timeline can show
     names as soon as directory list is available.
     ------------------------------- */
  useEffect(() => {
    if (!breadcrumbs) {
      setTimeline([]);
      return;
    }
    const items = breadcrumbs.breadcrumbs.map((b) => formatBreadcrumb(b, directoryNameMap));
    if (items.length) items[items.length - 1].isCurrent = true;
    setTimeline(items.reverse());
  }, [breadcrumbs, allLocations /* re-run when names available */]);

  /* -------------------------------
     WebSocket live updates
     - emit watch-beatplan once when summary available
     - update live location and timeline when location-update arrives
     ------------------------------- */
  useEffect(() => {
    if (!socket || !isConnected || !summary) return;
    const beatPlanId = summary.beatPlan._id;
    socket.emit("watch-beatplan", { beatPlanId });

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
        prev ? { ...prev, breadcrumbs: [...prev.breadcrumbs, newLoc] } : { sessionId: sessionId , breadcrumbs: [newLoc], totalPoints: 1 } as any
      );
    };

    socket.on("location-update", onLocationUpdate);

    return () => {
      socket.emit("unwatch-beatplan", { beatPlanId });
      socket.off("location-update", onLocationUpdate);
    };
  }, [socket, isConnected, summary, allLocations]);

  /* -------------------------------
     Map derived values
     ------------------------------- */
  // Breadcrumb GPS points for polyline (employee's route)
  // Filter out consecutive duplicate coordinates to avoid overlapping lines when stationary
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

  // Get set of visited directory IDs to highlight them differently
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

  // Planned route coordinates from beat plan (all directories to visit)
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
  };

  /* -------------------------------
     InfoWindow hover helpers
     - show: clear hide timer and set hoveredMarker
     - hide: starts short timer so accidental mouseout doesn't close immediately
     - InfoWindow content has mouseEnter / mouseLeave to clear/set timer too,
       preventing blinking while user moves between marker and InfoWindow.
     ------------------------------- */
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
  if (isLoading) return <Sidebar><p>Loading session details...</p></Sidebar>;
  if (error) return <Sidebar><p className="text-red-500">{error}</p></Sidebar>;
  if (!summary) return <Sidebar><p>No session data found.</p></Sidebar>;

  const currentStatus = liveStatus || summary.status;

  /* -------------------------------
     Render
     ------------------------------- */
  return (
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
        <main className="flex-1 flex gap-4 p-4 min-h-0 overflow-hidden">

          {/* Map - Fixed to viewport */}
          <div className="flex-1 rounded-lg border overflow-hidden bg-gray-100 relative">
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
                {/* Directory markers (ALL parties/prospects/sites) */}
                {allLocations.map((directory) => {
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
                <PlannedRoutes currentLocation={liveLocation} beatPlan={beatPlan} enabled={showPlannedRoutes} />

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
          </div>

          {/* Right sidebar - Fixed height, no overflow */}
          <aside className="w-80 flex flex-col gap-3 min-h-0 flex-shrink-0">
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
            <div className="bg-white rounded-lg shadow flex-1 min-h-0 flex flex-col">
              <h3 className="text-sm font-semibold text-gray-500 p-4 pb-2">Route History</h3>
              <div className="flex-1 overflow-y-auto px-4 pb-4">
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
