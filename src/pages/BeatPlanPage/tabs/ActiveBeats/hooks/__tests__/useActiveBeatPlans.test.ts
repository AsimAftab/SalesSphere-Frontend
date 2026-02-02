import { describe, it, expect } from "vitest";

// Extracted multi-criteria filtering from useActiveBeatPlans

interface MockBeatPlan {
  _id: string;
  name: string;
  status: string;
  assignedTo: { name: string };
  startDate: string;
}

interface Filters {
  status: string;
  assignedTo: string;
  date: string;
  month: string;
}

function filterBeatPlans(
  plans: MockBeatPlan[],
  searchQuery: string,
  filters: Filters
): MockBeatPlan[] {
  return plans
    .filter((p) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!p.name.toLowerCase().includes(q) && !p.assignedTo.name.toLowerCase().includes(q)) return false;
      }
      if (filters.status && p.status !== filters.status) return false;
      if (filters.assignedTo && p.assignedTo.name !== filters.assignedTo) return false;
      if (filters.month) {
        const monthName = new Date(p.startDate).toLocaleString("default", { month: "long" });
        if (monthName !== filters.month) return false;
      }
      if (filters.date) {
        const planDate = new Date(p.startDate).toISOString().split("T")[0];
        if (planDate !== filters.date) return false;
      }
      return true;
    })
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
}

function extractUniqueEmployees(plans: MockBeatPlan[]): string[] {
  return Array.from(new Set(plans.map((p) => p.assignedTo.name)));
}

const plans: MockBeatPlan[] = [
  { _id: "1", name: "Route A", status: "active", assignedTo: { name: "Alice" }, startDate: "2025-03-01T00:00:00Z" },
  { _id: "2", name: "Route B", status: "pending", assignedTo: { name: "Bob" }, startDate: "2025-03-15T00:00:00Z" },
  { _id: "3", name: "Route C", status: "active", assignedTo: { name: "Alice" }, startDate: "2025-02-10T00:00:00Z" },
  { _id: "4", name: "Route D", status: "active", assignedTo: { name: "Charlie" }, startDate: "2025-04-01T00:00:00Z" },
];

const noFilters: Filters = { status: "", assignedTo: "", date: "", month: "" };

describe("Active beat plans – filtering", () => {
  it("returns all with no filters", () => {
    expect(filterBeatPlans(plans, "", noFilters)).toHaveLength(4);
  });

  it("filters by search on name", () => {
    expect(filterBeatPlans(plans, "Route A", noFilters)).toHaveLength(1);
  });

  it("filters by search on employee name", () => {
    expect(filterBeatPlans(plans, "Alice", noFilters)).toHaveLength(2);
  });

  it("filters by status", () => {
    expect(filterBeatPlans(plans, "", { ...noFilters, status: "active" })).toHaveLength(3);
  });

  it("filters by assignedTo", () => {
    expect(filterBeatPlans(plans, "", { ...noFilters, assignedTo: "Bob" })).toHaveLength(1);
  });

  it("combines status and assignedTo", () => {
    const result = filterBeatPlans(plans, "", { ...noFilters, status: "active", assignedTo: "Alice" });
    expect(result).toHaveLength(2);
  });

  it("returns empty when nothing matches", () => {
    expect(filterBeatPlans(plans, "xyz", noFilters)).toHaveLength(0);
  });
});

describe("Active beat plans – sorting", () => {
  it("sorts by start date descending", () => {
    const result = filterBeatPlans(plans, "", noFilters);
    expect(result[0]._id).toBe("4");
    expect(result[result.length - 1]._id).toBe("3");
  });
});

describe("Active beat plans – unique employees", () => {
  it("extracts unique employee names", () => {
    const employees = extractUniqueEmployees(plans);
    expect(employees).toHaveLength(3);
    expect(employees).toContain("Alice");
  });
});
