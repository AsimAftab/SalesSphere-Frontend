import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { systemUserService, type SystemUser } from '@/api/SuperAdmin/systemUserService';

export const useSystemUserDetails = () => {
    const { id } = useParams<{ id: string }>();

    const {
        data: systemUser,
        isLoading,
        error,
        refetch
    } = useQuery<SystemUser, Error>({
        queryKey: ['systemUser', id],
        queryFn: () => systemUserService.getById(id!),
        enabled: !!id,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    return {
        systemUser,
        isLoading,
        error: error ? (error as Error).message : null,
        refetch
    };
};
