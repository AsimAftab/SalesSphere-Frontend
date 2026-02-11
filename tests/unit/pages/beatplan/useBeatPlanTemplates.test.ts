import { describe, it, expect } from "vitest";

// Extracted filtering logic from useBeatPlanTemplates

interface MockTemplate {
  _id: string;
  name: string;
  createdBy: { name: string };
  createdAt: string;
}

interface Filters {
  createdBy: string;
  month: string;
  date: string;
}

function filterTemplates(
  templates: MockTemplate[],
  searchQuery: string,
  filters: Filters
): MockTemplate[] {
  return templates.filter((t) => {
    if (searchQuery && !t.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filters.createdBy && t.createdBy.name !== filters.createdBy) return false;
    if (filters.month) {
      const monthName = new Date(t.createdAt).toLocaleString("default", { month: "long" });
      if (monthName !== filters.month) return false;
    }
    if (filters.date) {
      const templateDate = new Date(t.createdAt).toISOString().split("T")[0];
      if (templateDate !== filters.date) return false;
    }
    return true;
  });
}

function paginate<T>(items: T[], page: number, perPage: number): T[] {
  const start = (page - 1) * perPage;
  return items.slice(start, start + perPage);
}

function extractUniqueCreators(templates: MockTemplate[]): string[] {
  return Array.from(new Set(templates.map((t) => t.createdBy.name)));
}

const templates: MockTemplate[] = [
  { _id: "1", name: "North Route", createdBy: { name: "Alice" }, createdAt: "2025-01-15T00:00:00Z" },
  { _id: "2", name: "South Route", createdBy: { name: "Bob" }, createdAt: "2025-02-20T00:00:00Z" },
  { _id: "3", name: "East Route", createdBy: { name: "Alice" }, createdAt: "2025-01-25T00:00:00Z" },
  { _id: "4", name: "West Route", createdBy: { name: "Charlie" }, createdAt: "2025-03-10T00:00:00Z" },
];

const noFilters: Filters = { createdBy: "", month: "", date: "" };

describe("Beat plan templates – filtering", () => {
  it("returns all with no filters", () => {
    expect(filterTemplates(templates, "", noFilters)).toHaveLength(4);
  });

  it("filters by search query", () => {
    expect(filterTemplates(templates, "North", noFilters)).toHaveLength(1);
  });

  it("filters by createdBy", () => {
    expect(filterTemplates(templates, "", { ...noFilters, createdBy: "Alice" })).toHaveLength(2);
  });

  it("filters by month", () => {
    expect(filterTemplates(templates, "", { ...noFilters, month: "January" })).toHaveLength(2);
  });

  it("filters by date", () => {
    expect(filterTemplates(templates, "", { ...noFilters, date: "2025-02-20" })).toHaveLength(1);
  });

  it("combines search and createdBy", () => {
    expect(filterTemplates(templates, "Route", { ...noFilters, createdBy: "Bob" })).toHaveLength(1);
  });

  it("returns empty when nothing matches", () => {
    expect(filterTemplates(templates, "xyz", noFilters)).toHaveLength(0);
  });
});

describe("Beat plan templates – pagination", () => {
  it("returns first page", () => {
    expect(paginate([1, 2, 3, 4, 5], 1, 2)).toEqual([1, 2]);
  });

  it("returns second page", () => {
    expect(paginate([1, 2, 3, 4, 5], 2, 2)).toEqual([3, 4]);
  });

  it("returns partial last page", () => {
    expect(paginate([1, 2, 3, 4, 5], 3, 2)).toEqual([5]);
  });

  it("returns empty for out-of-range page", () => {
    expect(paginate([1, 2], 5, 2)).toEqual([]);
  });
});

describe("Beat plan templates – unique creators", () => {
  it("extracts unique names", () => {
    const creators = extractUniqueCreators(templates);
    expect(creators).toContain("Alice");
    expect(creators).toContain("Bob");
    expect(creators).toContain("Charlie");
    expect(creators).toHaveLength(3);
  });
});
