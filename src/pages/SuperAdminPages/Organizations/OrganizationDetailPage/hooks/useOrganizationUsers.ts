import { useState, useEffect, useCallback } from 'react';
import { fetchOrganizationUsers } from '@/api/SuperAdmin';
import type { OrganizationUser } from '@/api/SuperAdmin';

export const useOrganizationUsers = (orgId: string | undefined) => {
    const [users, setUsers] = useState<OrganizationUser[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetch = useCallback(async () => {
        if (!orgId) return;

        try {
            setIsLoading(true);
            setError(null);
            const data = await fetchOrganizationUsers(orgId);
            setUsers(data);
        } catch (err: unknown) {
            const msg = (err as { response?: { data?: { message?: string } }; message?: string })
                .response?.data?.message || (err as Error).message || 'Failed to fetch users';
            setError(msg);
        } finally {
            setIsLoading(false);
        }
    }, [orgId]);

    useEffect(() => {
        fetch();
    }, [fetch]);

    return { users, isLoading, isError: !!error, error, refetch: fetch };
};
