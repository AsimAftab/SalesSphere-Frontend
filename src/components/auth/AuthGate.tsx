import React, { useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { checkAuthStatus } from '../../api/authService'; // Adjust path if needed
import { Loader2 } from 'lucide-react';

const PageSpinner: React.FC = () => (
  <div className="flex h-screen w-full items-center justify-center bg-gray-100">
    <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
  </div>
);

const AuthGate: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const verifyAuth = async () => {
      const authValid = await checkAuthStatus();
      setIsAuthenticated(authValid);
    };
    verifyAuth();
  }, []);

  if (isAuthenticated === null) {
    return <PageSpinner />; // Show loader while checking
  }

  if (isAuthenticated) {
    // User is logged in! Send them to the dashboard.
    return <Navigate to="/dashboard" replace />;
  }

  // User is NOT logged in. Show the public page (Homepage).
  return <Outlet />;
};

export default AuthGate;