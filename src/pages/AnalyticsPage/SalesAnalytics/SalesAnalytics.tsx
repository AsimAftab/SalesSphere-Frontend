import React from 'react';
import SalesContent from './SalesContent';
import { useAuth } from '@/api/authService';
import { useSalesViewState } from './components/useSalesViewState';
import { ErrorBoundary } from '@/components/ui';

const SalesAnalytics: React.FC = () => {
    // 1. Get Authentication & Permissions
    const { hasPermission, isLoading: isAuthLoading } = useAuth();

    // 2. Use Custom Hook for Logic & State
    const {
        state,
        actions,
        permissions
    } = useSalesViewState(hasPermission, isAuthLoading, true);

    return (
        <div className="h-full w-full">
            <ErrorBoundary>
                <SalesContent
                    state={state}
                    actions={actions}
                    permissions={permissions}
                />
            </ErrorBoundary>
        </div>
    );
};

export default SalesAnalytics;
