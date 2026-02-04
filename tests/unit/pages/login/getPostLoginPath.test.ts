import { describe, it, expect } from "vitest";

const SYSTEM_ADMIN_ROLES = ["superadmin", "super admin", "developer"];

function getPostLoginPath(role?: string): string {
  const normalized = role?.toLowerCase() ?? "";
  return SYSTEM_ADMIN_ROLES.includes(normalized) ? "/system-admin" : "/dashboard";
}

describe("getPostLoginPath", () => {
  it("routes superadmin to /system-admin", () => {
    expect(getPostLoginPath("superadmin")).toBe("/system-admin");
  });

  it("routes 'super admin' (with space) to /system-admin", () => {
    expect(getPostLoginPath("super admin")).toBe("/system-admin");
  });

  it("routes developer to /system-admin", () => {
    expect(getPostLoginPath("developer")).toBe("/system-admin");
  });

  it("is case-insensitive", () => {
    expect(getPostLoginPath("SuperAdmin")).toBe("/system-admin");
    expect(getPostLoginPath("DEVELOPER")).toBe("/system-admin");
  });

  it("routes regular user to /dashboard", () => {
    expect(getPostLoginPath("user")).toBe("/dashboard");
  });

  it("routes admin to /dashboard", () => {
    expect(getPostLoginPath("admin")).toBe("/dashboard");
  });

  it("routes undefined to /dashboard", () => {
    expect(getPostLoginPath(undefined)).toBe("/dashboard");
  });

  it("routes empty string to /dashboard", () => {
    expect(getPostLoginPath("")).toBe("/dashboard");
  });
});
