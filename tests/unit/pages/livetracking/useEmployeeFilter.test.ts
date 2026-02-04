import { describe, it, expect } from "vitest";

// Extracted filtering logic from useEmployeeFilter

interface MockSession {
  user: { name: string; role: string; customRoleId?: { name: string } | null };
  beatPlan: { name: string };
}

function filterSessions(sessions: MockSession[] | undefined, searchQuery: string) {
  if (!sessions) return [];
  if (!searchQuery.trim()) return sessions;
  const query = searchQuery.toLowerCase();
  return sessions.filter((session) => {
    if (session.user.name.toLowerCase().includes(query)) return true;
    const roleName = session.user.customRoleId?.name || session.user.role;
    if (roleName && roleName.toLowerCase().includes(query)) return true;
    if (session.beatPlan.name.toLowerCase().includes(query)) return true;
    return false;
  });
}

const mockSessions: MockSession[] = [
  { user: { name: "Alice", role: "user", customRoleId: { name: "Sales Rep" } }, beatPlan: { name: "North Route" } },
  { user: { name: "Bob", role: "admin", customRoleId: null }, beatPlan: { name: "South Route" } },
  { user: { name: "Charlie", role: "user", customRoleId: { name: "Manager" } }, beatPlan: { name: "East Route" } },
];

describe("Employee filter – search", () => {
  it("returns all with empty query", () => {
    expect(filterSessions(mockSessions, "")).toHaveLength(3);
  });

  it("filters by name", () => {
    expect(filterSessions(mockSessions, "Alice")).toHaveLength(1);
  });

  it("filters by custom role", () => {
    expect(filterSessions(mockSessions, "Sales Rep")).toHaveLength(1);
  });

  it("filters by system role when no custom role", () => {
    expect(filterSessions(mockSessions, "admin")).toHaveLength(1);
  });

  it("filters by beat plan name", () => {
    expect(filterSessions(mockSessions, "North")).toHaveLength(1);
  });

  it("is case-insensitive", () => {
    expect(filterSessions(mockSessions, "alice")).toHaveLength(1);
  });

  it("returns empty for no match", () => {
    expect(filterSessions(mockSessions, "xyz")).toHaveLength(0);
  });

  it("returns empty for undefined sessions", () => {
    expect(filterSessions(undefined, "Alice")).toHaveLength(0);
  });
});

describe("Employee filter – state derivation", () => {
  it("hasNoSessions when undefined", () => {
    const sessions = undefined as MockSession[] | undefined;
    expect(sessions == null || sessions.length === 0).toBe(true);
  });

  it("hasNoResults when sessions exist but filter matches none", () => {
    const filtered = filterSessions(mockSessions, "xyz");
    const hasNoSessions = mockSessions.length === 0;
    const hasNoResults = !hasNoSessions && filtered.length === 0;
    expect(hasNoResults).toBe(true);
  });
});
