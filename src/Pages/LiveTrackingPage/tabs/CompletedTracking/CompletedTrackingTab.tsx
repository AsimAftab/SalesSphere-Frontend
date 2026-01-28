import { Link } from 'react-router-dom';
import EmployeeTrackingCard from '../../../../components/cards/EmployeeTracking_cards/EmployeeTrackingCard';
// Adjust import if needed
import type { ActiveSession } from '../../../../api/liveTrackingService';
import { FaCalendarCheck } from 'react-icons/fa';

interface CompletedTrackingTabProps {
    sessions: ActiveSession[];
}

const CompletedTrackingTab: React.FC<CompletedTrackingTabProps> = ({ sessions }) => {
    return (
        <div>
            {/* Optional Header inside tab if needed, but NavigationTabs covers main nav. */}
            {/* We can show a small summary or just the grid. */}
            <div className="flex items-center gap-2 mb-6">
                <FaCalendarCheck className="text-green-600 w-5 h-5" />
                <h2 className="text-lg font-bold text-gray-800">Completed Sessions History</h2>
            </div>

            {/* Employee Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sessions.map((session) => (
                    <Link
                        key={session.sessionId}
                        to={`/live-tracking/session/${session.sessionId}`}
                        className="block hover:no-underline"
                    >
                        <EmployeeTrackingCard
                            employee={{
                                id: session.user._id,
                                name: session.user.name,
                                role: session.user.role,
                                status: 'Completed',
                                checkIn: new Date(session.sessionStartedAt).toLocaleTimeString(),
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

            {/* Empty state message */}
            {sessions.length === 0 && (
                <div className="bg-white rounded-lg border border-gray-100 p-12 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-50 mb-4">
                        <FaCalendarCheck className="w-6 h-6 text-green-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No Completed Sessions</h3>
                    <p className="mt-1 text-gray-500">History of completed tracking sessions will appear here.</p>
                </div>
            )}
        </div>
    );
};

export default CompletedTrackingTab;
