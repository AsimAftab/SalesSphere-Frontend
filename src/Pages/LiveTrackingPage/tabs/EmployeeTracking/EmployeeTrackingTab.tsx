import React from 'react';
import type { ActiveSession } from '../../../../api/liveTrackingService';
import { useEmployeeFilter } from './hooks/useEmployeeFilter';
import TrackingPageHeader from '../../components/TrackingPageHeader';
import EmployeeSessionList from './components/EmployeeSessionList';

interface EmployeeTrackingTabProps {
    stats: {
        totalEmployees: number;
        activeNow: number;
        completed: number;
        pending: number;
    } | null;
    sessions: ActiveSession[];
    isLoading?: boolean;
    canViewCurrentLocation?: boolean;
}

const EmployeeTrackingTab: React.FC<EmployeeTrackingTabProps> = ({
    sessions,
    isLoading,
    canViewCurrentLocation = true
}) => {
    // Separation of concerns: Hook handles logic
    const {
        searchQuery,
        setSearchQuery,
        filteredSessions,
        hasNoSessions,
        hasNoResults
    } = useEmployeeFilter(sessions);

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <TrackingPageHeader
                title="Employee Tracking"
                subtitle="Monitor active employee locations"
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                searchPlaceholder="Search by Employee, Role or Beat Name"
                isLoading={isLoading}
            />

            {/* List Section */}
            <EmployeeSessionList
                sessions={filteredSessions}
                hasNoSessions={!isLoading && hasNoSessions} // Only show empty state if not loading
                hasNoResults={!isLoading && hasNoResults}   // Only show no results if not loading
                searchQuery={searchQuery}
                isLoading={isLoading}
                canViewCurrentLocation={canViewCurrentLocation}
            />
        </div>
    );
};

export default EmployeeTrackingTab;
