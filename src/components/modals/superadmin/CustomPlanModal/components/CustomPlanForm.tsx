import React from 'react';
import { Crown, IndianRupee, Box } from 'lucide-react';
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
    isEditMode?: boolean;
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
    handleClose,
    isEditMode = false
}) => {
    return (
        <form onSubmit={handleSubmit} className="flex flex-col min-h-0 flex-1">
            <div className="flex-1 overflow-y-auto min-h-0 p-6 space-y-6">
                {/* Plan Details Section */}
                <div>
                    <div className="pb-3 mb-4 border-b border-gray-200">
                        <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                            <Crown className="w-4.5 h-4.5 text-blue-600" />
                            Plan Details
                        </h3>
                    </div>
                    <PlanDetailsSection
                        formData={formData}
                        errors={errors}
                        handleChange={handleChange}
                    />
                </div>

                {/* Pricing Section */}
                <div>
                    <div className="pb-3 mb-4 border-b border-gray-200">
                        <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                            <IndianRupee className="w-4.5 h-4.5 text-blue-600" />
                            Pricing & Capacity
                        </h3>
                    </div>
                    <PricingSection
                        formData={formData}
                        errors={errors}
                        handleChange={handleChange}
                    />
                </div>

                {/* Modules Section */}
                <div>
                    <div className="pb-3 mb-4 border-b border-gray-200">
                        <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                            <Box className="w-4.5 h-4.5 text-blue-600" />
                            Modules
                        </h3>
                    </div>
                    <ModulesSelectionSection
                        formData={formData}
                        errors={errors}
                        handleModuleToggle={handleModuleToggle}
                        handleSelectAll={handleSelectAll}
                        handleDeselectAll={handleDeselectAll}
                    />
                </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 shrink-0">
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
                    {isSubmitting ? 'Saving...' : isEditMode ? 'Update Plan' : 'Create Plan'}
                </Button>
            </div>
        </form>
    );
};

export default CustomPlanForm;
