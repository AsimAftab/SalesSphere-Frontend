import React, { useState } from 'react';
import EmployeeTrackingCard from '../EmployeeTracking/components/EmployeeTrackingCard';
// Adjust import if needed
import type { ActiveSession } from '@/api/liveTrackingService';
import TrackingPageHeader from '../../components/TrackingPageHeader';
import trackingIcon from '@/assets/images/icons/tracking-icon.svg';
import EmployeeCardSkeleton from '../EmployeeTracking/components/EmployeeCardSkeleton';
import { Pagination, EmptyState } from '@/components/ui';

interface CompletedTrackingTabProps {
    sessions: ActiveSession[];
    isLoading?: boolean;
    canPlaybackHistory?: boolean;
}

const ITEMS_PER_PAGE = 9;

const CompletedTrackingTab: React.FC<CompletedTrackingTabProps> = ({
    sessions,
    isLoading = false,
    canPlaybackHistory = true
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // Reset page on sessions or search change
    React.useEffect(() => {
        setCurrentPage(1);
    }, [sessions.length, searchQuery]);

    // Derived state: Filter sessions
    const filteredSessions = React.useMemo(() => {
        if (!searchQuery.trim()) return sessions;

        const lowerQuery = searchQuery.toLowerCase();
        return sessions.filter(session =>
            session.user.name.toLowerCase().includes(lowerQuery) ||
            session.beatPlan.name.toLowerCase().includes(lowerQuery) ||
            (session.user.customRoleId?.name || session.user.role).toLowerCase().includes(lowerQuery)
        );
    }, [sessions, searchQuery]);

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentSessions = filteredSessions.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    return (
        <div>
            <TrackingPageHeader
                title="Tracking History"
                subtitle="View past tracking sessions"
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                searchPlaceholder="Search by Employee, Role or Beat Name"
                isLoading={isLoading}
            />

            {/* Content Area */}
            {isLoading ? (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 mt-6">
                        {[...Array(9)].map((_, i) => (
                            <EmployeeCardSkeleton key={i} rowCount={4} />
                        ))}
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                        {currentSessions.map((session) => (
                            <EmployeeTrackingCard
                                key={session.sessionId}
                                linkTo={canPlaybackHistory ? `/live-tracking/session/${session.sessionId}` : undefined}
                                locationLabel="Tracking Completed Address"
                                hideStatusDot={true}
                                checkOut={session.sessionEndedAt ? new Date(session.sessionEndedAt).toLocaleTimeString() : undefined}
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

                    {filteredSessions.length > ITEMS_PER_PAGE && (
                        <Pagination
                            currentPage={currentPage}
                            totalItems={filteredSessions.length}
                            itemsPerPage={ITEMS_PER_PAGE}
                            onPageChange={setCurrentPage}
                        />
                    )}
                </div>
            )}

            {/* Empty state message */}
            {!isLoading && filteredSessions.length === 0 && (
                <div className="min-h-[400px] flex items-center justify-center">
                    <EmptyState
                        icon={<img src={trackingIcon} alt="No Completed Sessions" className="w-12 h-12 grayscale opacity-50" />}
                        title={searchQuery ? "No Matching Sessions" : "No Completed Sessions"}
                        description={searchQuery ? "No sessions match your current filters. Try adjusting your search criteria." : "History of completed tracking sessions will appear here."}
                    />
                </div>
            )}
        </div>
    );
};

export default CompletedTrackingTab;
