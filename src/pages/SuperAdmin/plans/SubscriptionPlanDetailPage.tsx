import React, { useState, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscriptionPlanDetail } from './hooks/useSubscriptionPlanDetail';
import SubscriptionPlanContentSection from './SubscriptionPlanContentSection';
import SubscriptionPlanDetailSkeleton from './components/SubscriptionPlanDetailSkeleton';
import subscriptionPlanService from '@/api/SuperAdmin/subscriptionPlanService';
import type { SubscriptionPlan } from '@/api/SuperAdmin/subscriptionPlanService';
import { AlertCircle } from 'lucide-react';
import { ErrorBoundary, Button, EmptyState } from '@/components/ui';
import ConfirmationModal from '@/components/modals/CommonModals/ConfirmationModal';
import toast from 'react-hot-toast';

const CustomPlanModal = React.lazy(() => import('@/components/modals/superadmin/CustomPlanModal').then(m => ({ default: m.CustomPlanModal })));

const SubscriptionPlanDetailPage: React.FC = () => {
    const { plan, isLoading, error, refetch } = useSubscriptionPlanDetail();
    const navigate = useNavigate();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const handleEdit = () => {
        setIsEditModalOpen(true);
    };

    const handleSave = async (planData: Partial<SubscriptionPlan>) => {
        if (!plan?._id) return;
        try {
            await subscriptionPlanService.update(plan._id, planData);
            toast.success('Plan updated successfully');
            refetch();
            setIsEditModalOpen(false);
        } catch {
            toast.error('Failed to update plan');
        }
    };

    const handleDelete = async () => {
        if (!plan?._id) return;
        try {
            await subscriptionPlanService.delete(plan._id);
            toast.success('Plan deleted successfully');
            navigate('/system-admin/plans');
        } catch {
            toast.error('Failed to delete plan');
        }
    };

    return (
        <ErrorBoundary>
            {isLoading && <SubscriptionPlanDetailSkeleton />}

            {error && !isLoading && (
                <div className="py-8">
                    <EmptyState
                        title="Error Loading Plan"
                        description={error}
                        icon={<AlertCircle className="w-16 h-16 text-red-500" />}
                        action={
                            <Button
                                variant="outline"
                                onClick={refetch}
                                className="bg-white hover:bg-gray-50 text-gray-700 border-gray-300"
                            >
                                Try Again
                            </Button>
                        }
                    />
                </div>
            )}

            {plan && !isLoading && !error && (
                <>
                    <SubscriptionPlanContentSection
                        plan={plan}
                        onEdit={handleEdit}
                        onDelete={() => setIsDeleteModalOpen(true)}
                    />

                    <Suspense fallback={null}>
                        <CustomPlanModal
                            isOpen={isEditModalOpen}
                            onClose={() => setIsEditModalOpen(false)}
                            onSubmit={handleSave}
                            initialPlan={plan}
                        />
                    </Suspense>

                    <ConfirmationModal
                        isOpen={isDeleteModalOpen}
                        onCancel={() => setIsDeleteModalOpen(false)}
                        onConfirm={handleDelete}
                        title="Delete Plan"
                        message={`Are you sure you want to delete "${plan.name}"? This action cannot be undone.`}
                        confirmButtonText="Delete"
                        confirmButtonVariant="danger"
                        cancelButtonText="Cancel"
                    />
                </>
            )}
        </ErrorBoundary>
    );
};

export default SubscriptionPlanDetailPage;
