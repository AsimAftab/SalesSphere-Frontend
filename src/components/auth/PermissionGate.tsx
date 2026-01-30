import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../api/authService';
import { Loader2 } from 'lucide-react';

interface PermissionGateProps {
  module: string;
  action?: 'view' | 'create' | 'update' | 'delete';
  feature?: string;
  redirectTo?: string;
  customCheck?: (helpers: { isFeatureEnabled: (m: string) => boolean; hasPermission: (m: string, f: string) => boolean }) => boolean;
}

// Route priority list matching Sidebar navigation order
const ROUTE_PRIORITY = [
  { path: '/dashboard', module: 'dashboard', feature: 'viewStats' },
  { path: '/live-tracking', module: 'liveTracking', feature: 'viewLiveTracking' },
  { path: '/products', module: 'products', feature: 'viewList' },
  { path: '/order-lists', module: 'orderLists', feature: 'viewList' },
  { path: '/employees', module: 'employees', feature: 'viewList' },
  { path: '/attendance', module: 'attendance', feature: 'viewMyAttendance' },
  { path: '/leaves', module: 'leaves', feature: 'viewList' },
  { path: '/parties', module: 'parties', feature: 'viewList' },
  { path: '/prospects', module: 'prospects', feature: 'viewList' },
  { path: '/sites', module: 'sites', feature: 'viewList' },
  { path: '/raw-material', module: 'rawMaterials', feature: 'viewList' },
  { path: '/analytics', module: 'analytics', feature: 'viewMonthlyOverview' },
  { path: '/beat-plan', module: 'beatPlan', feature: 'viewList' },
  { path: '/tour-plan', module: 'tourPlan', feature: 'viewList' },
  { path: '/collection', module: 'collections', feature: 'view' },
  { path: '/expenses', module: 'expenses', feature: 'viewList' },
  { path: '/odometer', module: 'odometer', feature: 'view' },
  { path: '/notes', module: 'notes', feature: 'viewList' },
  { path: '/miscellaneous-work', module: 'miscellaneousWork', feature: 'viewList' },
];

const PageSpinner: React.FC = () => (
  <div className="flex h-screen w-full items-center justify-center bg-gray-100">
    <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
  </div>
);

/**
 * PermissionGate Component
 * 
 * Protects routes with granular permission checks.
 * Uses smart redirect to find the first authorized route.
 */
const PermissionGate: React.FC<PermissionGateProps> = ({
  module,
  action = 'view',
  feature,
  redirectTo,
  customCheck,
}) => {
  const { user, isAuthenticated, isLoading, hasPermission, can, isFeatureEnabled } = useAuth();

  // Find the first route user has access to
  const getFirstAuthorizedRoute = (): string => {
    for (const route of ROUTE_PRIORITY) {
      // Skip current module to avoid redirect loop
      if (route.module === module) continue;

      // Check if user has access to this route
      if (isFeatureEnabled(route.module) && hasPermission(route.module, route.feature)) {
        return route.path;
      }
    }
    // Fallback to login if no authorized routes found
    return '/login';
  };

  if (isLoading) {
    return <PageSpinner />;
  }

  // 1b. Redirect System Roles to System Admin Panel
  const userRole = user?.role?.toLowerCase();
  if (userRole === 'superadmin' || userRole === 'developer') {
    return <Navigate to="/system-admin" replace />;
  }

  // 2. Authentication Check
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ fromProtected: true }} />;
  }

  // Determine redirect path: use prop if provided, otherwise smart redirect
  const smartRedirect = redirectTo || getFirstAuthorizedRoute();

  // 2b. Custom Check (for composite modules like analytics)
  if (customCheck) {
    return customCheck({ isFeatureEnabled, hasPermission }) ? <Outlet /> : <Navigate to={smartRedirect} replace />;
  }

  // 3. Granular Feature Check
  if (feature) {
    // A. Plan Check: Is the module enabled for the organization?
    if (!isFeatureEnabled(module)) {
      return <Navigate to={smartRedirect} replace />;
    }

    // B. Role Check: Does the user have the specific permission?
    if (!hasPermission(module, feature)) {
      return <Navigate to={smartRedirect} replace />;
    }

    return <Outlet />;
  }

  // 4. Legacy Action-Based Check
  if (!isFeatureEnabled(module)) {
    return <Navigate to={smartRedirect} replace />;
  }

  if (!can(module, action)) {
    return <Navigate to={smartRedirect} replace />;
  }

  return <Outlet />;
};

export default PermissionGate;