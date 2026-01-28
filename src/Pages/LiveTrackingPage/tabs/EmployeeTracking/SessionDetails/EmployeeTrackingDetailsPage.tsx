import { useParams } from "react-router-dom";
import Sidebar from "../../../../../components/layout/Sidebar/Sidebar";
import { useSessionDetails } from "./hooks/useSessionDetails";
import SessionHeader from "./components/SessionHeader";
import SessionMap from "./components/SessionMap";
import SessionTimeline from "./components/SessionTimeline";
import MapLegend from "./components/MapLegend";
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
  const breadcrumbCoords = sessionData.breadcrumbs?.breadcrumbs.map((b: any) => ({ lat: b.latitude, lng: b.longitude })) || [];

  return (
    <Sidebar>
      <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">

        {/* Header */}
        <SessionHeader
          user={sessionData.summary.user}
          status={currentStatus}
        />

        {/* Main Content */}
        <main className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_20rem] gap-4 p-4 min-h-0 overflow-y-auto lg:overflow-hidden">

          {/* Left: Map */}
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

          {/* Right: Sidebar (Legend + Timeline) */}
          <aside className="flex flex-col gap-3 lg:min-h-0 overflow-hidden">

            {/* Stats */}
            <div className="bg-white p-3 rounded-lg shadow flex-shrink-0 grid grid-cols-2 gap-2">
              <div className="bg-blue-50 p-2 rounded">
                <p className="text-xs text-blue-500 font-medium">Distance</p>
                <p className="text-sm font-bold text-gray-800">{sessionData.summary.summary.totalDistance.toFixed(2)} km</p>
              </div>
              <div className="bg-green-50 p-2 rounded">
                <p className="text-xs text-green-500 font-medium">Duration</p>
                {/* Convert minutes to H:M or just min */}
                <p className="text-sm font-bold text-gray-800">{Math.round(sessionData.summary.summary.totalDuration)} min</p>
              </div>
              <div className="bg-orange-50 p-2 rounded">
                <p className="text-xs text-orange-500 font-medium">Avg Speed</p>
                <p className="text-sm font-bold text-gray-800">{sessionData.summary.summary.averageSpeed.toFixed(1)} km/h</p>
              </div>
              <div className="bg-purple-50 p-2 rounded">
                <p className="text-xs text-purple-500 font-medium">Visits</p>
                <p className="text-sm font-bold text-gray-800">{sessionData.summary.summary.directoriesVisited}</p>
              </div>
            </div>

            {/* Controls */}
            <div className="bg-white p-3 rounded-lg shadow flex-shrink-0">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={showPlannedRoutes}
                  onChange={(e) => setShowPlannedRoutes(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                />
                <span className="text-sm font-semibold text-gray-700">Show Planned Route</span>
              </label>
            </div>

            <MapLegend />
            <SessionTimeline items={sessionData.timeline} />
          </aside>

        </main>
      </div>
    </Sidebar>
  );
};

export default EmployeeTrackingDetailsPage;