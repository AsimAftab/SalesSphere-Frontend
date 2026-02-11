import React from 'react';
import CreateLeaveForm from './components/CreateLeaveForm';
import { useLeaveEntity } from './hooks/useLeaveEntity';
import { FormModal } from '@/components/ui';

import type { LeaveRequest } from '@/api/leaveService';

interface CreateLeaveModalProps {
    isOpen: boolean;
    onClose: () => void;
    leaveToEdit?: LeaveRequest | null;
}

const CreateLeaveModal: React.FC<CreateLeaveModalProps> = ({ isOpen, onClose, leaveToEdit }) => {
    // Transform LeaveRequest to Partial<CreateLeaveFormData>
    const initialValues = leaveToEdit ? {
        id: leaveToEdit.id,
        startDate: leaveToEdit.startDate,
        endDate: leaveToEdit.endDate || '',
        category: leaveToEdit.category,
        reason: leaveToEdit.reason
    } : undefined;

    const { form, hasAttemptedSubmit, onSubmit, isPending, reset, isEditMode } = useLeaveEntity({
        onSuccess: onClose,
        initialValues
    });

    // Reset form when modal closes or mode changes
    React.useEffect(() => {
        if (!isOpen) {
            reset();
        }
    }, [isOpen, reset]); // Removed manual reset on leaveToEdit change, handled in hook

    return (
        <FormModal
            isOpen={isOpen}
            onClose={onClose}
            title={isEditMode ? "Edit Leave Request" : "New Leave Request"}
            description={isEditMode ? "Update the details of your leave request" : "Fill in the details below to request a leave"}
            size="lg"
        >
            <CreateLeaveForm
                form={form}
                hasAttemptedSubmit={hasAttemptedSubmit}
                onSubmit={onSubmit}
                isPending={isPending}
                onCancel={onClose}
                submitLabel={isEditMode ? "Update Request" : "Submit Request"}
            />
        </FormModal>
    );
};

export default CreateLeaveModal;
