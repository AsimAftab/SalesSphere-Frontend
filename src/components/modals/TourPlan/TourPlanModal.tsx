import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TourPlanForm from './components/TourPlanForm';
import { useTourPlanEntity } from './hooks/useTourPlanEntity';
import { type TourPlan, type CreateTourRequest } from '@/api/tourPlanService';
import { ErrorBoundary } from '@/components/ui';
import { X } from 'lucide-react';

interface TourPlanModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (formData: CreateTourRequest) => Promise<void>;
    initialData?: TourPlan | null;
    isSaving: boolean;
}

const TourPlanModal: React.FC<TourPlanModalProps> = ({
    isOpen,
    onClose,
    onSave,
    initialData,
    isSaving
}) => {
    const isEditMode = !!initialData;

    const { form, onSubmit } = useTourPlanEntity({
        isOpen,
        initialData,
        onSave,
    });

    return (
        <ErrorBoundary>
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={onClose}
                            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                        />

                        {/* Modal Content */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex-shrink-0">
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900">
                                        {isEditMode ? 'Edit Tour Plan' : 'Create Tour Plan'}
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-0.5">
                                        {isEditMode ? 'Update the tour plan details' : 'Plan a new business tour visit'}
                                    </p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-full text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all duration-200 hover:rotate-90 focus:outline-none"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Form */}
                            <div className="overflow-y-auto flex-1">
                                <TourPlanForm
                                    form={form}
                                    onSubmit={onSubmit}
                                    isSaving={isSaving}
                                    onCancel={onClose}
                                    isEditMode={isEditMode}
                                />
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </ErrorBoundary>
    );
};

export default TourPlanModal;
