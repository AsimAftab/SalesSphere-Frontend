import api from './api';

export interface UserSnippet {
  _id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: string;
  customRoleId?: { _id: string; name: string };
}

export interface BeatPlanSnippet {
  _id: string;
  name: string;
  status: string;
}

export interface ActiveSession {
  sessionId: string;
  beatPlan: BeatPlanSnippet;
  user: UserSnippet;
  currentLocation: {
    latitude: number;
    longitude: number;
    timestamp: string;
    address?: {
      formattedAddress?: string;
      street?: string;
      city?: string;
      state?: string;
      country?: string;
      postalCode?: string;
      locality?: string | null;
    };
  };
  sessionStartedAt: string;
  sessionEndedAt?: string;
  locationsRecorded: number;
  status: 'active' | 'completed'; // Update status to include completed
}

export interface SessionSummary {
  sessionId: string;
  beatPlan: BeatPlanSnippet;
  user: UserSnippet;
  sessionStartedAt: string;
  sessionEndedAt: string;
  status: 'active' | 'pending' | 'completed';
  summary: {
    totalDistance: number;
    totalDuration: number;
    averageSpeed: number;
    directoriesVisited: number;
  };
  totalLocationsRecorded: number;
}

export interface Location {
  latitude: number;
  longitude: number;
  accuracy: number;
  speed: number;
  heading: number;
  timestamp: string;
  address?: {
    formattedAddress?: string;
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
    locality?: string;
  };
  nearestDirectory?: {
    directoryId: string;
    directoryType: 'party' | 'site' | 'prospect';
    distance: number;
    name?: string;
  };
  _id: string;
}

export interface SessionBreadcrumbs {
  sessionId: string;
  beatPlanId: string;
  userId: string;
  status: 'active' | 'pending' | 'completed';
  breadcrumbs: Location[];
  totalPoints: number;
}


const fetchActiveSessions = () =>
  api.get<{ data: ActiveSession[]; count: number }>(
    '/beat-plans/tracking/active'
  );

const fetchCompletedSessions = () =>
  api.get<{ data: any[]; total: number }>( // Using any[] temporarily, strictly define interface if possible
    '/beat-plans/tracking/completed?limit=100' // Fetch recent 100 for history tab
  );

const fetchSessionSummary = (sessionId: string) =>
  api.get<{ data: SessionSummary }>(
    `/beat-plans/tracking/session/${sessionId}/summary`
  );

const fetchSessionBreadcrumbs = (sessionId: string) =>
  api.get<{ data: SessionBreadcrumbs }>(
    `/beat-plans/tracking/session/${sessionId}/breadcrumbs`
  );

export const getActiveTrackingData = async () => {
  try {
    const [activeRes, completedRes] = await Promise.all([
      fetchActiveSessions(),
      fetchCompletedSessions(),
    ]);

    const activeSessions = activeRes.data.data;
    const completedSessionsRaw = completedRes.data.data;
    const completedTotal = completedRes.data.total;

    // Normalize completed sessions to match ActiveSession shape where possible (or use a union type)
    // The hook consumes them. We can just return them separately to be clean.

    // We map completed sessions to have a compatible structure if they are mixed, 
    // but here we will return them in the 'sessions' array for now, OR separate them.
    // The previous code returned `sessions` and `stats`.
    // Let's return separated lists to be cleaner, and update the hook.

    const stats = {
      totalEmployees: activeSessions.length, // Or total unique users across both? Usually active tracking total = active employees.
      activeNow: activeSessions.length,
      completed: completedTotal,
      pending: 0,
    };

    // We merge them into 'sessions' for the hook's current logic, 
    // BUT we need to be careful about the 'beatPlan' structure mismatch.
    // Active: beatPlan { _id, name, status }
    // Completed: beatPlanName (string)

    // Let's fix the completed session objects to match ActiveSession 'beatPlan' shape roughly
    const completedSessions = completedSessionsRaw.map((s: any) => ({
      ...s,
      beatPlan: { name: s.beatPlanName, status: 'completed' }, // Mocking structure
      // Keep original location if available, otherwise fallback
      currentLocation: s.currentLocation || { address: { formattedAddress: 'Location not available' } },
      status: 'completed'
    }));

    return {
      stats: stats,
      sessions: [...activeSessions, ...completedSessions],
    };
  } catch (error) {
    throw error;
  }
};


export interface EmployeeSessionData {
  summary: SessionSummary;
  breadcrumbs: SessionBreadcrumbs;
}



const fetchArchivedSession = (sessionId: string) =>
  api.get<{ data: SessionSummary & { breadcrumbs: Location[] } }>(
    `/beat-plans/tracking/archived/${sessionId}`
  );

export const getEmployeeSessionData = async (sessionId: string) => {
  if (!sessionId) {
    throw new Error('Session ID is required.');
  }

  try {
    // Try fetching as active session first
    const [summaryResponse, breadcrumbsResponse] = await Promise.all([
      fetchSessionSummary(sessionId),
      fetchSessionBreadcrumbs(sessionId),
    ]);

    return {
      summary: summaryResponse.data.data,
      breadcrumbs: breadcrumbsResponse.data.data,
    };
  } catch (activeError: any) {
    // If 404, try fetching as archived session
    if (activeError.response && activeError.response.status === 404) {
      try {
        const archivedResponse = await fetchArchivedSession(sessionId);
        const archivedData = archivedResponse.data.data;

        return {
          summary: {
            ...archivedData,
            summary: archivedData.summary // Ensure nested summary is preserved
          },
          breadcrumbs: {
            sessionId: archivedData.sessionId,
            beatPlanId: typeof archivedData.beatPlan === 'object' ? archivedData.beatPlan._id : archivedData.beatPlan,
            userId: archivedData.user._id,
            status: archivedData.status,
            breadcrumbs: archivedData.breadcrumbs || [],
            totalPoints: (archivedData.breadcrumbs || []).length
          } as SessionBreadcrumbs
        };
      } catch (archivedError) {
        // If both fail, throw the original error or a generic one
        throw activeError;
      }
    }
    throw activeError;
  }
};
