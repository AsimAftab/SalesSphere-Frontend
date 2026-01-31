import { useParams } from "react-router-dom";
import Sidebar from "../../../../../components/layout/Sidebar/Sidebar";
import { useSessionDetails } from "./hooks/useSessionDetails";
import type { Location } from "../../../../../api/liveTrackingService";
import SessionHeader from "./components/SessionHeader";
import SessionMap from "./components/SessionMap";
import SessionTimeline from "./components/SessionTimeline";
import MapLegend from "./components/MapLegend";
import SessionStats from "./components/SessionStats";
import { useState, useMemo } from "react";
import { calculateHaversineDistance } from "./utils/sessionUtils";
import SessionDetailsSkeleton from "./components/SessionDetailsSkeleton";

const EmployeeTrackingDetailsPage = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const mapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  // Use custom hook for logic
  const { sessionData, uiState } = useSessionDetails(sessionId);

  // Local UI state for planned routes
  const [showPlannedRoutes, setShowPlannedRoutes] = useState(false);

  // Prepare prop for breadcrumbs coords (clean object for map)
  const breadcrumbCoords = useMemo(() => {
    if (!sessionData.breadcrumbs?.breadcrumbs) return [];

    // 1. Sort
    const sorted = [...sessionData.breadcrumbs.breadcrumbs]
      .sort((a: Location, b: Location) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    if (sorted.length === 0) return [];

    // 2. Filter Noise
    const filtered = [sorted[0]];
    let lastPoint = sorted[0];

    for (let i = 1; i < sorted.length; i++) {
      const point = sorted[i];
      const dist = calculateHaversineDistance(
        lastPoint.latitude, lastPoint.longitude,
        point.latitude, point.longitude
      );
      // Threshold: 0.015 km (15 meters) OR keep last point
      if (dist > 0.015 || i === sorted.length - 1) {
        filtered.push(point);
        lastPoint = point;
      }
    }

    return filtered.map((b: Location) => ({ lat: b.latitude, lng: b.longitude }));
  }, [sessionData.breadcrumbs]);

  // --- Loading / Error States ---
  if (uiState.isLoading) return <SessionDetailsSkeleton />;
  if (uiState.error) return <Sidebar><p className="text-red-500">{uiState.error?.message || "Failed to load session details."}</p></Sidebar>;
  if (!sessionData.summary) return <Sidebar><p>No session data found.</p></Sidebar>;

  const currentStatus = sessionData.liveStatus || sessionData.summary.status;
  return (
    <Sidebar>
      {/* Subtract header (4rem) + main padding (5rem) + buffer => ~10rem */}
      <div className="flex flex-col h-[calc(100vh-10rem)] bg-gray-50 overflow-hidden">
        {/* Header */}
        <div className="flex-shrink-0">
          <SessionHeader
            user={sessionData.summary.user}
            status={currentStatus}
          />
        </div>

        {/* Main Content */}
        <main className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_20rem] gap-4 p-4 min-h-0 overflow-hidden">

          {/* Left: Map */}
          <div className="bg-white rounded-lg shadow overflow-hidden relative flex flex-col min-h-0">
            <SessionMap
              mapsApiKey={mapsApiKey!}
              center={sessionData.mapCenter}
              liveLocation={sessionData.liveLocation}
              liveStatus={currentStatus}
              directoryLocations={sessionData.directoryLocations}
              visitedDirectoryIds={sessionData.visitedDirectoryIds}
              breadcrumbs={breadcrumbCoords}
              beatPlan={sessionData.beatPlan || null}
              showPlannedRoutes={showPlannedRoutes}
              hoveredMarker={uiState.hoveredMarker}
              setHoveredMarker={uiState.setHoveredMarker}
            />
          </div>

          {/* Right: Sidebar (Stats + Legend + Timeline) */}
          <aside className="flex flex-col gap-3 min-h-0 overflow-hidden">

            {/* Stats - Compact Grid */}
            <div className="flex-shrink-0">
              <SessionStats summary={sessionData.summary.summary} />
            </div>

            {/* Controls / Legend - Fixed Height */}
            <div className="flex-shrink-0">
              <MapLegend
                showPlannedRoutes={showPlannedRoutes}
                onTogglePlannedRoutes={setShowPlannedRoutes}
                isCompleted={currentStatus === 'completed'}
              />
            </div>

            {/* Timeline - Scrollable */}
            <div className="flex-1 min-h-0 bg-white rounded-lg shadow flex flex-col overflow-hidden">
              <SessionTimeline items={sessionData.timeline} />
            </div>
          </aside>

        </main>
      </div>
    </Sidebar>
  );
};

export default EmployeeTrackingDetailsPage;