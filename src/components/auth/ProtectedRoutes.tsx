import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Basic protected route that only checks if user is authenticated
 * Does NOT check user roles - use RoleBasedRoute for role-specific protection
 */
const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading state while checking authentication
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
    // If no token, redirect to the login page.
    return <Navigate to="/login" replace state={{ fromProtected: true }} />;
  }

  // If token exists, show the protected content
  return <Outlet />;
};

export default ProtectedRoute;