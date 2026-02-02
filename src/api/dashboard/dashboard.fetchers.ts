import api from '../api';
import { API_ENDPOINTS } from '../endpoints';
import type {
  DashboardStats,
  TeamMemberPerformance,
  AttendanceSummary,
  SalesTrendData,
  LiveActivity,
  PartyDistributionData,
  CollectionTrendData,
} from './dashboard.types';

export const fetchDashboardStats = () =>
  api.get<{ data: DashboardStats }>(API_ENDPOINTS.dashboard.STATS);

export const fetchTeamPerformance = () =>
  api.get<{ data: TeamMemberPerformance[] }>(API_ENDPOINTS.dashboard.TEAM_PERFORMANCE);

export const fetchAttendanceSummary = () =>
  api.get<{ data: AttendanceSummary }>(API_ENDPOINTS.dashboard.ATTENDANCE_SUMMARY);

export const fetchSalesTrend = () =>
  api.get<{ data: SalesTrendData[] }>(API_ENDPOINTS.dashboard.SALES_TREND);

export const fetchLiveActivities = () =>
  api.get<{ data: LiveActivity[] }>(API_ENDPOINTS.beatPlans.TRACKING_ACTIVE);

export const getPartyDistribution = async () => {
  const response = await api.get<{ data: PartyDistributionData }>(API_ENDPOINTS.dashboard.PARTY_DISTRIBUTION);
  return response.data.data;
};

export const getCollectionTrend = async () => {
  const response = await api.get<{ data: CollectionTrendData[] }>(API_ENDPOINTS.dashboard.COLLECTION_TREND);
  return response.data.data;
};
