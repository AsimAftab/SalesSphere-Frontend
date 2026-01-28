import { useState, useMemo } from 'react';
import type { ActiveSession } from '../../../../../api/liveTrackingService';

export const useEmployeeFilter = (sessions: ActiveSession[] | undefined) => {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredSessions = useMemo(() => {
        if (!sessions) return [];
        if (!searchQuery.trim()) return sessions;

        const query = searchQuery.toLowerCase();

        return sessions.filter(session => {
            // Check Name
            if (session.user.name.toLowerCase().includes(query)) return true;

            // Check Role (Custom Role or System Role)
            const roleName = session.user.customRoleId?.name || session.user.role;
            if (roleName && roleName.toLowerCase().includes(query)) return true;

            // Check Beat Plan Name
            if (session.beatPlan.name.toLowerCase().includes(query)) return true;

            return false;
        });
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
