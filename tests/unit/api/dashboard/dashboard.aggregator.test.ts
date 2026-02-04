import { describe, it, expect, vi } from "vitest";
import { DashboardMapper } from "@/api/dashboard/dashboard.mapper";

// We test the permission-gating logic of getFullDashboardData
// by mocking the fetchers and verifying which ones get called.

// Mock all fetchers
vi.mock("@/api/dashboard/dashboard.fetchers", () => ({
  fetchDashboardStats: vi.fn(() =>
    Promise.resolve({ data: { data: { totalParties: 5, totalSalesToday: "100" } } })
  ),
  fetchTeamPerformance: vi.fn(() =>
    Promise.resolve({ data: { data: [{ name: "Alice" }] } })
  ),
  fetchAttendanceSummary: vi.fn(() =>
    Promise.resolve({ data: { data: { present: 10 } } })
  ),
  fetchSalesTrend: vi.fn(() =>
    Promise.resolve({ data: { data: [{ date: "2026-01", amount: 500 }] } })
  ),
  fetchLiveActivities: vi.fn(() =>
    Promise.resolve({ data: { data: [{ type: "visit" }] } })
  ),
}));

import { getFullDashboardData } from "@/api/dashboard/dashboard.aggregator";
import * as fetchers from "@/api/dashboard/dashboard.fetchers";

describe("Dashboard aggregator – permission gating", () => {
  it("calls all fetchers when all permissions enabled", async () => {
    const isFeatureEnabled = () => true;
    const result = await getFullDashboardData(isFeatureEnabled);

    expect(fetchers.fetchDashboardStats).toHaveBeenCalled();
    expect(fetchers.fetchTeamPerformance).toHaveBeenCalled();
    expect(fetchers.fetchAttendanceSummary).toHaveBeenCalled();
    expect(fetchers.fetchSalesTrend).toHaveBeenCalled();
    expect(fetchers.fetchLiveActivities).toHaveBeenCalled();
    expect(result.stats).toBeDefined();
    expect(result.teamPerformance).toBeDefined();
  });

  it("returns initial stats when permission denied", async () => {
    const isFeatureEnabled = () => false;
    const result = await getFullDashboardData(isFeatureEnabled);

    expect(result.stats).toEqual(DashboardMapper.INITIAL_STATS);
    expect(result.teamPerformance).toEqual([]);
    expect(result.attendanceSummary).toEqual(DashboardMapper.INITIAL_ATTENDANCE);
    expect(result.salesTrend).toEqual([]);
    expect(result.liveActivities).toEqual([]);
  });

  it("selectively fetches based on permissions", async () => {
    vi.clearAllMocks();
    const isFeatureEnabled = (module: string, feature: string) => {
      return module === "dashboard" && feature === "viewStats";
    };

    const result = await getFullDashboardData(isFeatureEnabled);
    expect(fetchers.fetchDashboardStats).toHaveBeenCalled();
    expect(fetchers.fetchTeamPerformance).not.toHaveBeenCalled();
    expect(fetchers.fetchLiveActivities).not.toHaveBeenCalled();
    expect(result.teamPerformance).toEqual([]);
  });
});

describe("Dashboard aggregator – error resilience", () => {
  it("returns fallback when a fetcher throws", async () => {
    vi.mocked(fetchers.fetchDashboardStats).mockRejectedValueOnce(new Error("API down"));
    const isFeatureEnabled = () => true;
    const result = await getFullDashboardData(isFeatureEnabled);

    // Stats should fall back to INITIAL_STATS
    expect(result.stats).toEqual(DashboardMapper.INITIAL_STATS);
    // Other fields should still have data
    expect(result.teamPerformance).toBeDefined();
  });

  it("handles non-function isFeatureEnabled gracefully", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await getFullDashboardData(null as any);
    // Should default to all false -> initial values
    expect(result.stats).toEqual(DashboardMapper.INITIAL_STATS);
  });
});
