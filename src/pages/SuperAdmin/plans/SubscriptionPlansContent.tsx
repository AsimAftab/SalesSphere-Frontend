import React from 'react';
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
    const { systemPlans, customPlans, loading, searchQuery, setSearchQuery, pagination, modalState } = manager;

    if (loading) {
        return <SubscriptionPlansSkeleton />;
    }

    return (
        <div className="space-y-6">
            <SubscriptionPlansHeader
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onCreateClick={modalState.openCreate}
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
                            <SubscriptionPlanCard key={plan._id} plan={plan} />
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
                            <SubscriptionPlanCard key={plan._id} plan={plan} />
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        title={searchQuery ? 'No Results Found' : 'No Custom Plans'}
                        description={searchQuery ? 'No custom plans match your search. Try a different keyword.' : 'No custom plans have been created yet. Create one to get started.'}
                        icon={<Box className="w-12 h-12 text-gray-300" />}
                    />
                )}

                <Pagination
                    currentPage={pagination.currentPage}
                    totalItems={pagination.totalItems}
                    itemsPerPage={pagination.itemsPerPage}
                    onPageChange={pagination.onPageChange}
                />
            </div>
        </div>
    );
};

export default SubscriptionPlansContent;
