import React, { useState } from 'react';
import EmployeeForm from './components/EmployeeForm';
import { useEmployeeForm } from './hooks/useEmployeeForm';
import type { Employee } from '@/api/employeeService';
import type { SystemUser } from '@/api/SuperAdmin';
import { FormModal, Button } from '@/components/ui';


interface EmployeeModalProps {
    isOpen: boolean;
    onClose: () => void;
    mode: 'add' | 'edit';
    variant?: 'employee' | 'system-user';
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
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    React.useEffect(() => {
        if (isOpen) {
            resetForm();
        }
    }, [isOpen, resetForm]);

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
        if ('avatarUrl' in initialData) return initialData.avatarUrl;
        if ('avatar' in initialData) return initialData.avatar;
        return undefined;
    };

    const footer = (
        <div className="flex justify-end gap-3 w-full">
            <Button
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
                type="button"
                className="text-gray-700 bg-white border-gray-300 hover:bg-gray-50 font-medium"
            >
                Cancel
            </Button>
            <Button
                variant="secondary"
                type="submit"
                form="employee-form"
                isLoading={isSubmitting}
            >
                {mode === 'add'
                    ? (variant === 'employee' ? 'Add Employee' : 'Add System User')
                    : 'Save Changes'}
            </Button>
        </div>
    );

    return (
        <FormModal
            isOpen={isOpen}
            onClose={onClose}
            title={getTitle()}
            description={getDescription()}
            size="lg"
            footer={footer}
        >
            <EmployeeForm
                form={form}
                roles={roles}
                isLoadingRoles={isLoadingRoles}
                onSubmit={submitHandler}
                mode={mode}
                variant={variant}
                initialAvatarUrl={getAvatarUrl()}
            />
        </FormModal>
    );
};

export default EmployeeModal;
