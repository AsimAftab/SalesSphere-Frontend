import React from 'react';
import ErrorBoundary from '../../../components/ui/ErrorBoundary/ErrorBoundary';
import { useAuth } from '../../../api/authService';
import { useDashboard } from './hooks/useDashboard';
import DashboardContent from './DashboardContent';

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
