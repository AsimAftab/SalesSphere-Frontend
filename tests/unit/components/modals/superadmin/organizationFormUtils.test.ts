import { describe, it, expect } from "vitest";

// Test normalizeDuration and normalizeOrganizationData logic

function normalizeDuration(duration?: string): string {
  if (!duration) return "";
  const clean = duration.toLowerCase().replace(/\s/g, "");
  if (clean === "12months") return "12 Months";
  if (clean === "6months") return "6 Months";
  return duration;
}

function getSubscriptionType(customPlanId: unknown): string {
  if (
    customPlanId &&
    typeof customPlanId === "object" &&
    (customPlanId as { tier: string }).tier !== "custom"
  ) {
    return (customPlanId as { name: string }).name;
  }
  return "";
}

function getCustomPlanId(customPlanId: unknown): string {
  if (
    customPlanId &&
    typeof customPlanId === "object" &&
    (customPlanId as { tier: string }).tier === "custom"
  ) {
    return (
      (customPlanId as { _id?: string })._id ||
      (customPlanId as { id?: string }).id ||
      ""
    );
  }
  return "";
}

describe("Organization form utils – normalizeDuration", () => {
  it("returns empty for undefined", () => {
    expect(normalizeDuration(undefined)).toBe("");
  });

  it("returns empty for empty string", () => {
    expect(normalizeDuration("")).toBe("");
  });

  it("normalizes '12months' to '12 Months'", () => {
    expect(normalizeDuration("12months")).toBe("12 Months");
  });

  it("normalizes '6 Months' (with space) to '6 Months'", () => {
    expect(normalizeDuration("6 Months")).toBe("6 Months");
  });

  it("normalizes mixed case '12Months'", () => {
    expect(normalizeDuration("12Months")).toBe("12 Months");
  });

  it("returns original for unrecognized duration", () => {
    expect(normalizeDuration("3 Months")).toBe("3 Months");
  });
});

describe("Organization form utils – subscription type detection", () => {
  it("returns plan name for non-custom plan", () => {
    expect(getSubscriptionType({ name: "Basic", tier: "basic" })).toBe("Basic");
  });

  it("returns empty for custom plan", () => {
    expect(getSubscriptionType({ name: "Custom Plan", tier: "custom" })).toBe("");
  });

  it("returns empty for null", () => {
    expect(getSubscriptionType(null)).toBe("");
  });

  it("returns empty for string id", () => {
    expect(getSubscriptionType("abc123")).toBe("");
  });
});

describe("Organization form utils – custom plan ID extraction", () => {
  it("extracts _id for custom plan", () => {
    expect(getCustomPlanId({ _id: "plan123", tier: "custom" })).toBe("plan123");
  });

  it("falls back to id field", () => {
    expect(getCustomPlanId({ id: "plan456", tier: "custom" })).toBe("plan456");
  });

  it("returns empty for non-custom plan", () => {
    expect(getCustomPlanId({ _id: "plan123", tier: "basic" })).toBe("");
  });

  it("returns empty for null", () => {
    expect(getCustomPlanId(null)).toBe("");
  });
});
