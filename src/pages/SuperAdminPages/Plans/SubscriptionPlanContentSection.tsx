import React from 'react';
import type { SubscriptionPlan } from '@/api/SuperAdmin';
import PlanDetailHeader from './components/PlanDetailHeader';
import PlanGeneralInfoCard from './components/PlanGeneralInfoCard';
import PlanModulesCard from './components/PlanModulesCard';
import { AlertCircle } from 'lucide-react';
import { ErrorBoundary } from '@/components/ui';

interface SubscriptionPlanContentSectionProps {
    plan: SubscriptionPlan;
    onEdit: () => void;
    onDelete: () => void;
}

const CardErrorFallback = () => (
    <div className="h-full min-h-[200px] flex flex-col items-center justify-center p-6 bg-red-50 rounded-xl border border-red-100 text-center">
        <AlertCircle className="w-8 h-8 text-red-400 mb-2" />
        <p className="text-sm font-medium text-red-800">Failed to load component</p>
        <p className="text-xs text-red-600 mt-1">Please refresh the page</p>
    </div>
);

const SubscriptionPlanContentSection: React.FC<SubscriptionPlanContentSectionProps> = ({
    plan,
    onEdit,
    onDelete
}) => {
    const isCustomPlan = !plan.isSystemPlan;

    return (
        <div className="space-y-6">
            <PlanDetailHeader
                title="Plan Details"
                isCustomPlan={isCustomPlan}
                onEdit={isCustomPlan ? onEdit : undefined}
                onDelete={isCustomPlan ? onDelete : undefined}
            />

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3">
                    <ErrorBoundary fallback={<CardErrorFallback />}>
                        <PlanGeneralInfoCard plan={plan} />
                    </ErrorBoundary>
                </div>
                <div className="lg:col-span-2">
                    <ErrorBoundary fallback={<CardErrorFallback />}>
                        <PlanModulesCard plan={plan} />
                    </ErrorBoundary>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionPlanContentSection;
