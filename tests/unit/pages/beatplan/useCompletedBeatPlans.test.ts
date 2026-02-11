import { describe, it, expect } from "vitest";

// Extracted search + pagination from useCompletedBeatPlans

interface MockBeatPlan {
  _id: string;
  name: string;
  assignedTo: { name: string };
}

function filterCompleted(plans: MockBeatPlan[], searchQuery: string): MockBeatPlan[] {
  if (!searchQuery.trim()) return plans;
  const q = searchQuery.toLowerCase();
  return plans.filter(
    (p) => p.name.toLowerCase().includes(q) || p.assignedTo.name.toLowerCase().includes(q)
  );
}

function safePaginate<T>(items: T[], page: number, perPage: number): T[] {
  const totalPages = Math.max(1, Math.ceil(items.length / perPage));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * perPage;
  return items.slice(start, start + perPage);
}

const plans: MockBeatPlan[] = [
  { _id: "1", name: "Alpha Route", assignedTo: { name: "Alice" } },
  { _id: "2", name: "Beta Route", assignedTo: { name: "Bob" } },
  { _id: "3", name: "Gamma Route", assignedTo: { name: "Charlie" } },
];

describe("Completed beat plans – search", () => {
  it("returns all with empty search", () => {
    expect(filterCompleted(plans, "")).toHaveLength(3);
  });

  it("filters by plan name", () => {
    expect(filterCompleted(plans, "Alpha")).toHaveLength(1);
  });

  it("filters by employee name", () => {
    expect(filterCompleted(plans, "Bob")).toHaveLength(1);
  });

  it("is case-insensitive", () => {
    expect(filterCompleted(plans, "alpha")).toHaveLength(1);
  });

  it("returns empty for no match", () => {
    expect(filterCompleted(plans, "xyz")).toHaveLength(0);
  });
});

describe("Completed beat plans – safe pagination", () => {
  it("clamps page to valid range", () => {
    expect(safePaginate([1, 2, 3], 99, 2)).toEqual([3]);
  });

  it("clamps negative page to 1", () => {
    expect(safePaginate([1, 2, 3], -1, 2)).toEqual([1, 2]);
  });

  it("returns all when perPage exceeds length", () => {
    expect(safePaginate([1, 2], 1, 10)).toEqual([1, 2]);
  });
});
