import { describe, it, expect } from "vitest";

// Extracted status toggle logic from useOrganizationActions

function shouldActivate(currentStatus: string): boolean {
  return currentStatus !== "Active";
}

function getToggleMessage(shouldActivateOrg: boolean): string {
  return `Organization ${shouldActivateOrg ? "activated" : "deactivated"} successfully`;
}

describe("Organization actions – status toggle", () => {
  it("should activate when current status is not Active", () => {
    expect(shouldActivate("Inactive")).toBe(true);
  });

  it("should deactivate when current status is Active", () => {
    expect(shouldActivate("Active")).toBe(false);
  });

  it("should activate for any non-Active status", () => {
    expect(shouldActivate("Suspended")).toBe(true);
    expect(shouldActivate("")).toBe(true);
  });
});

describe("Organization actions – toggle message", () => {
  it("shows activated message", () => {
    expect(getToggleMessage(true)).toContain("activated");
  });

  it("shows deactivated message", () => {
    expect(getToggleMessage(false)).toContain("deactivated");
  });
});
