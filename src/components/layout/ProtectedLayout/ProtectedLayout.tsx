import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../../api/authService';
import { useIdleTimer } from '../../auth/userIdleTimer'; 


const ProtectedLayout: React.FC = () => {
  const { isAuthenticated } = useAuth();
  useIdleTimer(isAuthenticated);

  return (
    // 1. Set the main wrapper to flex and full screen height
    <div className="flex h-screen bg-gray-50">
      
      {/* 2. Set the main content area to grow and be scrollable */}
      <main className="flex-1 overflow-y-auto">
        <Outlet /> 
      </main>
    </div>
  );
};

export default ProtectedLayout;