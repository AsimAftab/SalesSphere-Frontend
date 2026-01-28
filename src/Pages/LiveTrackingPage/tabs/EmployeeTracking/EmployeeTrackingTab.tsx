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
}

const EmployeeTrackingTab: React.FC<EmployeeTrackingTabProps> = ({ sessions }) => {
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
            />

            {/* List Section */}
            <EmployeeSessionList
                sessions={filteredSessions}
                hasNoSessions={hasNoSessions}
                hasNoResults={hasNoResults}
                searchQuery={searchQuery}
            />
        </div>
    );
};

export default EmployeeTrackingTab;
