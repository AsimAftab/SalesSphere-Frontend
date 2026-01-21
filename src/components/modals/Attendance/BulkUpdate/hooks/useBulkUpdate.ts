import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BulkUpdateSchema, type BulkUpdateFormData } from '../../common/AttendanceSchema';

export const useBulkUpdate = (isOpen: boolean) => {
    const form = useForm<BulkUpdateFormData>({
        resolver: zodResolver(BulkUpdateSchema),
        defaultValues: {
            status: '',
            note: ''
        },
        mode: 'onChange'
    });

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen) {
            form.reset({
                status: '',
                note: ''
            });
        }
    }, [isOpen, form]);

    return {
        form
    };
};
