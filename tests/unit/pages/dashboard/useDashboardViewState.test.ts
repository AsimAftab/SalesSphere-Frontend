import { describe, it, expect } from "vitest";

// Test permission grouping and collection flattening from useDashboardViewState

interface DashboardPermissions {
  canViewStats: boolean;
  canViewTeam: boolean;
  canViewAttendance: boolean;
  canViewLive: boolean;
  canViewTrend: boolean;
  canViewPartyDistribution: boolean;
  canViewCollectionTrend: boolean;
}

function computePermissions(
  hasPermission: (module: string, feature: string) => boolean,
  isPlanFeatureEnabled: (module: string) => boolean
): DashboardPermissions {
  return {
    canViewStats: hasPermission("dashboard", "viewStats"),
    canViewTeam: hasPermission("dashboard", "viewTeamPerformance"),
    canViewAttendance: hasPermission("dashboard", "viewAttendanceSummary") && isPlanFeatureEnabled("attendance"),
    canViewLive: hasPermission("liveTracking", "viewLiveTracking") && isPlanFeatureEnabled("liveTracking"),
    canViewTrend: hasPermission("dashboard", "viewSalesTrend"),
    canViewPartyDistribution: hasPermission("dashboard", "viewPartyDistribution") && isPlanFeatureEnabled("parties"),
    canViewCollectionTrend: hasPermission("dashboard", "viewCollectionTrend") && isPlanFeatureEnabled("collections"),
  };
}

interface CollectionTrendDay {
  date: string;
  collections: { paymentMethod: string; partyName: string; amount: number }[];
}

function flattenCollections(data: CollectionTrendDay[]) {
  const flattened = data.flatMap((day) =>
    (day.collections || []).map((item, index) => ({
      id: `${day.date}-${index}`,
      receivedDate: day.date,
      paymentMode: item.paymentMethod,
      partyName: item.partyName,
      paidAmount: item.amount,
    }))
  );
  return flattened.sort(
    (a, b) => new Date(b.receivedDate).getTime() - new Date(a.receivedDate).getTime()
  );
}

describe("Dashboard – permission grouping", () => {
  it("all true when everything permitted", () => {
    const perms = computePermissions(() => true, () => true);
    expect(Object.values(perms).every(Boolean)).toBe(true);
  });

  it("all false when nothing permitted", () => {
    const perms = computePermissions(() => false, () => false);
    expect(Object.values(perms).every((v) => !v)).toBe(true);
  });

  it("attendance requires both permission and plan", () => {
    const permsNoPlan = computePermissions(() => true, () => false);
    expect(permsNoPlan.canViewAttendance).toBe(false);

    const permsNoPerm = computePermissions(() => false, () => true);
    expect(permsNoPerm.canViewAttendance).toBe(false);
  });

  it("stats only needs permission, not plan check", () => {
    const perms = computePermissions(() => true, () => false);
    expect(perms.canViewStats).toBe(true);
  });

  it("live tracking checks liveTracking module", () => {
    const hasPermission = (m: string, f: string) => m === "liveTracking" && f === "viewLiveTracking";
    const isPlanEnabled = (m: string) => m === "liveTracking";
    const perms = computePermissions(hasPermission, isPlanEnabled);
    expect(perms.canViewLive).toBe(true);
    expect(perms.canViewStats).toBe(false);
  });
});

describe("Dashboard – collection flattening", () => {
  const trendData: CollectionTrendDay[] = [
    {
      date: "2025-03-01",
      collections: [
        { paymentMethod: "Cash", partyName: "Acme", amount: 1000 },
        { paymentMethod: "UPI", partyName: "Beta", amount: 2000 },
      ],
    },
    {
      date: "2025-03-02",
      collections: [{ paymentMethod: "Cash", partyName: "Gamma", amount: 500 }],
    },
  ];

  it("flattens all collections", () => {
    expect(flattenCollections(trendData)).toHaveLength(3);
  });

  it("sorts by date descending", () => {
    const result = flattenCollections(trendData);
    expect(result[0].receivedDate).toBe("2025-03-02");
  });

  it("maps fields correctly", () => {
    const result = flattenCollections(trendData);
    const gamma = result.find((r) => r.partyName === "Gamma");
    expect(gamma?.paymentMode).toBe("Cash");
    expect(gamma?.paidAmount).toBe(500);
  });

  it("generates unique IDs", () => {
    const result = flattenCollections(trendData);
    const ids = result.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("handles empty collections array", () => {
    expect(flattenCollections([{ date: "2025-01-01", collections: [] }])).toHaveLength(0);
  });

  it("handles missing collections field", () => {
    expect(flattenCollections([{ date: "2025-01-01" } as CollectionTrendDay])).toHaveLength(0);
  });
});
