import React, { useState, useEffect } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { getCurrentUser } from '../../api/authService'; // Uses the *cached* user data
import { Loader2 } from 'lucide-react';

const PageSpinner: React.FC = () => (
  <div className="flex h-screen w-full items-center justify-center bg-gray-100">
    <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
  </div>
);

const SuperAdminRoute: React.FC = () => {
  const [authStatus, setAuthStatus] = useState<'loading' | 'authed' | 'unauthed'>('loading');
  const location = useLocation();

  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        // This uses the new cached function from authService.ts
        const user = await getCurrentUser(); 
        
        if (user.role === 'superadmin' || user.role === 'Developer') {
          setAuthStatus('authed');
        } else {
          setAuthStatus('unauthed');
        }
      } catch (error) {
        setAuthStatus('unauthed');
      }
    };
    verifyAdmin();
  }, []);

  if (authStatus === 'loading') {
    return <PageSpinner />;
  }

  if (authStatus === 'authed') {
    return <Outlet />; // Render nested routes
  }

  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default SuperAdminRoute;