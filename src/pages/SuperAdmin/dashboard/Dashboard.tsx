import React from 'react';
import { useAuth } from '@/api/authService';
import { useDashboard } from './hooks/useDashboard';
import DashboardContent from './DashboardContent';
import { ErrorBoundary } from '@/components/ui';

const Dashboard: React.FC = () => {
    const { user } = useAuth();
    const { data, isLoading, error, refetch } = useDashboard();

    return (
        <ErrorBoundary>
            <DashboardContent
                data={data}
                loading={isLoading}
                error={error}
                userName={user?.name || 'Super Admin'}
                onRetry={refetch}
            />
        </ErrorBoundary>
    );
};

export default Dashboard;
