import { useMutation, useQueryClient } from '@tanstack/react-query';
import { LeaveRepository, type LeaveStatus } from '@/api/leaveService';
import toast from 'react-hot-toast';

/**
 * Hook for leave mutations (update status, bulk delete)
 * Single Responsibility: Mutation handling only
 */
export const useLeaveActions = () => {
    const queryClient = useQueryClient();

    const updateStatus = useMutation({
        mutationFn: ({ id, status }: { id: string; status: LeaveStatus }) =>
            LeaveRepository.updateLeaveStatus(id, status),
        onSuccess: () => {
            toast.success("Status Updated and Attendance Synced");

            // Refresh the Leaves list
            queryClient.invalidateQueries({ queryKey: ["leaves-admin"] });

            // Refresh the Attendance data
            queryClient.invalidateQueries({
                queryKey: ["attendance"],
                exact: false
            });
        },
        onError: () => toast.error("Failed to update status")
    });

    const bulkDelete = useMutation({
        mutationFn: (ids: string[]) => LeaveRepository.bulkDeleteLeaves(ids),
        onSuccess: () => {
            toast.success("Selected Items Deleted");
            queryClient.invalidateQueries({ queryKey: ["leaves-admin"] });
        },
        onError: () => toast.error("Failed to delete selected items")
    });

    return {
        updateStatus: (id: string, status: LeaveStatus) => updateStatus.mutate({ id, status }),
        bulkDelete: (ids: string[]) => bulkDelete.mutate(ids),
        isUpdating: updateStatus.isPending,
        isDeleting: bulkDelete.isPending
    };
};
