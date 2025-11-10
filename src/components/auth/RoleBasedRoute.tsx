import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface RoleBasedRouteProps {
  allowedRoles: string[];
  redirectTo?: string;
}


const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({
  allowedRoles,
  redirectTo = '/dashboard'
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();

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

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ fromProtected: true }} />;
  }

  
  if (!user) {
    return <Navigate to="/login" replace />;
  }


  const userRole = user.role?.toLowerCase() || '';
  const hasRequiredRole = allowedRoles.some(role => role.toLowerCase() === userRole);

  if (!hasRequiredRole) {
   
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
};

export default RoleBasedRoute;
