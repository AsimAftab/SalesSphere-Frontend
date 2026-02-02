import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import subscriptionPlanService from '@/api/SuperAdmin/subscriptionPlanService';
import type { SubscriptionPlan } from '@/api/SuperAdmin/subscriptionPlanService';
import toast from 'react-hot-toast';

export const useSubscriptionPlanDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [plan, setPlan] = useState<SubscriptionPlan | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPlanDetail = async () => {
        if (!id) {
            setError('Plan ID is required');
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            setError(null);
            const response = await subscriptionPlanService.getById(id);
            setPlan(response.data.data);
        } catch (err: unknown) {
            const axiosErr = err as { response?: { data?: { message?: string }; status?: number }; message?: string };
            const errorMessage = axiosErr.response?.data?.message || axiosErr.message || 'Failed to fetch plan details';
            setError(errorMessage);
            toast.error(errorMessage);

            if (axiosErr.response?.status === 404) {
                setTimeout(() => navigate('/system-admin/plans'), 2000);
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPlanDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    return {
        plan,
        isLoading,
        error,
        refetch: fetchPlanDetail,
        planId: id
    };
};
