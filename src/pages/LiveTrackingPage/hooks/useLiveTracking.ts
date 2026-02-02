import { useQuery } from '@tanstack/react-query';
import { getActiveTrackingData } from '@/api/liveTrackingService';
import type { ActiveSession } from '@/api/liveTrackingService';

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
        (s) => s.beatPlan.status === 'active' || s.beatPlan.status === 'pending'
    ) as ActiveSession[];

    const completedSessions = sessions.filter(
        (s) => s.beatPlan.status === 'completed'
    ) as ActiveSession[];

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
