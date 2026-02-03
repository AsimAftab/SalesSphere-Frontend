import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import EmployeeForm from './components/EmployeeForm';
import { useEmployeeForm } from './hooks/useEmployeeForm';
import type { Employee } from '@/api/employeeService';
import type { SystemUser } from '@/api/SuperAdmin/systemUserService';
import { ErrorBoundary, Button } from '@/components/ui';

interface EmployeeModalProps {
    isOpen: boolean;
    onClose: () => void;
    mode: 'add' | 'edit';
    variant?: 'employee' | 'system-user'; // New prop
    initialData?: Employee | SystemUser;
    onSave: (formData: FormData, customRoleId: string, documentFiles?: File[]) => Promise<void>;
}

const EmployeeModal: React.FC<EmployeeModalProps> = ({
    isOpen,
    onClose,
    mode,
    variant = 'employee',
    initialData,
    onSave
}) => {
    // UI state for loading handling wrapper
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Wrapper for onSave to handle loading state in UI
    const handleSaveWrapper = async (formData: FormData, customRoleId: string, documentFiles?: File[]) => {
        setIsSubmitting(true);
        try {
            await onSave(formData, customRoleId, documentFiles);
        } finally {
            setIsSubmitting(false);
        }
    };

    const { form, roles, isLoadingRoles, submitHandler, resetForm } = useEmployeeForm({
        mode,
        variant,
        initialData,
        onSave: handleSaveWrapper,
        onSuccess: onClose
    });

    // Reset form when modal opens to ensure fresh state (especially for documents)
    React.useEffect(() => {
        if (isOpen) {
            resetForm();
        }
    }, [isOpen, resetForm]);

    // Dynamic Title based on Variant
    const getTitle = () => {
        const noun = variant === 'employee' ? 'Employee' : 'System User';
        return mode === 'add' ? `Add New ${noun}` : `Edit ${noun}`;
    };

    const getDescription = () => {
        return mode === 'add'
            ? 'Enter details to add a new member.'
            : 'Update the information.';
    };

    const getAvatarUrl = () => {
        if (!initialData) return undefined;

        if ('avatarUrl' in initialData) {
            return initialData.avatarUrl;
        }

        if ('avatar' in initialData) {
            return initialData.avatar;
        }

        return undefined;
    };

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
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
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
                                    <h3 className="text-xl font-semibold text-gray-900">
                                        {getTitle()}
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-0.5">
                                        {getDescription()}
                                    </p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={onClose}
                                    className="p-2 rounded-full text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all duration-200 hover:rotate-90 focus:outline-none"
                                >
                                    <X className="w-6 h-6" />
                                </Button>
                            </div>

                            {/* Form Container - Scrollable like LeaveModal */}
                            <div className="max-h-[85vh] overflow-y-auto">
                                <EmployeeForm
                                    form={form}
                                    roles={roles}
                                    isLoadingRoles={isLoadingRoles}
                                    onSubmit={submitHandler}
                                    onCancel={onClose}
                                    isSubmitting={isSubmitting}
                                    mode={mode}
                                    variant={variant}
                                    initialAvatarUrl={getAvatarUrl()}
                                />
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </ErrorBoundary>
    );
};

export default EmployeeModal;
