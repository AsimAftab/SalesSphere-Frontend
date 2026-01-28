import React from 'react';
import type { ActiveSession } from '../../../../api/liveTrackingService';
import { useEmployeeFilter } from './hooks/useEmployeeFilter';
import EmployeeTrackingHeader from './components/EmployeeTrackingHeader';
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
}

const EmployeeTrackingTab: React.FC<EmployeeTrackingTabProps> = ({ sessions, isLoading }) => {
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
            <EmployeeTrackingHeader
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                isLoading={isLoading}
            />

            {/* List Section */}
            <EmployeeSessionList
                sessions={filteredSessions}
                hasNoSessions={!isLoading && hasNoSessions} // Only show empty state if not loading
                hasNoResults={!isLoading && hasNoResults}   // Only show no results if not loading
                searchQuery={searchQuery}
                isLoading={isLoading}
            />
        </div>
    );
};

export default EmployeeTrackingTab;
