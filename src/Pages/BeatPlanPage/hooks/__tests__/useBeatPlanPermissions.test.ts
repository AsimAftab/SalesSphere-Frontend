import { describe, it, expect } from "vitest";

// Extracted permission mapping from useBeatPlanPermissions

interface BeatPlanPermissions {
  canViewTemplates: boolean;
  canCreateTemplate: boolean;
  canUpdateTemplate: boolean;
  canDeleteTemplate: boolean;
  canViewTemplateDetails: boolean;
  canViewList: boolean;
  canViewDetails: boolean;
  canAssign: boolean;
  canDelete: boolean;
  canExportPdf: boolean;
}

function computeBeatPlanPermissions(
  hasPermission: (module: string, action: string) => boolean
): BeatPlanPermissions {
  return {
    canViewTemplates: hasPermission("beatPlan", "viewListTemplates"),
    canCreateTemplate: hasPermission("beatPlan", "createList"),
    canUpdateTemplate: hasPermission("beatPlan", "updateList"),
    canDeleteTemplate: hasPermission("beatPlan", "deleteList"),
    canViewTemplateDetails: hasPermission("beatPlan", "viewDetailsTemplate"),
    canAssign: hasPermission("beatPlan", "assign"),
    canViewList: hasPermission("beatPlan", "viewList"),
    canViewDetails: hasPermission("beatPlan", "viewDetails"),
    canDelete: hasPermission("beatPlan", "delete"),
    canExportPdf: hasPermission("beatPlan", "exportPdf"),
  };
}

describe("Beat plan permissions", () => {
  it("all true when fully permitted", () => {
    const perms = computeBeatPlanPermissions(() => true);
    expect(Object.values(perms).every(Boolean)).toBe(true);
    expect(Object.keys(perms)).toHaveLength(10);
  });

  it("all false when no permissions", () => {
    const perms = computeBeatPlanPermissions(() => false);
    expect(Object.values(perms).every((v) => !v)).toBe(true);
  });

  it("separates template and plan permissions", () => {
    const templateActions = new Set(["viewListTemplates", "createList", "updateList", "deleteList", "viewDetailsTemplate"]);
    const perms = computeBeatPlanPermissions((_m, a) => templateActions.has(a));
    expect(perms.canViewTemplates).toBe(true);
    expect(perms.canCreateTemplate).toBe(true);
    expect(perms.canViewList).toBe(false);
    expect(perms.canDelete).toBe(false);
  });

  it("only checks beatPlan module", () => {
    const perms = computeBeatPlanPermissions((m) => m === "beatPlan");
    expect(Object.values(perms).every(Boolean)).toBe(true);
  });
});
