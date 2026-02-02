import { describe, it, expect } from "vitest";

// Extracted date filtering logic from useOdometerDetailsManager

interface MockRecord {
  date: string; // DD-MM-YYYY format
  startReading: number;
  endReading: number;
}

function filterByDateSearch(records: MockRecord[], searchQuery: string): MockRecord[] {
  if (!searchQuery.trim()) return records;
  return records.filter((r) => r.date.includes(searchQuery));
}

function paginate<T>(items: T[], page: number, perPage: number): T[] {
  const start = (page - 1) * perPage;
  return items.slice(start, start + perPage);
}

const records: MockRecord[] = [
  { date: "15-01-2025", startReading: 100, endReading: 150 },
  { date: "16-01-2025", startReading: 150, endReading: 200 },
  { date: "15-02-2025", startReading: 200, endReading: 280 },
  { date: "20-03-2025", startReading: 280, endReading: 350 },
];

describe("Odometer details – date search", () => {
  it("returns all with empty search", () => {
    expect(filterByDateSearch(records, "")).toHaveLength(4);
  });

  it("filters by day", () => {
    expect(filterByDateSearch(records, "15")).toHaveLength(2);
  });

  it("filters by month", () => {
    expect(filterByDateSearch(records, "-01-")).toHaveLength(2);
  });

  it("filters by exact date", () => {
    expect(filterByDateSearch(records, "20-03-2025")).toHaveLength(1);
  });

  it("returns empty for no match", () => {
    expect(filterByDateSearch(records, "99")).toHaveLength(0);
  });
});

describe("Odometer details – pagination", () => {
  it("paginates correctly", () => {
    expect(paginate(records, 1, 2)).toHaveLength(2);
    expect(paginate(records, 2, 2)).toHaveLength(2);
    expect(paginate(records, 3, 2)).toHaveLength(0);
  });
});
