import React from 'react';
import { Link } from 'react-router-dom';
import { Users } from 'lucide-react';
import EmployeeTrackingCard from '../../../../../components/cards/EmployeeTracking_cards/EmployeeTrackingCard';
import type { ActiveSession } from '../../../../../api/liveTrackingService';

interface EmployeeSessionListProps {
    sessions: ActiveSession[];
    hasNoSessions: boolean;
    hasNoResults: boolean;
    searchQuery: string;
}

const EmployeeSessionList: React.FC<EmployeeSessionListProps> = ({
    sessions,
    hasNoSessions,
    hasNoResults,
    searchQuery
}) => {
    if (hasNoSessions) {
        return (
            <div className="bg-white rounded-lg border border-gray-100 p-12 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
                    <Users className="w-6 h-6 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No Active Sessions</h3>
                <p className="mt-1 text-gray-500">There are no employees currently tracking.</p>
            </div>
        );
    }

    if (hasNoResults) {
        return (
            <div className="bg-white rounded-lg border border-gray-100 p-12 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
                    <Users className="w-6 h-6 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No employees found</h3>
                <p className="mt-1 text-gray-500">No results for "{searchQuery}"</p>
            </div>
        );
    }

    return (
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
                            status:
                                session.beatPlan.status === 'active'
                                    ? 'Active'
                                    : session.beatPlan.status === 'completed'
                                        ? 'Completed'
                                        : 'Pending',
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
    );
};

export default EmployeeSessionList;
