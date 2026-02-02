import React from 'react';
import PlanDetailsSection from './PlanDetailsSection';
import PricingSection from './PricingSection';
import ModulesSelectionSection from './ModulesSelectionSection';
import type { PlanFormData, ChangeHandler } from '../types';
import { Button } from '@/components/ui';

interface CustomPlanFormProps {
    formData: PlanFormData;
    errors: Record<string, string>;
    isSubmitting: boolean;
    handleChange: ChangeHandler;
    handleModuleToggle: (moduleId: string) => void;
    handleSelectAll: () => void;
    handleDeselectAll: () => void;
    handleSubmit: (e: React.FormEvent) => void;
    handleClose: () => void;
}

const CustomPlanForm: React.FC<CustomPlanFormProps> = ({
    formData,
    errors,
    isSubmitting,
    handleChange,
    handleModuleToggle,
    handleSelectAll,
    handleDeselectAll,
    handleSubmit,
    handleClose
}) => {
    return (
        <form onSubmit={handleSubmit} className="flex flex-col h-full bg-slate-50/30">
            <div className="p-8 space-y-8">
                {/* Core Details Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-6">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide border-b border-gray-100 pb-2">Plan Essentials</h3>
                    <PlanDetailsSection
                        formData={formData}
                        errors={errors}
                        handleChange={handleChange}
                    />

                    <PricingSection
                        formData={formData}
                        errors={errors}
                        handleChange={handleChange}
                    />
                </div>

                {/* Modules Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                    <ModulesSelectionSection
                        formData={formData}
                        errors={errors}
                        handleModuleToggle={handleModuleToggle}
                        handleSelectAll={handleSelectAll}
                        handleDeselectAll={handleDeselectAll}
                    />
                </div>
            </div>

            {/* Footer Buttons */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 flex-shrink-0">
                <Button
                    variant="outline"
                    type="button"
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="text-gray-700 bg-white border-gray-300 hover:bg-gray-50 font-medium"
                >
                    Cancel
                </Button>
                <Button
                    variant="secondary"
                    type="submit"
                    isLoading={isSubmitting}
                >
                    {isSubmitting ? "Creating..." : "Create Custom Plan"}
                </Button>
            </div>
        </form>
    );
};

export default CustomPlanForm;
