import { describe, it, expect } from "vitest";
import { formatFilterDate, getMonthName } from "../../../../../utils/dateUtils";

// Extracted pure filtering logic from useLeaveFilters

interface MockLeave {
  createdBy: { name: string };
  category: string;
  status: string;
  startDate: string;
}

interface FilterValues {
  date: Date | null;
  employees: string[];
  statuses: string[];
  months: string[];
}

function filterLeaves(
  leaves: MockLeave[],
  searchQuery: string,
  filters: FilterValues
): MockLeave[] {
  return leaves.filter((leave) => {
    const matchesSearch =
      leave.createdBy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      leave.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      filters.statuses.length === 0 || filters.statuses.includes(leave.status);

    const matchesDate =
      !filters.date ||
      (() => {
        const formattedFilterDate = formatFilterDate(filters.date!);
        return leave.startDate === formattedFilterDate;
      })();

    const monthName = getMonthName(leave.startDate);
    const matchesMonth =
      filters.months.length === 0 || filters.months.includes(monthName);

    const matchesEmployee =
      filters.employees.length === 0 ||
      filters.employees.includes(leave.createdBy.name);

    return matchesSearch && matchesStatus && matchesDate && matchesMonth && matchesEmployee;
  });
}

const mockLeaves: MockLeave[] = [
  { createdBy: { name: "Alice" }, category: "Sick Leave", status: "approved", startDate: "2026-01-15" },
  { createdBy: { name: "Bob" }, category: "Casual Leave", status: "pending", startDate: "2026-02-10" },
  { createdBy: { name: "Alice" }, category: "Personal Leave", status: "rejected", startDate: "2026-01-20" },
  { createdBy: { name: "Charlie" }, category: "Sick Leave", status: "approved", startDate: "2026-03-05" },
];

const emptyFilters: FilterValues = { date: null, employees: [], statuses: [], months: [] };

describe("Leave filtering logic", () => {
  it("returns all leaves with no filters", () => {
    expect(filterLeaves(mockLeaves, "", emptyFilters)).toHaveLength(4);
  });

  it("searches by employee name", () => {
    expect(filterLeaves(mockLeaves, "Alice", emptyFilters)).toHaveLength(2);
  });

  it("searches by category", () => {
    expect(filterLeaves(mockLeaves, "Sick", emptyFilters)).toHaveLength(2);
  });

  it("search is case-insensitive", () => {
    expect(filterLeaves(mockLeaves, "sick leave", emptyFilters)).toHaveLength(2);
  });

  it("filters by status", () => {
    const result = filterLeaves(mockLeaves, "", { ...emptyFilters, statuses: ["approved"] });
    expect(result).toHaveLength(2);
  });

  it("filters by date", () => {
    const result = filterLeaves(mockLeaves, "", { ...emptyFilters, date: new Date(2026, 0, 15) });
    expect(result).toHaveLength(1);
    expect(result[0].createdBy.name).toBe("Alice");
  });

  it("filters by month", () => {
    const result = filterLeaves(mockLeaves, "", { ...emptyFilters, months: ["January"] });
    expect(result).toHaveLength(2);
  });

  it("filters by employee", () => {
    const result = filterLeaves(mockLeaves, "", { ...emptyFilters, employees: ["Charlie"] });
    expect(result).toHaveLength(1);
  });

  it("combines search and status filter", () => {
    const result = filterLeaves(mockLeaves, "Alice", { ...emptyFilters, statuses: ["approved"] });
    expect(result).toHaveLength(1);
    expect(result[0].category).toBe("Sick Leave");
  });

  it("returns empty when nothing matches", () => {
    expect(filterLeaves(mockLeaves, "Zara", emptyFilters)).toHaveLength(0);
  });

  it("generates unique employee options", () => {
    const employees = Array.from(new Set(mockLeaves.map((l) => l.createdBy.name)));
    expect(employees).toContain("Alice");
    expect(employees).toContain("Bob");
    expect(employees).toContain("Charlie");
    expect(employees).toHaveLength(3);
  });
});
