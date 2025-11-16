import api from './api'; 

export interface UserSnippet {
  _id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: string;
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
  locationsRecorded: number;
  status: 'active';
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
    const response = await fetchActiveSessions();
    const sessions = response.data.data;
    const stats = {
      totalEmployees: sessions.length, 
      activeNow: sessions.length,
      completed: 0, 
      pending: 0, 
    };

    return {
      stats: stats,
      sessions: sessions,
    };
  } catch (error) {
    throw error;
  }
};


export interface EmployeeSessionData {
  summary: SessionSummary;
  breadcrumbs: SessionBreadcrumbs;
}



export const getEmployeeSessionData = async (sessionId: string) => {
  if (!sessionId) {
    throw new Error('Session ID is required.');
  }

  try {
    const [summaryResponse, breadcrumbsResponse] = await Promise.all([
      fetchSessionSummary(sessionId),
      fetchSessionBreadcrumbs(sessionId),
    ]);

    return {
      summary: summaryResponse.data.data,
      breadcrumbs: breadcrumbsResponse.data.data,
    };
  } catch (error) {
    throw error;
  }
};
