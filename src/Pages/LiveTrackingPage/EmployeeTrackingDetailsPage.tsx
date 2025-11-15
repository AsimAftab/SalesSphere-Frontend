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
  APIProvider,
  Map as GoogleMap,
  AdvancedMarker,
  Pin,
  useMap,
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
  icon: ElementType;
  color: string;
  isCurrent?: boolean;
}

/* Format breadcrumb -> timeline item */
const formatBreadcrumb = (loc: Location, nameMap: Map<string, string>, isCurrent = false): TimelineItem => {
  let title = "Location Update";
  if (loc.nearestDirectory) {
    title = nameMap.get(loc.nearestDirectory.directoryId) ?? loc.nearestDirectory.name ?? `Near ${loc.nearestDirectory.directoryType ?? "Location"}`;
  }
  return {
    time: new Date(loc.timestamp).toLocaleTimeString(),
    title,
    icon: MapPin,
    color: isCurrent ? "text-red-500" : "text-blue-500",
    isCurrent,
  };
};

/* Polyline component — draws route using plain Google Maps polyline */
const RoutePolyline = ({ path }: { path: google.maps.LatLngLiteral[] }) => {
  const map = useMap();
  useEffect(() => {
    if (!map) return;
    const poly = new google.maps.Polyline({
      path,
      strokeColor: "#FF0000",
      strokeOpacity: 0.9,
      strokeWeight: 4,
    });
    poly.setMap(map);
    return () => poly.setMap(null);
  }, [map, path]);
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
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [liveLocation, setLiveLocation] = useState<Location | null>(null);
  const [liveStatus, setLiveStatus] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
  const directoryMetaMap = new Map<string, { name: string; type: string; address: string }>(
    allLocations.map((l) => [l.id, { name: l.name, type: l.type ?? "Unknown", address: l.address ?? "" }])
  );

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
  const mapLocations = useMemo(() => {
    if (!breadcrumbs) return [];
    return breadcrumbs.breadcrumbs.map((b) => ({ ...b, lat: b.latitude, lng: b.longitude }));
  }, [breadcrumbs]);

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
    if (!breadcrumbs || breadcrumbs.breadcrumbs.length === 0) return { lat: 27.7172, lng: 85.324 };
    const unified: UnifiedLocation[] = breadcrumbs.breadcrumbs.map((loc) => ({
      id: loc._id,
      type: "Party",
      name: "Point",
      address: "",
      coords: { lat: loc.latitude, lng: loc.longitude },
    }));
    return calculateAverageCenter(unified);
  }, [breadcrumbs]);

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
      <div className="flex flex-col h-full bg-gray-50">

        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-10 px-4">
          <div className="flex items-center h-16">
            <Link to="/live-tracking" className="mr-4 text-gray-500">
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

        {/* Main */}
        <main className="flex-1 flex gap-4 p-3 overflow-hidden flex-col lg:flex-row">

          {/* Map */}
          <div className="flex-1 rounded-lg border overflow-hidden">
            <APIProvider apiKey={mapsApiKey!}>
              <GoogleMap
                center={mapCenter}
                defaultZoom={17}
                mapId={'YOUR_MAP_ID'}
                gestureHandling="greedy"
                disableDefaultUI={false}
                zoomControl
                className="w-full h-full"
              >
                {/* history markers */}
                {mapLocations.map((loc, idx) => {
                  const meta = directoryMetaMap.get(loc.nearestDirectory?.directoryId ?? "");
                  const rawType = loc.nearestDirectory?.directoryType ?? "default";
                  const capType = rawType.charAt(0).toUpperCase() + rawType.slice(1).toLowerCase();
                  const colors = colorConfig[capType] || colorConfig.default;

                  return (
                    <AdvancedMarker
                      key={`hist-${idx}`}
                      position={loc}
                      onMouseEnter={() => showInfoFor(loc.lat, loc.lng, meta)}
                      onMouseLeave={() => hideInfoDelayed(200)}
                    >
                      <Pin
                        background={colors.background}
                        glyphColor={colors.glyphColor}
                        borderColor={colors.borderColor}
                        scale={0.75}
                      />
                    </AdvancedMarker>
                  );
                })}

                {/* route polyline */}
                <RoutePolyline path={mapLocations} />

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

          {/* Right sidebar */}
          <aside className="w-full lg:w-80 flex flex-col gap-6 overflow-y-auto">
            <div className="bg-white p-5 rounded-lg shadow">
              <h3 className="text-sm font-semibold text-gray-500 mb-4">Quick Stats</h3>

              <div className="grid gap-4">
                <div className="flex items-center">
                  <Clock className="text-blue-500 mr-3" size={18} />
                  <div>
                    <span className="text-xs">Check In Time</span>
                    <p className="font-bold">{new Date(summary.sessionStartedAt).toLocaleTimeString()}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Route className="text-blue-500 mr-3" size={18} />
                  <div>
                    <span className="text-xs">Distance Traveled</span>
                    <p className="font-bold">{liveDistance.toFixed(2)} km</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <MapPin className="text-blue-500 mr-3" size={18} />
                  <div>
                    <span className="text-xs">Locations Recorded</span>
                    <p className="font-bold">{breadcrumbs?.totalPoints || breadcrumbs?.breadcrumbs.length || 0} updates</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-lg shadow flex-1">
              <h3 className="text-sm font-semibold text-gray-500 mb-4">Route History (Live)</h3>
              <div className="relative pl-6">
                <div className="absolute left-3 top-1 bottom-1 w-0.5 bg-gray-200"></div>

                {timeline.map((item, idx) => (
                  <div key={idx} className="relative pb-6 last:pb-0">
                    <div className="absolute top-1 -left-1.5 w-4 h-4 bg-white border-4 border-gray-200 rounded-full">
                      <item.icon size={16} className={`absolute -top-2 -left-2 ${item.color}`} />
                    </div>

                    {item.isCurrent && <div className="absolute top-1 -left-1.5 w-4 h-4 bg-red-100 border-4 border-red-200 rounded-full animate-pulse"></div>}

                    <div className="pl-6">
                      <p className="text-xs text-gray-400">{item.time}</p>
                      <p className={`text-sm font-medium ${item.isCurrent ? "text-red-600" : "text-gray-700"}`}>{item.title}</p>
                      {item.isCurrent && <span className="text-xs font-bold text-red-600">Current Location</span>}
                    </div>
                  </div>
                ))}

                {timeline.length === 0 && <p className="text-sm text-gray-500">No route history yet...</p>}
              </div>
            </div>
          </aside>
        </main>
      </div>
    </Sidebar>
  );
};

export default EmployeeTrackingDetailsPage;
