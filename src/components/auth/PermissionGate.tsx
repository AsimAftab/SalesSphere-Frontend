import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../api/authService';
import { Loader2 } from 'lucide-react';

interface PermissionGateProps {
  module: string;
  action?: 'view' | 'create' | 'update' | 'delete'; // Legacy actions  
  feature?: string; // NEW: Granular feature key (e.g., 'exportPdf', 'webCheckIn')
  redirectTo?: string;
}

const PageSpinner: React.FC = () => (
  <div className="flex h-screen w-full items-center justify-center bg-gray-100">
    <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
  </div>
);

/**
 * PermissionGate Component
 * 
 * Protects routes with granular permission checks.
 * Supports both legacy action-based checks (view/create/update/delete)
 * and new granular feature checks (any feature key).
 * 
 * @example Legacy usage
 * <Route element={<PermissionGate module="products" action="create" />}>
 * 
 * @example Granular feature usage
 * <Route element={<PermissionGate module="products" feature="exportPdf" />}>
 */
const PermissionGate: React.FC<PermissionGateProps> = ({
  module,
  action = 'view',
  feature,
  redirectTo = '/dashboard',
}) => {
  const { user, isAuthenticated, isLoading, hasAccess, can, isFeatureEnabled } = useAuth();

  if (isLoading) {
    return <PageSpinner />;
  }

  // 1b. Redirect System Roles to System Admin Panel
  // They should not access organization modules
  const userRole = user?.role?.toLowerCase();
  if (userRole === 'superadmin' || userRole === 'developer') {
    return <Navigate to="/system-admin" replace />;
  }

  // 2. Authentication Check
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ fromProtected: true }} />;
  }

  // 3. Granular Feature Check (NEW - if feature prop provided)
  // Uses composite access: Plan ∩ Role
  if (feature) {
    if (!hasAccess(module, feature)) {
      return <Navigate to={redirectTo} replace />;
    }
    return <Outlet />;
  }

  // 4. Legacy Action-Based Check (for backward compatibility)
  // First check plan (module level), then permission (action level)
  if (!isFeatureEnabled(module)) {
    return <Navigate to={redirectTo} replace />;
  }

  if (!can(module, action)) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
};

export default PermissionGate;