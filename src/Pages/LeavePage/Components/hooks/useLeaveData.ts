import { useQuery } from '@tanstack/react-query';
import { LeaveRepository } from '../../../../api/leaveService';

/**
 * Hook for fetching leave data
 * Single Responsibility: Data fetching only
 */
export const useLeaveData = () => {
    const { data: leaves = [], isLoading, error } = useQuery({
        queryKey: ["leaves-admin"],
        queryFn: LeaveRepository.getAllLeaves,
    });

    return {
        leaves,
        isLoading,
        error
    };
};
