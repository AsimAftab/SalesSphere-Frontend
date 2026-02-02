import { describe, it, expect } from "vitest";

// Test the attendance permission logic directly (extracted from the hook)

interface MockUser {
  role: string;
}

interface MockPermissions {
  [module: string]: { [feature: string]: boolean };
}

function computeAttendancePermissions(
  hasPermission: (module: string, feature: string) => boolean,
  user: MockUser | null
) {
  return {
    canExportPdf: hasPermission("attendance", "exportPdf"),
    canExportExcel: hasPermission("attendance", "exportExcel"),
    canUpdateAttendance: hasPermission("attendance", "updateAttendance"),
    canMarkLeave: hasPermission("attendance", "markLeave"),
    canWebCheckIn: hasPermission("attendance", "webCheckIn") && user?.role !== "admin",
  };
}

function makeHasPermission(perms: MockPermissions) {
  return (module: string, feature: string) => !!perms[module]?.[feature];
}

describe("Attendance permissions logic", () => {
  it("returns all true when all permissions granted (non-admin)", () => {
    const hasPermission = makeHasPermission({
      attendance: {
        exportPdf: true,
        exportExcel: true,
        updateAttendance: true,
        markLeave: true,
        webCheckIn: true,
      },
    });

    const result = computeAttendancePermissions(hasPermission, { role: "user" });
    expect(result.canExportPdf).toBe(true);
    expect(result.canExportExcel).toBe(true);
    expect(result.canUpdateAttendance).toBe(true);
    expect(result.canMarkLeave).toBe(true);
    expect(result.canWebCheckIn).toBe(true);
  });

  it("returns all false when no permissions", () => {
    const hasPermission = makeHasPermission({});
    const result = computeAttendancePermissions(hasPermission, { role: "user" });
    expect(result.canExportPdf).toBe(false);
    expect(result.canWebCheckIn).toBe(false);
  });

  it("disables webCheckIn for admin even with permission", () => {
    const hasPermission = makeHasPermission({
      attendance: { webCheckIn: true },
    });
    const result = computeAttendancePermissions(hasPermission, { role: "admin" });
    expect(result.canWebCheckIn).toBe(false);
  });

  it("allows webCheckIn for regular user with permission", () => {
    const hasPermission = makeHasPermission({
      attendance: { webCheckIn: true },
    });
    const result = computeAttendancePermissions(hasPermission, { role: "user" });
    expect(result.canWebCheckIn).toBe(true);
  });

  it("allows webCheckIn when user is null (null?.role !== 'admin' is true)", () => {
    const hasPermission = makeHasPermission({
      attendance: { webCheckIn: true },
    });
    const result = computeAttendancePermissions(hasPermission, null);
    // null?.role is undefined, undefined !== 'admin' is true
    expect(result.canWebCheckIn).toBe(true);
  });

  it("handles partial permissions", () => {
    const hasPermission = makeHasPermission({
      attendance: { exportPdf: true, updateAttendance: false },
    });
    const result = computeAttendancePermissions(hasPermission, { role: "user" });
    expect(result.canExportPdf).toBe(true);
    expect(result.canUpdateAttendance).toBe(false);
    expect(result.canExportExcel).toBe(false);
  });
});
