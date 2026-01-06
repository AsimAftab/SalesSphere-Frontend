// --- Permission Types ---
export type PermissionAction = 'all' | 'add' | 'update' | 'view' | 'delete';

export interface ModulePermissions {
  all: boolean;
  add: boolean;
  update: boolean;
  view: boolean;
  delete: boolean;
}

// Backend-compatible permissions (without 'all' which is frontend-only)
export interface BackendModulePermissions {
  view: boolean;
  add: boolean;
  update: boolean;
  delete: boolean;
}

// --- Module Configuration ---
// Maps display names to backend keys (camelCase)
export const MODULE_KEY_MAP: Record<string, string> = {
  "Dashboard": "dashboard",
  "Live Tracking": "liveTracking",
  "Products": "products",
  "Order Lists": "orderLists",
  "Employees": "employees",
  "Attendance": "attendance",
  "Leaves": "leaves",
  "Parties": "parties",
  "Prospects": "prospects",
  "Sites": "sites",
  "Raw Materials": "rawMaterials",
  "Analytics": "analytics",
  "Beat Plan": "beatPlan",
  "Tour Plan": "tourPlan",
  "Collections": "collections",
  "Expenses": "expenses",
  "Odometer": "odometer",
  "Notes": "notes",
  "Miscellaneous Work": "miscellaneousWork",
  "Settings": "settings"
};

// Reverse mapping: backend key -> display name
export const MODULE_DISPLAY_MAP: Record<string, string> = Object.entries(MODULE_KEY_MAP)
  .reduce((acc, [display, key]) => {
    acc[key] = display;
    return acc;
  }, {} as Record<string, string>);

export const MODULES_LIST = [
  "Dashboard",
  "Live Tracking",
  "Products",
  "Order Lists",
  "Employees",
  "Attendance",
  "Leaves",
  "Parties",
  "Prospects",
  "Sites",
  "Raw Materials",
  "Analytics",
  "Beat Plan",
  "Tour Plan",
  "Collections",
  "Expenses",
  "Odometer",
  "Notes",
  "Miscellaneous Work",
  "Settings"
] as const;

export type ModuleName = (typeof MODULES_LIST)[number];

// --- Role Types ---
export interface Role {
  _id: string;
  name: string;
  description?: string;
  organizationId: string;
  permissions: Record<string, BackendModulePermissions>;
  mobileAppAccess: boolean;
  webPortalAccess: boolean;
  isActive: boolean;
  isDefault: boolean;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateRolePayload {
  name: string;
  description?: string;
  permissions: Record<string, BackendModulePermissions>;
  mobileAppAccess: boolean;
  webPortalAccess: boolean;
}

export interface UpdateRolePayload {
  name?: string;
  description?: string;
  permissions?: Record<string, BackendModulePermissions>;
  mobileAppAccess?: boolean;
  webPortalAccess?: boolean;
  isActive?: boolean;
}

// --- Component Props ---
export interface PermissionTableProps {
  modules: string[];
  permissions: Record<string, ModulePermissions>;
  onToggle: (module: string, type: PermissionAction) => void;
  isEverythingSelected: boolean;
  onGrantAll: () => void;
}