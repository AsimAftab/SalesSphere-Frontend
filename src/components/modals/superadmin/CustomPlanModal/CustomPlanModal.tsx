import { X } from 'lucide-react';
import ErrorBoundary from '../../../ui/ErrorBoundary/ErrorBoundary';
import type { CustomPlanModalProps } from './types';
import { useCustomPlan } from './hooks/useCustomPlan';
import CustomPlanForm from './components/CustomPlanForm';

// eslint-disable-next-line react-refresh/only-export-components
export * from './types';

export function CustomPlanModal(props: CustomPlanModalProps) {
    const { isOpen } = props;
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

    return (
        <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-[9999] transition-opacity duration-300"
            onClick={handleClose}
        >
            <div
                className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden z-[10000] shadow-2xl flex flex-col transform transition-all duration-300 scale-100 border border-gray-100"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50/80 to-white sticky top-0 z-10 backdrop-blur-md">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 tracking-tight">Create Custom Plan</h2>
                        <p className="text-xs text-gray-500 mt-0.5 font-medium">Configure a tailored subscription package</p>
                    </div>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="p-2 rounded-full text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all duration-200 hover:rotate-90 focus:outline-none focus:ring-2 focus:ring-red-100"
                        aria-label="Close modal"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Form */}
                <div className="flex-1 overflow-y-auto">
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
                        />
                    </ErrorBoundary>
                </div>
            </div>
        </div>
    );
}

export default CustomPlanModal;
