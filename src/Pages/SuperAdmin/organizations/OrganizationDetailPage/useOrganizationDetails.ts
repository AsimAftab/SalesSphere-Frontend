import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrganizationById, OrganizationMapper } from '../../../../api/SuperAdmin/organizationService';
import type { Organization } from '../../../../api/SuperAdmin/organizationService';
import toast from 'react-hot-toast';

export interface OrganizationDetailsData {
    organization: Organization;
}

export const useOrganizationDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [data, setData] = useState<OrganizationDetailsData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchOrganizationDetails = async () => {
        if (!id) {
            setError('Organization ID is required');
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            const response = await getOrganizationById(id);

            // Map raw API response to frontend model
            // The API returns { success: true, data: { ...org } }
            // OrganizationMapper expects the raw org object
            const mappedOrg = OrganizationMapper.toFrontendModel(response.data);

            setData({
                organization: mappedOrg
            });
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch organization details';
            setError(errorMessage);
            toast.error(errorMessage);

            // If organization not found, redirect back to list
            if (err.response?.status === 404) {
                setTimeout(() => navigate('/system-admin/organizations'), 2000);
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrganizationDetails();
    }, [id]);

    const refetch = () => {
        fetchOrganizationDetails();
    };

    return {
        data,
        isLoading,
        error,
        refetch,
        organizationId: id
    };
};
