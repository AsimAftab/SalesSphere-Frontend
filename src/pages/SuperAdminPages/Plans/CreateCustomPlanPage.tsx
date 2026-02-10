import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCustomPlan } from '@/components/modals/SuperAdmin/CustomPlanModal/hooks/useCustomPlan';
import { useAvailableModules } from './hooks/useAvailableModules';
import { useSubscriptionPlanDetail } from './hooks/useSubscriptionPlanDetail';
import { subscriptionPlanService } from '@/api/SuperAdmin';
import type { SubscriptionPlan } from '@/api/SuperAdmin';
import { Button, LoadingSpinner } from '@/components/ui';
import { DetailPageHeader } from '@/components/ui/PageHeader/PageHeader';
import toast from 'react-hot-toast';
// Sections
import PlanDetailsSection from '@/components/modals/SuperAdmin/CustomPlanModal/components/PlanDetailsSection';
import PricingSection from '@/components/modals/SuperAdmin/CustomPlanModal/components/PricingSection';
import ModulesSelectionSection from '@/components/modals/SuperAdmin/CustomPlanModal/components/ModulesSelectionSection';

const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
};

const CreateCustomPlanPage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const isEditMode = !!id;

    // 1. Fetch Plan Details (if edit mode)
    const { plan: initialPlan, isLoading: isLoadingPlan } = useSubscriptionPlanDetail();

    // 2. Fetch Available Modules & Features
    const { availableModules, featureRegistry, isLoading: isLoadingModules } = useAvailableModules();

    const handleSave = async (planData: Partial<SubscriptionPlan>) => {
        try {
            if (isEditMode && id) {
                await subscriptionPlanService.update(id, planData);
                toast.success('Plan updated successfully');
            } else {
                await subscriptionPlanService.createCustom(planData as unknown as import('@/api/SuperAdmin').CreateSubscriptionPlanData);
                toast.success('Custom plan created successfully');
            }
            navigate('/system-admin/plans');
        } catch (error) {
            console.error('Failed to save plan:', error);
            toast.error(isEditMode ? 'Failed to update plan' : 'Failed to create plan');
        }
    };

    const {
        formData,
        errors,
        isSubmitting,
        handleChange,
        handleModuleToggle,
        handleSelectAll,
        handleDeselectAll,
        handleSubmit,
        handleFeatureToggle
    } = useCustomPlan({
        isOpen: true,
        onClose: () => navigate('/system-admin/plans'),
        onSubmit: handleSave,
        initialPlan,
        availableModules,
        featureRegistry
    });

    const isLoading = (isEditMode && isLoadingPlan) || isLoadingModules;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    // Custom Actions for Header
    const HeaderActions = (
        <div className="flex items-center gap-3">
            <Button
                onClick={handleSubmit}
                isLoading={isSubmitting}
                variant="secondary"
            >
                {isEditMode ? 'Update Plan' : 'Create Plan'}
            </Button>
        </div>
    );

    return (
        <div className="-mx-4 sm:-mx-6 lg:-mx-8 -my-4 lg:-my-6 h-[calc(100vh-4rem)] flex flex-col overflow-hidden bg-gray-50/50">
            {/* Header Section - Fixed */}
            <div className="px-4 sm:px-6 py-6 w-full flex-shrink-0 z-10">
                <DetailPageHeader
                    title={isEditMode ? 'Edit Custom Plan' : 'Create Custom Plan'}
                    subtitle={isEditMode ? 'Update plan configuration and permissions' : 'Configure a new custom subscription plan'}
                    backPath="/system-admin/plans"
                    backLabel="Back to Plans"
                    actions={HeaderActions}
                />
            </div>

            {/* Main Content - Scrollable Area */}
            <div className="flex-1 min-h-0 w-full px-4 sm:px-6 pb-6">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="flex flex-col xl:grid xl:grid-cols-12 gap-6 h-full"
                >
                    {/* LEFT COLUMN: Plan Details & Pricing - Scrollable pane on mobile, full height on desktop */}
                    <div className="xl:col-span-5 flex flex-col justify-between gap-6 overflow-y-auto pr-2 pb-2 h-[45vh] xl:h-full custom-scrollbar flex-shrink-0">
                        {/* Plan Details Card */}
                        <motion.div variants={itemVariants} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex-shrink-0">
                            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
                                <h3 className="font-bold text-gray-900">Plan Details</h3>
                                <p className="text-xs text-gray-500 mt-0.5">Basic information about the plan</p>
                            </div>
                            <div className="p-5">
                                <PlanDetailsSection
                                    formData={formData}
                                    errors={errors}
                                    handleChange={handleChange}
                                />
                            </div>
                        </motion.div>

                        {/* Pricing Card */}
                        <motion.div variants={itemVariants} className="bg-white rounded-xl border border-gray-200 shadow-sm flex-shrink-0">
                            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50 rounded-t-xl">
                                <h3 className="font-bold text-gray-900">Pricing & Limits</h3>
                                <p className="text-xs text-gray-500 mt-0.5">Set the pricing model and constraints</p>
                            </div>
                            <div className="p-5">
                                <PricingSection
                                    formData={formData}
                                    errors={errors}
                                    handleChange={handleChange}
                                />
                            </div>
                        </motion.div>
                    </div>

                    {/* RIGHT COLUMN: Modules & Features - Remaining height on mobile, full height on desktop */}
                    <div className="xl:col-span-7 flex-1 xl:h-full min-h-0">
                        <motion.div variants={itemVariants} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden h-full flex flex-col">
                            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 flex-shrink-0">
                                <div>
                                    <h3 className="font-bold text-gray-900">Modules & Permissions</h3>
                                    <p className="text-xs text-gray-500 mt-0.5">Configure access levels and granular features</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={handleSelectAll}
                                        className="text-xs"
                                    >
                                        Select All
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={handleDeselectAll}
                                        className="text-xs"
                                    >
                                        Deselect All
                                    </Button>
                                </div>
                            </div>
                            <div className="flex-1 p-5 bg-gray-50/30 overflow-y-auto custom-scrollbar">
                                <ModulesSelectionSection
                                    formData={formData}
                                    errors={errors} // Passing errors
                                    handleModuleToggle={handleModuleToggle}
                                    availableModules={availableModules}
                                    featureRegistry={featureRegistry}
                                    handleFeatureToggle={handleFeatureToggle}
                                    disabled={isSubmitting}
                                />
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default CreateCustomPlanPage;
