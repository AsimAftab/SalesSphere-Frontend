import React from 'react';
import CreateLeaveForm from './components/CreateLeaveForm';
import { useLeaveEntity } from './hooks/useLeaveEntity';
import { FormModal } from '@/components/ui';

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
        <FormModal
            isOpen={isOpen}
            onClose={onClose}
            title="New Leave Request"
            description="Fill in the details below to request a leave"
            size="lg"
        >
            <CreateLeaveForm
                form={form}
                hasAttemptedSubmit={hasAttemptedSubmit}
                onSubmit={onSubmit}
                isPending={isPending}
                onCancel={onClose}
            />
        </FormModal>
    );
};

export default CreateLeaveModal;
