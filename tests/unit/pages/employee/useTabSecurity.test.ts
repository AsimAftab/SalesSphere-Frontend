import { describe, it, expect } from "vitest";

// Extracted tab filtering logic from useTabSecurity

interface MockTab {
  id: string;
  permission?: {
    module?: string;
    action?: string;
    customCheck?: (hasPermission: (m: string, a: string) => boolean) => boolean;
  };
}

function filterAllowedTabs(
  tabs: MockTab[],
  hasPermission: (module: string, action: string) => boolean,
  isFeatureEnabled: (module: string) => boolean
): MockTab[] {
  return tabs.filter((tab) => {
    if (!tab.permission) return true;
    if (tab.permission.customCheck) {
      return tab.permission.customCheck(hasPermission);
    }
    const { module, action } = tab.permission;
    return isFeatureEnabled(module!) && hasPermission(module!, action!);
  });
}

function resolveInitialTab(
  paramTab: string | null,
  stateTab: string | undefined,
  allowedTabs: MockTab[]
): string {
  if (paramTab && allowedTabs.some((t) => t.id === paramTab)) return paramTab;
  if (stateTab && allowedTabs.some((t) => t.id === stateTab)) return stateTab;
  const defaultTab = allowedTabs.find((t) => t.id === "details") || allowedTabs[0];
  return defaultTab?.id || "details";
}

const tabs: MockTab[] = [
  { id: "details" },
  { id: "orders", permission: { module: "orders", action: "view" } },
  { id: "attendance", permission: { module: "attendance", action: "view" } },
  {
    id: "admin",
    permission: {
      customCheck: (hp) => hp("admin", "manage"),
    },
  },
];

describe("Tab security – filtering", () => {
  it("includes tabs with no permission", () => {
    const result = filterAllowedTabs(tabs, () => false, () => false);
    expect(result.some((t) => t.id === "details")).toBe(true);
  });

  it("includes tabs when permission and feature enabled", () => {
    const result = filterAllowedTabs(tabs, () => true, () => true);
    expect(result).toHaveLength(4);
  });

  it("excludes tabs when feature disabled", () => {
    const result = filterAllowedTabs(
      tabs,
      () => true,
      (m) => m !== "attendance"
    );
    expect(result.some((t) => t.id === "attendance")).toBe(false);
    expect(result.some((t) => t.id === "orders")).toBe(true);
  });

  it("excludes tabs when permission denied", () => {
    const result = filterAllowedTabs(
      tabs,
      (m, a) => !(m === "orders" && a === "view"),
      () => true
    );
    expect(result.some((t) => t.id === "orders")).toBe(false);
  });

  it("evaluates customCheck correctly", () => {
    const result = filterAllowedTabs(
      tabs,
      (m, a) => m === "admin" && a === "manage",
      () => true
    );
    expect(result.some((t) => t.id === "admin")).toBe(true);
  });

  it("excludes customCheck when it returns false", () => {
    const result = filterAllowedTabs(tabs, () => false, () => true);
    expect(result.some((t) => t.id === "admin")).toBe(false);
  });
});

describe("Tab security – initial tab resolution", () => {
  const allowed: MockTab[] = [
    { id: "details" },
    { id: "orders" },
    { id: "attendance" },
  ];

  it("uses URL param when valid", () => {
    expect(resolveInitialTab("orders", undefined, allowed)).toBe("orders");
  });

  it("ignores invalid URL param", () => {
    expect(resolveInitialTab("invalid", undefined, allowed)).toBe("details");
  });

  it("uses state tab as fallback", () => {
    expect(resolveInitialTab(null, "attendance", allowed)).toBe("attendance");
  });

  it("defaults to 'details' tab", () => {
    expect(resolveInitialTab(null, undefined, allowed)).toBe("details");
  });

  it("falls back to first tab when details not available", () => {
    const noDetails: MockTab[] = [{ id: "orders" }, { id: "attendance" }];
    expect(resolveInitialTab(null, undefined, noDetails)).toBe("orders");
  });

  it("returns 'details' for empty allowed tabs", () => {
    expect(resolveInitialTab(null, undefined, [])).toBe("details");
  });
});
