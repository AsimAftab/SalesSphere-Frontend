import { useParams } from "react-router-dom";
import Sidebar from "../../../../../components/layout/Sidebar/Sidebar";
import { useSessionDetails } from "./hooks/useSessionDetails";
import SessionHeader from "./components/SessionHeader";
import SessionMap from "./components/SessionMap";
import SessionTimeline from "./components/SessionTimeline";
import MapLegend from "./components/MapLegend";
import SessionStats from "./components/SessionStats";
import { useState } from "react";

const EmployeeTrackingDetailsPage = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const mapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  // Use custom hook for logic
  const { sessionData, uiState } = useSessionDetails(sessionId);

  // Local UI state for planned routes (can also be in hook if needed, but UI toggle is fine here)
  const [showPlannedRoutes, setShowPlannedRoutes] = useState(false);

  // --- Loading / Error States ---
  if (uiState.isLoading) return <Sidebar><p>Loading session details...</p></Sidebar>;
  if (uiState.error) return <Sidebar><p className="text-red-500">{uiState.error?.message || "Failed to load session details."}</p></Sidebar>;
  if (!sessionData.summary) return <Sidebar><p>No session data found.</p></Sidebar>;

  const currentStatus = sessionData.liveStatus || sessionData.summary.status;

  // Prepare prop for breadcrumbs coords (clean object for map)
  const breadcrumbCoords = sessionData.breadcrumbs?.breadcrumbs
    ? [...sessionData.breadcrumbs.breadcrumbs]
      .sort((a: any, b: any) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      .map((b: any) => ({ lat: b.latitude, lng: b.longitude }))
    : [];
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

          {/* Right: Sidebar (Legend + Timeline) */}
          <aside className="flex flex-col gap-3 min-h-0 overflow-hidden">

            {/* Stats - Fixed Height */}
            <div className="flex-shrink-0">
              <SessionStats summary={sessionData.summary.summary} />
            </div>

            {/* Controls - Fixed Height */}
            {/* Controls Removed - merged into Legend */}

            <div className="flex-shrink-0">
              <MapLegend
                showPlannedRoutes={showPlannedRoutes}
                onTogglePlannedRoutes={setShowPlannedRoutes}
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