// Add useState import
import React, { useState } from 'react';
import { Users } from 'lucide-react';
import EmployeeTrackingCard from './EmployeeTrackingCard';
import type { ActiveSession } from '@/api/liveTrackingService';
import trackingIcon from '@/assets/images/icons/tracking-icon.svg';
import EmployeeCardSkeleton from './EmployeeCardSkeleton';
import { Pagination, EmptyState } from '@/components/ui';

interface EmployeeSessionListProps {
    sessions: ActiveSession[];
    hasNoSessions: boolean;
    hasNoResults: boolean;
    searchQuery: string;
    isLoading?: boolean;
    canViewCurrentLocation?: boolean;
}

const ITEMS_PER_PAGE = 9;

const EmployeeSessionList: React.FC<EmployeeSessionListProps> = ({
    sessions,
    hasNoSessions,
    hasNoResults,
    searchQuery,
    isLoading = false,
    canViewCurrentLocation = true
}) => {
    const [currentPage, setCurrentPage] = useState(1);

    // Reset to page 1 if sessions change (e.g. search)
    React.useEffect(() => {
        setCurrentPage(1);
    }, [sessions.length, searchQuery]);

    // Loading State
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                {[...Array(9)].map((_, i) => (
                    <EmployeeCardSkeleton key={i} canViewLocation={canViewCurrentLocation} />
                ))}
            </div>
        );
    }

    if (hasNoSessions) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <EmptyState
                    icon={<img src={trackingIcon} alt="No Active Sessions" className="w-12 h-12" />}
                    title="No Active Sessions"
                    description="No employees are currently being tracked in the system."
                />
            </div>
        );
    }

    if (hasNoResults) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <EmptyState
                    icon={<Users className="w-12 h-12 text-gray-400" />}
                    title="No employees found"
                    description={`No results for "${searchQuery}"`}
                />
            </div>
        );
    }

    // Pagination Logic
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentSessions = sessions.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                {currentSessions.map((session) => (
                    <EmployeeTrackingCard
                        key={session.sessionId}
                        linkTo={`/live-tracking/session/${session.sessionId}`}
                        employee={{
                            id: session.user._id,
                            name: session.user.name,
                            role: session.user.customRoleId?.name || 'Employee',
                            status:
                                session.beatPlan.status === 'active'
                                    ? 'Active'
                                    : 'Completed',
                            checkIn: new Date(session.sessionStartedAt).toLocaleTimeString(),
                            lastLocation:
                                session.currentLocation.address?.formattedAddress ||
                                'Location not available',
                            beatPlanName: session.beatPlan.name,
                            avatar: session.user.name.substring(0, 1).toUpperCase(),
                            avatarColor: 'bg-blue-500',
                            avatarUrl: session.user.avatarUrl,
                        }}
                        canViewLocation={canViewCurrentLocation}
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
    );
};

export default EmployeeSessionList;
