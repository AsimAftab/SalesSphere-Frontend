import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createLeaveSchema, type CreateLeaveFormData } from '../common/CreateLeaveSchema';
import { useCreateLeave } from './useCreateLeave';

interface UseLeaveEntityProps {
    onSuccess: () => void;
}

export const useLeaveEntity = ({ onSuccess }: UseLeaveEntityProps) => {
    const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

    const form = useForm<CreateLeaveFormData>({
        resolver: zodResolver(createLeaveSchema),
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        defaultValues: {
            startDate: '',
            endDate: '',
            category: 'sick_leave',
            reason: ''
        }
    });

    const { reset } = form;
    const { mutate: createLeave, isPending } = useCreateLeave(onSuccess);

    const onSubmit = (data: CreateLeaveFormData) => {
        setHasAttemptedSubmit(true);
        createLeave(data);
    };

    // Reset form when component mounts to clear any stale validation errors
    useEffect(() => {
        reset();
        setHasAttemptedSubmit(false);
    }, [reset]);

    return {
        form,
        hasAttemptedSubmit,
        onSubmit: form.handleSubmit(onSubmit),
        isPending,
        reset
    };
};
