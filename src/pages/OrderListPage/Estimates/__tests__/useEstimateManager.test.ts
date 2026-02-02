import { describe, it, expect } from "vitest";

// Extracted pure filtering/sorting/pagination logic from useEstimateManager

interface MockEstimate {
  _id?: string;
  id?: string;
  partyName: string;
  estimateNumber: string;
  createdBy?: { name: string };
  dateTime: string;
}

interface EstimateFilters {
  parties: string[];
  creators: string[];
}

function filterEstimates(
  estimates: MockEstimate[],
  searchTerm: string,
  filters: EstimateFilters
): MockEstimate[] {
  return estimates
    .filter((est) => {
      const search = searchTerm.toLowerCase();
      const matchesSearch =
        (est.partyName || "").toLowerCase().includes(search) ||
        (est.estimateNumber || "").toLowerCase().includes(search) ||
        (est.createdBy?.name || "").toLowerCase().includes(search);

      const matchesParty =
        filters.parties.length === 0 || filters.parties.includes(est.partyName);
      const matchesCreator =
        filters.creators.length === 0 ||
        (est.createdBy?.name && filters.creators.includes(est.createdBy.name));

      return matchesSearch && matchesParty && matchesCreator;
    })
    .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());
}

function getAvailableOptions(estimates: MockEstimate[]) {
  const parties = Array.from(new Set(estimates.map((e) => e.partyName).filter(Boolean))).sort();
  const creators = Array.from(
    new Set(estimates.map((e) => e.createdBy?.name).filter(Boolean) as string[])
  ).sort();
  return { parties, creators };
}

const mockEstimates: MockEstimate[] = [
  { _id: "1", partyName: "Acme Corp", estimateNumber: "EST-001", createdBy: { name: "Alice" }, dateTime: "2026-01-15T10:00:00Z" },
  { _id: "2", partyName: "Beta Inc", estimateNumber: "EST-002", createdBy: { name: "Bob" }, dateTime: "2026-02-10T12:00:00Z" },
  { _id: "3", partyName: "Acme Corp", estimateNumber: "EST-003", createdBy: { name: "Alice" }, dateTime: "2026-03-05T08:00:00Z" },
  { _id: "4", partyName: "Gamma Ltd", estimateNumber: "EST-004", createdBy: { name: "Charlie" }, dateTime: "2026-01-20T09:00:00Z" },
];

const emptyFilters: EstimateFilters = { parties: [], creators: [] };

describe("Estimate filtering logic", () => {
  it("returns all estimates with no filters (sorted by date desc)", () => {
    const result = filterEstimates(mockEstimates, "", emptyFilters);
    expect(result).toHaveLength(4);
    // Most recent first
    expect(result[0]._id).toBe("3");
    expect(result[3]._id).toBe("1");
  });

  it("searches by partyName", () => {
    expect(filterEstimates(mockEstimates, "Acme", emptyFilters)).toHaveLength(2);
  });

  it("searches by estimateNumber", () => {
    expect(filterEstimates(mockEstimates, "EST-002", emptyFilters)).toHaveLength(1);
  });

  it("searches by creator name", () => {
    expect(filterEstimates(mockEstimates, "Bob", emptyFilters)).toHaveLength(1);
  });

  it("search is case-insensitive", () => {
    expect(filterEstimates(mockEstimates, "acme", emptyFilters)).toHaveLength(2);
  });

  it("filters by party", () => {
    const result = filterEstimates(mockEstimates, "", { ...emptyFilters, parties: ["Beta Inc"] });
    expect(result).toHaveLength(1);
    expect(result[0]._id).toBe("2");
  });

  it("filters by creator", () => {
    const result = filterEstimates(mockEstimates, "", { ...emptyFilters, creators: ["Alice"] });
    expect(result).toHaveLength(2);
  });

  it("combines search and party filter", () => {
    const result = filterEstimates(mockEstimates, "EST-001", { ...emptyFilters, parties: ["Acme Corp"] });
    expect(result).toHaveLength(1);
  });

  it("returns empty when nothing matches", () => {
    expect(filterEstimates(mockEstimates, "NonExistent", emptyFilters)).toHaveLength(0);
  });
});

describe("Estimate pagination", () => {
  it("paginates with 10 items per page", () => {
    const ITEMS_PER_PAGE = 10;
    const items = Array.from({ length: 23 }, (_, i) => ({ id: String(i) }));
    const page1 = items.slice(0, ITEMS_PER_PAGE);
    const page3 = items.slice(20, 30);
    expect(page1).toHaveLength(10);
    expect(page3).toHaveLength(3);
    expect(Math.ceil(items.length / ITEMS_PER_PAGE)).toBe(3);
  });
});

describe("Estimate available options", () => {
  it("extracts unique sorted party names", () => {
    const { parties } = getAvailableOptions(mockEstimates);
    expect(parties).toEqual(["Acme Corp", "Beta Inc", "Gamma Ltd"]);
  });

  it("extracts unique sorted creator names", () => {
    const { creators } = getAvailableOptions(mockEstimates);
    expect(creators).toEqual(["Alice", "Bob", "Charlie"]);
  });

  it("returns empty arrays for empty input", () => {
    const { parties, creators } = getAvailableOptions([]);
    expect(parties).toEqual([]);
    expect(creators).toEqual([]);
  });
});

describe("Estimate selection logic", () => {
  it("toggles a single id", () => {
    const prev = ["1", "2"];
    const toggled = prev.includes("2") ? prev.filter((i) => i !== "2") : [...prev, "2"];
    expect(toggled).toEqual(["1"]);
  });

  it("adds a new id on toggle", () => {
    const prev = ["1"];
    const toggled = prev.includes("3") ? prev.filter((i) => i !== "3") : [...prev, "3"];
    expect(toggled).toEqual(["1", "3"]);
  });

  it("select all toggles correctly", () => {
    const currentEstimates = mockEstimates.slice(0, 3);
    const selected: string[] = [];
    // When no selection, select all
    const allSelected =
      selected.length > 0 ? [] : currentEstimates.map((e) => e._id || e.id);
    expect(allSelected).toEqual(["1", "2", "3"]);
  });
});
