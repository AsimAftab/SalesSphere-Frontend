import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useFeaturePermissions } from "@/pages/AdminPanelPage/PermissionTab/hooks/useFeaturePermissions";

const mockRegistry = {
  products: { view: "View Products", create: "Create Product", delete: "Delete Product" },
  attendance: { view: "View Attendance", webCheckIn: "Web Check-in" },
};

describe("useFeaturePermissions", () => {
  it("starts with empty permissions", () => {
    const { result } = renderHook(() => useFeaturePermissions(mockRegistry));
    expect(result.current.permissions).toEqual({});
  });

  it("loadPermissions sets permissions", () => {
    const { result } = renderHook(() => useFeaturePermissions(mockRegistry));
    act(() => {
      result.current.loadPermissions({
        products: { view: true, create: false, delete: false },
      });
    });
    expect(result.current.permissions.products.view).toBe(true);
    expect(result.current.permissions.products.create).toBe(false);
  });

  it("toggleFeature flips a single feature", () => {
    const { result } = renderHook(() => useFeaturePermissions(mockRegistry));
    act(() => {
      result.current.loadPermissions({
        products: { view: true, create: false, delete: false },
      });
    });
    act(() => result.current.toggleFeature("products", "create"));
    expect(result.current.permissions.products.create).toBe(true);

    act(() => result.current.toggleFeature("products", "create"));
    expect(result.current.permissions.products.create).toBe(false);
  });

  it("toggleModuleAll enables all when some are disabled", () => {
    const { result } = renderHook(() => useFeaturePermissions(mockRegistry));
    act(() => {
      result.current.loadPermissions({
        products: { view: true, create: false, delete: false },
      });
    });
    act(() => result.current.toggleModuleAll("products"));
    expect(result.current.permissions.products.view).toBe(true);
    expect(result.current.permissions.products.create).toBe(true);
    expect(result.current.permissions.products.delete).toBe(true);
  });

  it("toggleModuleAll disables all when all are enabled", () => {
    const { result } = renderHook(() => useFeaturePermissions(mockRegistry));
    act(() => {
      result.current.loadPermissions({
        products: { view: true, create: true, delete: true },
      });
    });
    act(() => result.current.toggleModuleAll("products"));
    expect(result.current.permissions.products.view).toBe(false);
    expect(result.current.permissions.products.create).toBe(false);
    expect(result.current.permissions.products.delete).toBe(false);
  });

  it("grantAllPermissions enables everything", () => {
    const { result } = renderHook(() => useFeaturePermissions(mockRegistry));
    act(() => {
      result.current.grantAllPermissions();
    });
    expect(result.current.permissions.products.view).toBe(true);
    expect(result.current.permissions.products.create).toBe(true);
    expect(result.current.permissions.products.delete).toBe(true);
    expect(result.current.permissions.attendance.view).toBe(true);
    expect(result.current.permissions.attendance.webCheckIn).toBe(true);
  });

  it("revokeAllPermissions disables everything", () => {
    const { result } = renderHook(() => useFeaturePermissions(mockRegistry));
    act(() => result.current.grantAllPermissions());
    act(() => result.current.revokeAllPermissions());
    expect(result.current.permissions.products.view).toBe(false);
    expect(result.current.permissions.attendance.webCheckIn).toBe(false);
  });

  it("getBackendPermissions returns current state", () => {
    const { result } = renderHook(() => useFeaturePermissions(mockRegistry));
    act(() => {
      result.current.loadPermissions({ products: { view: true, create: false, delete: false } });
    });
    expect(result.current.getBackendPermissions()).toEqual({
      products: { view: true, create: false, delete: false },
    });
  });

  it("toggleModuleExpansion toggles expansion state", () => {
    const { result } = renderHook(() => useFeaturePermissions(mockRegistry));
    act(() => result.current.toggleModuleExpansion("products"));
    expect(result.current.expandedModules.products).toBe(true);

    act(() => result.current.toggleModuleExpansion("products"));
    expect(result.current.expandedModules.products).toBe(false);
  });

  it("expandAll expands all modules", () => {
    const { result } = renderHook(() => useFeaturePermissions(mockRegistry));
    act(() => result.current.expandAll());
    expect(result.current.expandedModules.products).toBe(true);
    expect(result.current.expandedModules.attendance).toBe(true);
  });

  it("collapseAll clears expansion state", () => {
    const { result } = renderHook(() => useFeaturePermissions(mockRegistry));
    act(() => result.current.expandAll());
    act(() => result.current.collapseAll());
    expect(result.current.expandedModules).toEqual({});
  });

  it("handles null registry gracefully", () => {
    const { result } = renderHook(() => useFeaturePermissions(null));
    act(() => result.current.toggleModuleAll("products"));
    act(() => result.current.grantAllPermissions());
    act(() => result.current.revokeAllPermissions());
    act(() => result.current.expandAll());
    // No errors thrown
    expect(result.current.permissions).toEqual({});
  });
});
