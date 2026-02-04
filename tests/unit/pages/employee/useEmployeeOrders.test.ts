import { describe, it, expect } from "vitest";

// Extracted filtering and pagination from useEmployeeOrders

interface MockOrder {
  _id: string;
  createdBy?: { id?: string; _id?: string };
  dateTime: string;
}

function filterByEmployee(orders: MockOrder[], employeeId: string | undefined): MockOrder[] {
  if (!orders || !employeeId) return [];
  return orders
    .filter((o) => o.createdBy?.id === employeeId || o.createdBy?._id === employeeId)
    .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());
}

function paginate<T>(items: T[], page: number, perPage: number): T[] {
  const start = (page - 1) * perPage;
  return items.slice(start, start + perPage);
}

const orders: MockOrder[] = [
  { _id: "o1", createdBy: { id: "emp1" }, dateTime: "2025-03-01T10:00:00Z" },
  { _id: "o2", createdBy: { _id: "emp1" }, dateTime: "2025-03-05T10:00:00Z" },
  { _id: "o3", createdBy: { id: "emp2" }, dateTime: "2025-03-03T10:00:00Z" },
  { _id: "o4", createdBy: { id: "emp1" }, dateTime: "2025-03-02T10:00:00Z" },
];

describe("Employee orders – filtering", () => {
  it("returns empty for undefined employeeId", () => {
    expect(filterByEmployee(orders, undefined)).toHaveLength(0);
  });

  it("filters by createdBy.id", () => {
    const result = filterByEmployee(orders, "emp1");
    expect(result).toHaveLength(3);
  });

  it("matches createdBy._id as fallback", () => {
    const result = filterByEmployee(orders, "emp1");
    expect(result.some((o) => o._id === "o2")).toBe(true);
  });

  it("filters for emp2", () => {
    expect(filterByEmployee(orders, "emp2")).toHaveLength(1);
  });

  it("returns empty for unknown employee", () => {
    expect(filterByEmployee(orders, "emp99")).toHaveLength(0);
  });
});

describe("Employee orders – sorting", () => {
  it("sorts by dateTime descending", () => {
    const result = filterByEmployee(orders, "emp1");
    expect(result[0]._id).toBe("o2"); // Mar 5
    expect(result[1]._id).toBe("o4"); // Mar 2
    expect(result[2]._id).toBe("o1"); // Mar 1
  });
});

describe("Employee orders – pagination", () => {
  it("returns correct page", () => {
    const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    expect(paginate(items, 1, 10)).toHaveLength(10);
    expect(paginate(items, 2, 10)).toHaveLength(1);
  });

  it("returns empty for out of range", () => {
    expect(paginate([1, 2], 3, 10)).toHaveLength(0);
  });
});
