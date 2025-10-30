import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const isAuthenticated = (): boolean => {
  // This check is now correct.
  // It looks for the 'authToken' that loginUser() saves.
  return !!localStorage.getItem('authToken');
};

const ProtectedRoute: React.FC = () => {
  if (!isAuthenticated()) {
    // If no token, redirect to the login page.
    return <Navigate to="/login" replace />;
  }

  // If token exists, show the protected content
  return <Outlet />;
};

export default ProtectedRoute;