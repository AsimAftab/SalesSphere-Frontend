import { describe, it, expect } from "vitest";

// Extracted session filtering and stats derivation from useLiveTracking

interface MockSession {
  id: string;
  beatPlan: { status: string };
}

interface MockStats {
  totalEmployees: number;
  activeNow: number;
  completed: number;
  pending: number;
}

function deriveStats(rawStats: MockStats | undefined) {
  if (!rawStats) return null;
  return {
    totalEmployees: rawStats.totalEmployees,
    activeNow: rawStats.activeNow,
    completed: rawStats.completed,
    pending: rawStats.pending,
  };
}

function filterActiveSessions(sessions: MockSession[]): MockSession[] {
  return sessions.filter(
    (s) => s.beatPlan.status === "active" || s.beatPlan.status === "pending"
  );
}

function filterCompletedSessions(sessions: MockSession[]): MockSession[] {
  return sessions.filter((s) => s.beatPlan.status === "completed");
}

const sessions: MockSession[] = [
  { id: "1", beatPlan: { status: "active" } },
  { id: "2", beatPlan: { status: "pending" } },
  { id: "3", beatPlan: { status: "completed" } },
  { id: "4", beatPlan: { status: "active" } },
  { id: "5", beatPlan: { status: "completed" } },
];

describe("Live tracking – session filtering", () => {
  it("filters active + pending sessions", () => {
    const result = filterActiveSessions(sessions);
    expect(result).toHaveLength(3);
    expect(result.every((s) => ["active", "pending"].includes(s.beatPlan.status))).toBe(true);
  });

  it("filters completed sessions", () => {
    const result = filterCompletedSessions(sessions);
    expect(result).toHaveLength(2);
    expect(result.every((s) => s.beatPlan.status === "completed")).toBe(true);
  });

  it("returns empty for no matching sessions", () => {
    const noActive: MockSession[] = [{ id: "1", beatPlan: { status: "completed" } }];
    expect(filterActiveSessions(noActive)).toHaveLength(0);
  });

  it("handles empty sessions array", () => {
    expect(filterActiveSessions([])).toHaveLength(0);
    expect(filterCompletedSessions([])).toHaveLength(0);
  });
});

describe("Live tracking – stats derivation", () => {
  it("returns null for undefined stats", () => {
    expect(deriveStats(undefined)).toBeNull();
  });

  it("maps all stat fields", () => {
    const result = deriveStats({ totalEmployees: 50, activeNow: 20, completed: 15, pending: 15 });
    expect(result).toEqual({ totalEmployees: 50, activeNow: 20, completed: 15, pending: 15 });
  });

  it("handles zero values", () => {
    const result = deriveStats({ totalEmployees: 0, activeNow: 0, completed: 0, pending: 0 });
    expect(result?.totalEmployees).toBe(0);
  });
});
