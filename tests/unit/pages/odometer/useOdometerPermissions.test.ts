import { describe, it, expect } from "vitest";

// Extracted permission mapping from useOdometerPermissions

function computeOdometerPermissions(
  hasPermission: (module: string, action: string) => boolean,
  can: (module: string, action: string) => boolean
) {
  const MODULE = "odometer";
  return {
    canView: can(MODULE, "view"),
    canViewAll: hasPermission(MODULE, "viewAllOdometer"),
    canRecord: hasPermission(MODULE, "record"),
    canDelete: can(MODULE, "delete"),
    canExport: hasPermission(MODULE, "exportPdf"),
  };
}

describe("Odometer permissions", () => {
  it("all true when permitted", () => {
    const perms = computeOdometerPermissions(() => true, () => true);
    expect(Object.values(perms).every(Boolean)).toBe(true);
  });

  it("all false when denied", () => {
    const perms = computeOdometerPermissions(() => false, () => false);
    expect(Object.values(perms).every((v) => !v)).toBe(true);
  });

  it("canView uses 'can' not 'hasPermission'", () => {
    const perms = computeOdometerPermissions(() => false, () => true);
    expect(perms.canView).toBe(true);
    expect(perms.canViewAll).toBe(false);
  });

  it("canViewAll uses hasPermission with viewAllOdometer", () => {
    const perms = computeOdometerPermissions(
      (_m, a) => a === "viewAllOdometer",
      () => false
    );
    expect(perms.canViewAll).toBe(true);
    expect(perms.canView).toBe(false);
  });

  it("all use 'odometer' module", () => {
    const modules: string[] = [];
    computeOdometerPermissions(
      (m) => { modules.push(m); return false; },
      (m) => { modules.push(m); return false; }
    );
    expect(modules.every((m) => m === "odometer")).toBe(true);
  });
});
