import api from '../api';
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
  api.get<{ data: DashboardStats }>('/dashboard/stats');

export const fetchTeamPerformance = () =>
  api.get<{ data: TeamMemberPerformance[] }>('/dashboard/team-performance');

export const fetchAttendanceSummary = () =>
  api.get<{ data: AttendanceSummary }>('/dashboard/attendance-summary');

export const fetchSalesTrend = () =>
  api.get<{ data: SalesTrendData[] }>('/dashboard/sales-trend');

export const fetchLiveActivities = () =>
  api.get<{ data: LiveActivity[] }>('/beat-plans/tracking/active');

export const getPartyDistribution = async () => {
  const response = await api.get<{ data: PartyDistributionData }>('/dashboard/party-distribution');
  return response.data.data;
};

export const getCollectionTrend = async () => {
  const response = await api.get<{ data: CollectionTrendData[] }>('/dashboard/collection-trend');
  return response.data.data;
};
