import { X } from 'lucide-react';
import type { CustomPlanModalProps } from './types';
import { useCustomPlan } from './hooks/useCustomPlan';
import CustomPlanForm from './components/CustomPlanForm';
import { ErrorBoundary } from '@/components/ui';

// eslint-disable-next-line react-refresh/only-export-components
export * from './types';

export function CustomPlanModal(props: CustomPlanModalProps) {
    const { isOpen, initialPlan } = props;
    const {
        formData,
        errors,
        isSubmitting,
        handleChange,
        handleModuleToggle,
        handleSelectAll,
        handleDeselectAll,
        handleSubmit,
        handleClose
    } = useCustomPlan(props);

    if (!isOpen) return null;

    const isEditMode = !!initialPlan;

    return (
        <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]"
            onClick={handleClose}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleClose()}
            role="button"
            tabIndex={0}
        >
            <div
                className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden z-[10000] shadow-2xl flex flex-col border border-gray-100"
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
                role="dialog"
                tabIndex={-1}
            >
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 shrink-0">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                            {isEditMode ? 'Edit Plan' : 'Create Custom Plan'}
                        </h2>
                        <p className="text-sm text-gray-500 mt-0.5">
                            {isEditMode ? 'Update plan configuration' : 'Configure a new subscription plan'}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="p-2 rounded-full text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all duration-200 hover:rotate-90 focus:outline-none"
                        aria-label="Close modal"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Form */}
                <div className="flex flex-col min-h-0 flex-1">
                    <ErrorBoundary>
                        <CustomPlanForm
                            formData={formData}
                            errors={errors}
                            isSubmitting={isSubmitting}
                            handleChange={handleChange}
                            handleModuleToggle={handleModuleToggle}
                            handleSelectAll={handleSelectAll}
                            handleDeselectAll={handleDeselectAll}
                            handleSubmit={handleSubmit}
                            handleClose={handleClose}
                            isEditMode={isEditMode}
                        />
                    </ErrorBoundary>
                </div>
            </div>
        </div>
    );
}

export default CustomPlanModal;
