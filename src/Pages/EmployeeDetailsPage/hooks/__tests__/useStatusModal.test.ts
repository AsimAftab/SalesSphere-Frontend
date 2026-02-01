import { describe, it, expect } from "vitest";

// Extracted logic from useStatusModal

const ORDER_STATUS_OPTIONS = [
  { value: "pending", label: "Pending", colorClass: "blue" },
  { value: "in progress", label: "In Progress", colorClass: "violet" },
  { value: "in transit", label: "In Transit", colorClass: "orange" },
  { value: "completed", label: "Completed", colorClass: "green" },
  { value: "rejected", label: "Rejected", colorClass: "red" },
];

function resolveOrderId(order: { id?: string; _id?: string }): string | undefined {
  return order.id || order._id;
}

describe("Status modal – order status options", () => {
  it("has 5 status options", () => {
    expect(ORDER_STATUS_OPTIONS).toHaveLength(5);
  });

  it("includes pending, completed, rejected", () => {
    const values = ORDER_STATUS_OPTIONS.map((o) => o.value);
    expect(values).toContain("pending");
    expect(values).toContain("completed");
    expect(values).toContain("rejected");
  });

  it("each option has value, label, colorClass", () => {
    ORDER_STATUS_OPTIONS.forEach((opt) => {
      expect(opt.value).toBeTruthy();
      expect(opt.label).toBeTruthy();
      expect(opt.colorClass).toBeTruthy();
    });
  });
});

describe("Status modal – order ID resolution", () => {
  it("prefers id over _id", () => {
    expect(resolveOrderId({ id: "abc", _id: "xyz" })).toBe("abc");
  });

  it("falls back to _id", () => {
    expect(resolveOrderId({ _id: "xyz" })).toBe("xyz");
  });

  it("returns undefined when neither present", () => {
    expect(resolveOrderId({})).toBeUndefined();
  });

  it("returns id when _id is undefined", () => {
    expect(resolveOrderId({ id: "abc" })).toBe("abc");
  });
});
