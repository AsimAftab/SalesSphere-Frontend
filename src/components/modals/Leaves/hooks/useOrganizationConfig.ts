import { useQuery } from '@tanstack/react-query';
import { fetchMyOrganization } from '../../../../api/superAdmin/organizationService';

export interface OrganizationConfig {
    weeklyOffDay: string;
    timezone?: string;
}

/**
 * Hook to fetch organization configuration including weekly off day
 * Used to validate and restrict date selection in leave forms
 */
export const useOrganizationConfig = () => {
    return useQuery<OrganizationConfig>({
        queryKey: ['organization-config'],
        queryFn: async () => {
            const response = await fetchMyOrganization();
            return {
                weeklyOffDay: response.data.weeklyOffDay || 'Saturday',
                timezone: response.data.timezone
            };
        },
        staleTime: 1000 * 60 * 30, // Cache for 30 minutes
        retry: 1
    });
};
