import api from '../api';
import { API_ENDPOINTS } from '../endpoints';
import { handleApiError } from '../errors';
import type {
  DashboardStats,
  TeamMemberPerformance,
  AttendanceSummary,
  SalesTrendData,
  LiveActivity,
  PartyDistributionData,
  CollectionTrendData,
} from './dashboard.types';

export const fetchDashboardStats = async () => {
  try {
    return await api.get<{ data: DashboardStats }>(API_ENDPOINTS.dashboard.STATS);
  } catch (error: unknown) {
    throw handleApiError(error, 'Failed to fetch dashboard stats');
  }
};

export const fetchTeamPerformance = async () => {
  try {
    return await api.get<{ data: TeamMemberPerformance[] }>(API_ENDPOINTS.dashboard.TEAM_PERFORMANCE);
  } catch (error: unknown) {
    throw handleApiError(error, 'Failed to fetch team performance');
  }
};

export const fetchAttendanceSummary = async () => {
  try {
    return await api.get<{ data: AttendanceSummary }>(API_ENDPOINTS.dashboard.ATTENDANCE_SUMMARY);
  } catch (error: unknown) {
    throw handleApiError(error, 'Failed to fetch attendance summary');
  }
};

export const fetchSalesTrend = async () => {
  try {
    return await api.get<{ data: SalesTrendData[] }>(API_ENDPOINTS.dashboard.SALES_TREND);
  } catch (error: unknown) {
    throw handleApiError(error, 'Failed to fetch sales trend');
  }
};

export const fetchLiveActivities = async () => {
  try {
    return await api.get<{ data: LiveActivity[] }>(API_ENDPOINTS.beatPlans.TRACKING_ACTIVE);
  } catch (error: unknown) {
    throw handleApiError(error, 'Failed to fetch live activities');
  }
};

export const getPartyDistribution = async () => {
  try {
    const response = await api.get<{ data: PartyDistributionData }>(API_ENDPOINTS.dashboard.PARTY_DISTRIBUTION);
    return response.data.data;
  } catch (error: unknown) {
    throw handleApiError(error, 'Failed to fetch party distribution');
  }
};

export const getCollectionTrend = async () => {
  try {
    const response = await api.get<{ data: CollectionTrendData[] }>(API_ENDPOINTS.dashboard.COLLECTION_TREND);
    return response.data.data;
  } catch (error: unknown) {
    throw handleApiError(error, 'Failed to fetch collection trend');
  }
};
