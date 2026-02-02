import React from 'react';
import DashboardHeader from './components/DashboardHeader';
import DashboardStatsGrid from './components/DashboardStats';
import { Loader2 } from 'lucide-react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import type { DashboardStats } from './types';
import { EmptyState, Button } from '@/components/ui';

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
        return (
            <div className="flex h-[calc(100vh-100px)] w-full items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    <p className="text-sm text-slate-500 font-medium">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    // Error State
    if (error) {
        return (
            <div className="p-8 flex items-center justify-center h-[calc(100vh-100px)]">
                <EmptyState
                    title="Dashboard Unavailable"
                    description={error}
                    icon={<ExclamationTriangleIcon className="w-16 h-16 text-red-400" />}
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
        <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <DashboardHeader userName={userName} />

            {/* Stats Grid */}
            <section>
                <DashboardStatsGrid stats={data} />
            </section>
        </div>
    );
};

export default DashboardContent;
