import React from 'react';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import AnalyticsContent from './AnalyticsContent';
import { useAuth } from '../../api/authService';
import { useAnalytics } from './useAnalytics';

import ErrorBoundary from '../../components/UI/ErrorBoundary';

const AnalyticsPage: React.FC = () => {

    // 1. Get Authentication & Permissions
    const { hasPermission, isLoading: isAuthLoading } = useAuth();

    // 2. Use Custom Hook for Logic & State
    const {
        state,
        actions,
        permissions
    } = useAnalytics(hasPermission, isAuthLoading);

    return (
        <Sidebar>
            <div className="flex flex-col flex-1 h-full overflow-hidden">
                <ErrorBoundary>
                    <ErrorBoundary>
                        <AnalyticsContent
                            state={state}
                            actions={actions}
                            permissions={permissions}
                        />
                    </ErrorBoundary>
                </ErrorBoundary>
            </div>
        </Sidebar>
    );
};

export default AnalyticsPage;