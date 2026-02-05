import React, { Suspense } from 'react';
import { useSubscriptionPlansManager } from './hooks/useSubscriptionPlansManager';
import SubscriptionPlansContent from './SubscriptionPlansContent';
import { ErrorBoundary } from '@/components/ui';

const CustomPlanModal = React.lazy(() => import('@/components/modals/SuperAdmin/CustomPlanModal').then(m => ({ default: m.CustomPlanModal })));

export default function SubscriptionPlansPage() {
    const manager = useSubscriptionPlansManager();

    return (
        <>
            <ErrorBoundary>
                <SubscriptionPlansContent manager={manager} />
            </ErrorBoundary>

            <Suspense fallback={null}>
                <CustomPlanModal
                    isOpen={manager.modalState.isOpen}
                    onClose={manager.modalState.close}
                    onSubmit={manager.actions.handleSave}
                    initialPlan={manager.modalState.editingPlan}
                />
            </Suspense>
        </>
    );
}
