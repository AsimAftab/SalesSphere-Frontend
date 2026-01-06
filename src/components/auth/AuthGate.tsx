import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../api/authService'; // Use the hook instead of the direct API call
import { Loader2 } from 'lucide-react';

const PageSpinner: React.FC = () => (
  <div className="flex h-screen w-full items-center justify-center bg-gray-100">
    <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
  </div>
);

/**
 * AuthGate protects public pages (like the Landing Page or Login).
 * It prevents logged-in users from accessing them.
 */
const AuthGate: React.FC = () => {
  // Use the centralized auth state
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <PageSpinner />; // Standardized loading state
  }

  if (isAuthenticated) {
    // Enterprise logic: If already authenticated, redirect to the internal dashboard
    // 'replace' prevents the user from going back to the login page via the back button
    return <Navigate to="/dashboard" replace />;
  }

  // User is not authenticated; allow them to see public routes (Landing Page, Login, etc.)
  return <Outlet />;
};

export default AuthGate;