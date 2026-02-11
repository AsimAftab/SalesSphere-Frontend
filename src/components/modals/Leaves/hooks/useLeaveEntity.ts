import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createLeaveSchema, type CreateLeaveFormData } from '../common/CreateLeaveSchema';
import { useCreateLeave } from './useCreateLeave';
import { useLeaveActions } from '@/pages/LeavePage/hooks/useLeaveActions';
import type { CreateLeavePayload } from '@/api/leaveService';

interface UseLeaveEntityProps {
    onSuccess: () => void;
    initialValues?: Partial<CreateLeaveFormData> & { id?: string };
}

export const useLeaveEntity = ({ onSuccess, initialValues }: UseLeaveEntityProps) => {
    const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
    const isEditMode = !!initialValues?.id;

    const form = useForm<CreateLeaveFormData>({
        resolver: zodResolver(createLeaveSchema),
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        defaultValues: {
            startDate: '',
            endDate: '',
            category: '',
            reason: '',
            ...initialValues
        }
    });

    const { reset } = form;
    const { mutate: createLeave, isPending: isCreating } = useCreateLeave(onSuccess);
    const { updateLeave, isUpdating } = useLeaveActions();

    const onSubmit = (data: CreateLeaveFormData) => {
        if (isEditMode && initialValues?.id) {
            updateLeave(initialValues.id, data as Partial<CreateLeavePayload>).then(onSuccess);
        } else {
            createLeave(data);
        }
    };

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        setHasAttemptedSubmit(true);
        form.handleSubmit(onSubmit)();
    };

    // Reset form when component mounts or initialValues change
    useEffect(() => {
        reset({
            startDate: '',
            endDate: '',
            category: '',
            reason: '',
            ...initialValues
        });
        setHasAttemptedSubmit(false);
    }, [initialValues, reset]);

    return {
        form,
        hasAttemptedSubmit,
        onSubmit: handleSubmit,
        isPending: isCreating || isUpdating,
        reset,
        isEditMode
    };
};
