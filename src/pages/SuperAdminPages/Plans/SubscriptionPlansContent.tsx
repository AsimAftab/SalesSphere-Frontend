import React from 'react';
import { useNavigate } from 'react-router-dom';
import SubscriptionPlansHeader from './components/SubscriptionPlansHeader';
import SubscriptionPlanCard from './components/SubscriptionPlanCard';
import { SubscriptionPlansSkeleton } from './components/SubscriptionPlansSkeleton';
import { Pagination, EmptyState } from '@/components/ui';
import type { useSubscriptionPlansManager } from './hooks/useSubscriptionPlansManager';
import { Box } from 'lucide-react';

interface SubscriptionPlansContentProps {
    manager: ReturnType<typeof useSubscriptionPlansManager>;
}

const SubscriptionPlansContent: React.FC<SubscriptionPlansContentProps> = ({ manager }) => {
    const navigate = useNavigate();
    const { systemPlans, customPlans, loading, searchQuery, setSearchQuery, pagination } = manager;

    const handleCreateCustom = () => {
        navigate('/system-admin/plans/create');
    };

    const handleEdit = (plan: import('@/api/SuperAdmin').SubscriptionPlan) => {
        navigate(`/system-admin/plans/${plan._id}/edit`);
    };

    if (loading) {
        return <SubscriptionPlansSkeleton />;
    }

    return (
        <div className="space-y-6">
            <SubscriptionPlansHeader
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onCreateClick={handleCreateCustom}
            />

            {/* System Plans Section */}
            {systemPlans.length > 0 && (
                <div className="space-y-3">
                    <div className="flex items-center gap-3 px-1">
                        <h2 className="text-lg font-bold text-[#202224]">System Plans</h2>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200">
                            <Box className="h-5 w-5 text-blue-600" />
                            <span className="text-sm font-bold text-blue-700">{systemPlans.length}</span>
                        </div>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {systemPlans.map((plan) => (
                            <SubscriptionPlanCard key={plan._id} plan={plan} onEdit={handleEdit} />
                        ))}
                    </div>
                </div>
            )}

            {/* Custom Plans Section */}
            <div className="space-y-3">
                <div className="flex items-center gap-3 px-1">
                    <h2 className="text-lg font-bold text-[#202224]">Custom Plans</h2>
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-50 border border-purple-200">
                        <Box className="h-5 w-5 text-purple-600" />
                        <span className="text-sm font-bold text-purple-700">{customPlans.totalItems}</span>
                    </div>
                </div>

                {customPlans.paginatedData.length > 0 ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {customPlans.paginatedData.map((plan) => (
                            <SubscriptionPlanCard key={plan._id} plan={plan} onEdit={handleEdit} />
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        title={searchQuery ? 'No Results Found' : 'No Custom Plans'}
                        description={searchQuery ? 'No custom plans match your current filters. Try adjusting your search criteria.' : 'No custom plans have been created yet. Create one to get started.'}
                        icon={<Box className="w-12 h-12 text-gray-300" />}
                    />
                )}

                <div className="mt-4">
                    <Pagination
                        currentPage={pagination.currentPage}
                        totalItems={pagination.totalItems}
                        itemsPerPage={pagination.itemsPerPage}
                        onPageChange={pagination.onPageChange}
                    />
                </div>
            </div>
        </div>
    );
};

export default SubscriptionPlansContent;
