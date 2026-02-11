import { useMutation, useQueryClient } from '@tanstack/react-query';
import { LeaveRepository, type LeaveStatus, type LeaveRequest, type CreateLeavePayload } from '@/api/leaveService';
import toast from 'react-hot-toast';

/**
 * Hook for leave mutations (update status, bulk delete)
 * Single Responsibility: Mutation handling only
 * Uses optimistic updates for instant UI feedback
 */
export const useLeaveActions = () => {
    const queryClient = useQueryClient();

    const updateStatus = useMutation({
        mutationFn: ({ id, status }: { id: string; status: LeaveStatus }) =>
            LeaveRepository.updateLeaveStatus(id, status),

        // Optimistic update
        onMutate: async ({ id, status }) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: ["leaves-admin"] });

            // Snapshot previous value
            const previousLeaves = queryClient.getQueryData<LeaveRequest[]>(["leaves-admin"]);

            // Optimistically update the leave status
            if (previousLeaves) {
                queryClient.setQueryData<LeaveRequest[]>(["leaves-admin"],
                    previousLeaves.map(leave =>
                        leave.id === id ? { ...leave, status } : leave
                    )
                );
            }

            return { previousLeaves };
        },

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

        onError: (_error, _variables, context) => {
            // Rollback on error
            if (context?.previousLeaves) {
                queryClient.setQueryData(["leaves-admin"], context.previousLeaves);
            }
            toast.error("Failed to update status");
        }
    });

    const bulkDelete = useMutation({
        mutationFn: (ids: string[]) => LeaveRepository.bulkDeleteLeaves(ids),

        // Optimistic delete
        onMutate: async (ids) => {
            await queryClient.cancelQueries({ queryKey: ["leaves-admin"] });

            const previousLeaves = queryClient.getQueryData<LeaveRequest[]>(["leaves-admin"]);

            if (previousLeaves) {
                queryClient.setQueryData<LeaveRequest[]>(["leaves-admin"],
                    previousLeaves.filter(leave => !ids.includes(leave.id))
                );
            }

            return { previousLeaves };
        },

        onSuccess: () => {
            toast.success("Selected Items Deleted");
            queryClient.invalidateQueries({ queryKey: ["leaves-admin"] });
        },

        onError: (_error, _variables, context) => {
            if (context?.previousLeaves) {
                queryClient.setQueryData(["leaves-admin"], context.previousLeaves);
            }
            toast.error("Failed to delete selected items");
        }
    });

    const updateLeave = useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: Partial<CreateLeavePayload> }) =>
            LeaveRepository.updateLeave(id, payload),
        onSuccess: () => {
            toast.success("Leave Request Updated");
            queryClient.invalidateQueries({ queryKey: ["leaves-admin"] });
        },
        onError: () => toast.error("Failed to update leave request")
    });

    const deleteLeave = useMutation({
        mutationFn: (id: string) => LeaveRepository.deleteLeave(id),
        onSuccess: () => {
            toast.success("Leave Request Deleted");
            queryClient.invalidateQueries({ queryKey: ["leaves-admin"] });
        },
        onError: () => toast.error("Failed to delete leave request")
    });

    return {
        updateStatus: (id: string, status: LeaveStatus) => updateStatus.mutate({ id, status }),
        bulkDelete: (ids: string[]) => bulkDelete.mutate(ids),
        updateLeave: (id: string, payload: Partial<CreateLeavePayload>) => updateLeave.mutateAsync({ id, payload }),
        deleteLeave: (id: string) => deleteLeave.mutateAsync(id),
        isUpdating: updateStatus.isPending || updateLeave.isPending,
        isDeleting: bulkDelete.isPending || deleteLeave.isPending
    };
};
