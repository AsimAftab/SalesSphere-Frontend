import { useQuery } from '@tanstack/react-query';
import { getActiveTrackingData } from '../../../api/liveTrackingService';
// ActiveSession type used via 'any' casts in filters
// import type { ActiveSession } from '../../../api/liveTrackingService';

export const useLiveTracking = () => {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['activeTrackingData'],
        queryFn: getActiveTrackingData,
        refetchInterval: 30000,
    });

    const sessions = data?.sessions ?? [];

    // Derived Stats
    const stats = data?.stats
        ? {
            totalEmployees: data.stats.totalEmployees,
            activeNow: data.stats.activeNow,
            completed: data.stats.completed,
            pending: data.stats.pending,
        }
        : null;

    // Filtered Sessions
    const activeSessions = sessions.filter(
        (s: any) => s.beatPlan.status === 'active' || s.beatPlan.status === 'pending'
    );

    const completedSessions = sessions.filter(
        (s: any) => s.beatPlan.status === 'completed'
    );

    return {
        data,
        isLoading,
        isError,
        error,
        stats,
        sessions,            // All sessions
        activeSessions,      // Active + Pending for "Employees Tracking" view
        completedSessions,   // Completed for "History" view
    };
};
