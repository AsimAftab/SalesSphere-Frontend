import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../api/authService'; 
import { Loader2 } from 'lucide-react';

const PageSpinner: React.FC = () => (
  <div className="flex h-screen w-full items-center justify-center bg-gray-100">
    <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
  </div>
);

/**
 * ProtectedRoute serves as the primary security gate for the internal application.
 * It ensures the user is authenticated and their account is currently active.
 */
const ProtectedRoute: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // 1. Handle Loading State
  if (isLoading) {
    return <PageSpinner />;
  }

  // 2. Authentication Check
  // If not logged in, redirect to login and save the attempted URL for post-login redirect
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Account Status Check (Enterprise Gate)
  // Ensure the user hasn't been deactivated by an Admin while their session was active.
  if (user && user.isActive === false) {
    return <Navigate to="/login" replace />;
  }

  // 4. Verification for Web Access
  // The login logic now handles the webPortalAccess flag, but we keep a base role 
  // check here as a fallback to ensure only intended roles enter the main layout.
  const baseAllowedRoles = ['admin', 'superadmin', 'developer', 'user'];
  const userRole = user?.role.toLowerCase() || '';
  
  if (!baseAllowedRoles.includes(userRole)) {
    return <Navigate to="/login" replace />;
  }

  // 5. Success
  // Render the internal layout (Sidebar, Navbar, etc.)
  return <Outlet />;
};

export default ProtectedRoute;