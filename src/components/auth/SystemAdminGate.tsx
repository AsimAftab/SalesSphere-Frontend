import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/api/authService';
import { Loader2 } from 'lucide-react';

const PageSpinner: React.FC = () => (
    <div className="flex h-screen w-full items-center justify-center bg-gray-100">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
    </div>
);

const SystemAdminGate: React.FC = () => {
    const { user, isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <PageSpinner />;
    }

    if (!isAuthenticated || !user) {
        return <Navigate to="/login" replace state={{ fromProtected: true }} />;
    }

    // Strict check for system roles
    const userRole = user?.role?.toLowerCase();
    const isSystemAdmin = ['superadmin','developer'].includes(userRole);

    if (!isSystemAdmin) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};

export default SystemAdminGate;
