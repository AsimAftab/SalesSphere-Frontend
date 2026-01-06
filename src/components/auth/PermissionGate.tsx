import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../api/authService';
import { Loader2 } from 'lucide-react';

interface PermissionGateProps {
  module: string;
  action?: 'view' | 'add' | 'update' | 'delete';
  redirectTo?: string;
}

const PageSpinner: React.FC = () => (
  <div className="flex h-screen w-full items-center justify-center bg-gray-100">
    <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
  </div>
);

const PermissionGate: React.FC<PermissionGateProps> = ({
  module,
  action = 'view',
  redirectTo = '/dashboard',
}) => {
  const { isAuthenticated, isLoading, can, isFeatureEnabled } = useAuth();

  // 1. Handle Loading State
  if (isLoading) {
    return <PageSpinner />;
  }

  // 2. Authentication Check
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ fromProtected: true }} />;
  }

  // 3. Subscription Plan Check (Intersection Logic)
  // Check if the organization's plan actually includes this module
  if (!isFeatureEnabled(module)) {
    return <Navigate to={redirectTo} replace />;
  }

  // 4. Permission Check (Dynamic RBAC)
  // Check if the specific user has the required action rights
  if (!can(module, action)) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
};

export default PermissionGate;