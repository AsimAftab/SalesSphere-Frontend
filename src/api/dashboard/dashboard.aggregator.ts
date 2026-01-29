import type {
  FullDashboardData,
  TeamMemberPerformance,
  SalesTrendData,
  LiveActivity,
} from './dashboard.types';
import { DashboardMapper } from './dashboard.mapper';
import {
  fetchDashboardStats,
  fetchTeamPerformance,
  fetchAttendanceSummary,
  fetchSalesTrend,
  fetchLiveActivities,
} from './dashboard.fetchers';

/**
 * Fetches full dashboard data with permission-based isolation and error resilience.
 * Use Promise.all with individual catch handlers to ensure a single failing
 * microservice doesn't break the entire dashboard UI.
 */
export const getFullDashboardData = async (
  isFeatureEnabled: (module: string, feature: string) => boolean
): Promise<FullDashboardData> => {
  const check = typeof isFeatureEnabled === 'function' ? isFeatureEnabled : () => false;

  const statsPromise = check('dashboard', 'viewStats')
    ? fetchDashboardStats()
    : Promise.resolve({ data: { data: DashboardMapper.INITIAL_STATS } });

  const teamPromise = check('dashboard', 'viewTeamPerformance')
    ? fetchTeamPerformance()
    : Promise.resolve({ data: { data: [] } });

  const attendancePromise = check('dashboard', 'viewAttendanceSummary')
    ? fetchAttendanceSummary()
    : Promise.resolve({ data: { data: DashboardMapper.INITIAL_ATTENDANCE } });

  const trendPromise = check('dashboard', 'viewSalesTrend')
    ? fetchSalesTrend()
    : Promise.resolve({ data: { data: [] } });

  const livePromise = check('liveTracking', 'viewLiveTracking')
    ? fetchLiveActivities()
    : Promise.resolve({ data: { data: [] } });

  try {
    const [stats, team, attendance, trend, live] = await Promise.all([
      statsPromise.catch(() => {
        return { data: { data: DashboardMapper.INITIAL_STATS } };
      }),
      teamPromise.catch(() => {
        return { data: { data: [] as TeamMemberPerformance[] } };
      }),
      attendancePromise.catch(() => {
        return { data: { data: DashboardMapper.INITIAL_ATTENDANCE } };
      }),
      trendPromise.catch(() => {
        return { data: { data: [] as SalesTrendData[] } };
      }),
      livePromise.catch(() => {
        return { data: { data: [] as LiveActivity[] } };
      }),
    ]);

    return {
      stats: stats.data.data,
      teamPerformance: team.data.data,
      attendanceSummary: attendance.data.data,
      salesTrend: trend.data.data,
      liveActivities: live.data.data,
    };
  } catch (criticalError) {
    return {
      stats: DashboardMapper.INITIAL_STATS,
      teamPerformance: [],
      attendanceSummary: DashboardMapper.INITIAL_ATTENDANCE,
      salesTrend: [],
      liveActivities: [],
    };
  }
};
