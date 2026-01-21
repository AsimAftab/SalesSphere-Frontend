import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { createLeave, type CreateLeavePayload } from '../../../../api/leaveService';

export const useCreateLeave = (onSuccess?: () => void) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateLeavePayload) => createLeave(payload),
        onSuccess: () => {
            toast.success('Leave request submitted successfully');
            queryClient.invalidateQueries({ queryKey: ['leaves-admin'] });
            if (onSuccess) onSuccess();
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Failed to submit leave request';
            toast.error(message);
        }
    });
};
