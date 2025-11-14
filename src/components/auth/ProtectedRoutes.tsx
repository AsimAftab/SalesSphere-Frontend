import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../api/authService'; // 1. Import useAuth
import { Loader2 } from 'lucide-react';

const PageSpinner: React.FC = () => (
  <div className="flex h-screen w-full items-center justify-center bg-gray-100">
    <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
  </div>
);

const ProtectedRoute: React.FC = () => {
  // 2. Use the useAuth hook as the source of truth
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    // Show loader while useAuth is fetching the user
    return <PageSpinner />;
  }

  if (!isAuthenticated) {
    // 3. User is not logged in, redirect to login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 4. --- CRITICAL ROLE CHECK ---
  // User is logged in, now check their role
  const allowedRoles = ['admin', 'superadmin', 'manager']; // Define allowed web roles
  const userRole = user?.role.toLowerCase() || '';
  
  if (!allowedRoles.includes(userRole)) {
    // 5. User's role is NOT allowed. Send them back to login.
    // (We could also send them to an /unauthorized page)
    return <Navigate to="/login" replace />;
  }

  // 6. User is authenticated AND has an allowed role.
  // Render the child routes (e.g., your layout with the idle timer)
  return <Outlet />;
};

export default ProtectedRoute;