import { useState, useMemo } from 'react';
import type { ActiveSession } from '../../../../../api/liveTrackingService';

export const useEmployeeFilter = (sessions: ActiveSession[] | undefined) => {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredSessions = useMemo(() => {
        if (!sessions) return [];
        if (!searchQuery.trim()) return sessions;

        return sessions.filter(session =>
            session.user.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [sessions, searchQuery]);

    const hasNoSessions = !sessions || sessions.length === 0;
    const hasNoResults = !hasNoSessions && filteredSessions.length === 0;

    return {
        searchQuery,
        setSearchQuery,
        filteredSessions,
        hasNoSessions,
        hasNoResults
    };
};
