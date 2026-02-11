import { describe, it, expect } from "vitest";

// Extracted permission mapping from useLeavePermissions

interface LeavePermissions {
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  canBulkDelete: boolean;
  canApprove: boolean;
  canExportPdf: boolean;
  canExportExcel: boolean;
}

function computeLeavePermissions(
  hasPermission: (module: string, action: string) => boolean
): LeavePermissions {
  return {
    canCreate: hasPermission("leaves", "create"),
    canUpdate: hasPermission("leaves", "update"),
    canDelete: hasPermission("leaves", "delete"),
    canBulkDelete: hasPermission("leaves", "bulkDelete"),
    canApprove: hasPermission("leaves", "updateStatus"),
    canExportPdf: hasPermission("leaves", "exportPdf"),
    canExportExcel: hasPermission("leaves", "exportExcel"),
  };
}

describe("Leave permissions", () => {
  it("all true when fully permitted", () => {
    const perms = computeLeavePermissions(() => true);
    expect(Object.values(perms).every(Boolean)).toBe(true);
  });

  it("all false when no permissions", () => {
    const perms = computeLeavePermissions(() => false);
    expect(Object.values(perms).every((v) => !v)).toBe(true);
  });

  it("maps individual permissions correctly", () => {
    const allowed = new Set(["create", "exportPdf"]);
    const perms = computeLeavePermissions((_m, a) => allowed.has(a));
    expect(perms.canCreate).toBe(true);
    expect(perms.canExportPdf).toBe(true);
    expect(perms.canUpdate).toBe(false);
    expect(perms.canDelete).toBe(false);
  });

  it("approve maps to updateStatus action", () => {
    const perms = computeLeavePermissions((_m, a) => a === "updateStatus");
    expect(perms.canApprove).toBe(true);
    expect(perms.canCreate).toBe(false);
  });
});
