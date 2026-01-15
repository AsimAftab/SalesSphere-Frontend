import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { updateSingleAttendance, updateBulkAttendance } from '../../../api/attendanceService';


export const useAttendanceActions = (selectedMonth: string, currentYear: number) => {
    const queryClient = useQueryClient();

    const singleUpdateMutation = useMutation({
        mutationFn: updateSingleAttendance,
        onSuccess: (_, variables) => {
            toast.success('Attendance updated successfully!');
            queryClient.invalidateQueries({
                queryKey: ['attendance', selectedMonth, currentYear],
            });
            // Also invalidate detail view if needed
            queryClient.invalidateQueries({
                queryKey: ['attendanceDetail', variables.employeeId]
            });
        },
        onError: (err: any) => {
            toast.error(`Update failed: ${err.response?.data?.message || err.message}`);
        },
    });

    const bulkUpdateMutation = useMutation({
        mutationFn: updateBulkAttendance,
        onSuccess: () => {
            toast.success('Bulk update successful!');
            queryClient.invalidateQueries({
                queryKey: ['attendance', selectedMonth, currentYear],
            });
        },
        onError: (err: any) => {
            toast.error(`Update failed: ${err.response?.data?.message || err.message}`);
        },
    });

    return {
        singleUpdateMutation,
        bulkUpdateMutation,
        isUpdating: singleUpdateMutation.isPending || bulkUpdateMutation.isPending,
    };
};
