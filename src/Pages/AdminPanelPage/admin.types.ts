export type PermissionAction = 'all' | 'add' | 'update' | 'view' | 'delete';


export interface ModulePermissions {
  all: boolean;
  add: boolean;
  update: boolean;
  view: boolean;
  delete: boolean;
}

export interface PermissionTableProps {
  modules: string[];
  permissions: Record<string, ModulePermissions>;
  onToggle: (module: string, type: PermissionAction) => void;
  isEverythingSelected: boolean;
  onGrantAll: () => void;
}

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