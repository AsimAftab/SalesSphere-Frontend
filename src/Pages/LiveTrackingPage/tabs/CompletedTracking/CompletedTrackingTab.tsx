import React, { useState } from 'react';
import EmployeeTrackingCard from '../EmployeeTracking/components/EmployeeTrackingCard';
// Adjust import if needed
import type { ActiveSession } from '../../../../api/liveTrackingService';
import { FaCalendarCheck } from 'react-icons/fa';
import Pagination from '../../../../components/UI/Page/Pagination';
import { EmptyState } from '../../../../components/UI/EmptyState/EmptyState';
import trackingIcon from '../../../../assets/Image/icons/tracking-icon.svg';
import EmployeeCardSkeleton from '../EmployeeTracking/components/EmployeeCardSkeleton';

interface CompletedTrackingTabProps {
    sessions: ActiveSession[];
    isLoading?: boolean;
}

const ITEMS_PER_PAGE = 9;

const CompletedTrackingTab: React.FC<CompletedTrackingTabProps> = ({ sessions, isLoading = false }) => {
    const [currentPage, setCurrentPage] = useState(1);

    // Reset page on sessions change
    React.useEffect(() => {
        setCurrentPage(1);
    }, [sessions.length]);

    // Loading State
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-12">
                {[...Array(8)].map((_, i) => (
                    <EmployeeCardSkeleton key={i} />
                ))}
            </div>
        );
    }

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentSessions = sessions.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    return (
        <div>
            {/* Optional Header inside tab if needed, but NavigationTabs covers main nav. */}
            {/* We can show a small summary or just the grid. */}
            <div className="flex items-center gap-2 mb-6">
                <FaCalendarCheck className="text-green-600 w-5 h-5" />
                <h2 className="text-lg font-bold text-gray-800">Completed Sessions History</h2>
            </div>

            {/* Employee Cards Grid */}
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                    {currentSessions.map((session) => (
                        <EmployeeTrackingCard
                            key={session.sessionId}
                            linkTo={`/live-tracking/session/${session.sessionId}`}
                            employee={{
                                id: session.user._id,
                                name: session.user.name,
                                role: session.user.customRoleId?.name || (session.user.role === 'user' ? 'Employee' : session.user.role),
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
                    ))}
                </div>

                {sessions.length > ITEMS_PER_PAGE && (
                    <Pagination
                        currentPage={currentPage}
                        totalItems={sessions.length}
                        itemsPerPage={ITEMS_PER_PAGE}
                        onPageChange={setCurrentPage}
                    />
                )}
            </div>

            {/* Empty state message */}
            {sessions.length === 0 && (
                <div className="min-h-[400px] flex items-center justify-center">
                    <EmptyState
                        icon={<img src={trackingIcon} alt="No Completed Sessions" className="w-12 h-12 grayscale opacity-50" />}
                        title="No Completed Sessions"
                        description="History of completed tracking sessions will appear here."
                    />
                </div>
            )}
        </div>
    );
};

export default CompletedTrackingTab;
