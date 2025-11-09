import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface RoleBasedRouteProps {
  allowedRoles: string[];
  redirectTo?: string;
}

/**
 * Route guard that checks both authentication and user role
 * Only allows access if user is authenticated AND has one of the allowed roles
 */
const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({
  allowedRoles,
  redirectTo = '/dashboard'
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ fromProtected: true }} />;
  }

  // Authenticated but no user data
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has required role
  const userRole = user.role?.toLowerCase() || '';
  const hasRequiredRole = allowedRoles.some(role => role.toLowerCase() === userRole);

  if (!hasRequiredRole) {
    // User doesn't have required role - redirect
    return <Navigate to={redirectTo} replace />;
  }

  // User is authenticated and has required role
  return <Outlet />;
};

export default RoleBasedRoute;
