import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { getActiveTrackingData } from '../../api/liveTrackingService';
import type { ActiveSession } from '../../api/liveTrackingService';
import EmployeeTrackingCard from '../../components/cards/EmployeeTracking_cards/EmployeeTrackingCard';
import Sidebar from '../../components/layout/Sidebar/Sidebar';

const TrackingHistoryPage = () => {
  // 1. FETCH THE SAME DATA as LiveTrackingPage
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['activeTrackingData'],
    queryFn: getActiveTrackingData,
    // You might not need refetching on a history page
    // refetchInterval: 30000, 
  });

  // 2. FILTER for completed sessions
  const sessions = data?.sessions ?? [];
  const completedSessions = sessions.filter(
    (session: ActiveSession) => session.beatPlan.status === 'completed'
  );

  return (
    <Sidebar>
      {/* Header with Back Button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-black">
          Completed Sessions
        </h2>
        <Link
          to="/live-tracking" 
          className="flex items-center gap-2 px-4 py-2 bg-white text-black border border-blue-200 rounded-lg shadow-sm hover:bg-secondary  hover:text-white transition-colors"
        >
          <FaArrowLeft size={14} />
          <span>Back to Live View</span>
        </Link>
      </div>

      {isLoading && <p>Loading history...</p>}
      {isError && (
        <p className="text-red-500">
          {error?.message || 'Failed to load tracking history.'}
        </p>
      )}

      {/* Employee Cards Grid */}
      {!isLoading && !isError && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {completedSessions.map((session: ActiveSession) => (
            <Link
              key={session.sessionId}
              to={`/live-tracking/session/${session.sessionId}`}
            >
              <EmployeeTrackingCard
                employee={{
                  id: session.user._id,
                  name: session.user.name,
                  role: session.user.role,
                  status: 'Completed', // 'Idle' maps to 'Completed'
                  checkIn: new Date(
                    session.sessionStartedAt
                  ).toLocaleTimeString(),
                  lastLocation:
                    session.currentLocation.address?.formattedAddress ||
                    'Location not available',
                  beatPlanName: session.beatPlan.name,
                  avatar: session.user.name.substring(0, 1).toUpperCase(),
                  avatarColor: 'bg-blue-500',
                  avatarUrl: session.user.avatarUrl,
                }}
              />
            </Link>
          ))}
        </div>
      )}

      {/* Empty state message */}
      {!isLoading && !isError && completedSessions.length === 0 && (
        <div className="text-center col-span-full py-10">
          <p className="text-gray-500">No completed tracking sessions found.</p>
        </div>
      )}
    </Sidebar>
  );
};

export default TrackingHistoryPage;