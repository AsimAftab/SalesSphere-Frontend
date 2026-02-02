import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import CreateLeaveForm from './components/CreateLeaveForm';
import { useLeaveEntity } from './hooks/useLeaveEntity';
import ErrorBoundary from '../../ui/ErrorBoundary/ErrorBoundary';

interface CreateLeaveModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CreateLeaveModal: React.FC<CreateLeaveModalProps> = ({ isOpen, onClose }) => {
    const { form, hasAttemptedSubmit, onSubmit, isPending, reset } = useLeaveEntity({
        onSuccess: onClose
    });

    // Reset form when modal closes
    React.useEffect(() => {
        if (!isOpen) {
            reset();
        }
    }, [isOpen, reset]);

    return (
        <ErrorBoundary>
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
                            className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden z-10"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900">New Leave Request</h3>
                                    <p className="text-sm text-gray-500 mt-0.5">Fill in the details below to request a leave</p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-full text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all duration-200 hover:rotate-90 focus:outline-none"
                                >
                                    <XMarkIcon className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Form */}
                            <div className="max-h-[85vh] overflow-y-auto">
                                <CreateLeaveForm
                                    form={form}
                                    hasAttemptedSubmit={hasAttemptedSubmit}
                                    onSubmit={onSubmit}
                                    isPending={isPending}
                                    onCancel={onClose}
                                />
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </ErrorBoundary>
    );
};

export default CreateLeaveModal;
