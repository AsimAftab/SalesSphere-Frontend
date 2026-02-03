import React from 'react';
import DashboardHeader from './components/DashboardHeader';
import DashboardStatsGrid from './components/DashboardStats';
import DashboardSkeleton from './components/DashboardSkeleton';
import RoleDistributionChart from './components/RoleDistributionChart';
import OrganizationOverviewChart from './components/OrganizationOverviewChart';
import type { DashboardStats } from './types';
import { EmptyState, Button } from '@/components/ui';
import { AlertTriangle } from 'lucide-react';

interface DashboardContentProps {
    data: DashboardStats | null;
    loading: boolean;
    error: string | null;
    userName: string;
    onRetry: () => void;
}

const DashboardContent: React.FC<DashboardContentProps> = ({
    data,
    loading,
    error,
    userName,
    onRetry
}) => {
    // Loading State
    if (loading) {
        return <DashboardSkeleton />;
    }

    // Error State
    if (error) {
        return (
            <div className="p-8 flex items-center justify-center h-[calc(100vh-100px)]">
                <EmptyState
                    title="Dashboard Unavailable"
                    description={error}
                    icon={<AlertTriangle className="w-16 h-16 text-red-400" />}
                    action={
                        <Button
                            variant="primary"
                            onClick={onRetry}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            Try Again
                        </Button>
                    }
                />
            </div>
        );
    }

    // Empty Data State
    if (!data) {
        return null; // Should ideally not happen if loading/error are handled
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <DashboardHeader userName={userName} />

            {/* Stats Grid */}
            <section>
                <DashboardStatsGrid stats={data} />
            </section>

            {/* Charts */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RoleDistributionChart roleDistribution={data.users.roleDistribution} />
                <OrganizationOverviewChart organizations={data.organizations} />
            </section>
        </div>
    );
};

export default DashboardContent;
