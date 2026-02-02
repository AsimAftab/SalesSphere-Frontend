import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import {
    getBeatPlans,
    deleteBeatPlan,
} from '../../../api/beatPlanService';
import type { BeatPlan, GetBeatPlansOptions } from '@/api/beatPlanService';

interface UseAssignedBeatPlansReturn {
    beatPlans: BeatPlan[];
    loading: boolean;
    error: string | null;
    totalPlans: number;
    currentPage: number;
    itemsPerPage: number;
    totalPages: number;
    setCurrentPage: (page: number) => void;
    refreshPlans: () => Promise<void>;
    handleDeletePlan: (id: string) => Promise<void>;
}

export const useAssignedBeatPlans = (
    initialStatus?: 'pending' | 'active' | 'completed'
): UseAssignedBeatPlansReturn => {
    const [beatPlans, setBeatPlans] = useState<BeatPlan[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [totalPlans, setTotalPlans] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage] = useState<number>(10);
    const [totalPages, setTotalPages] = useState<number>(0);

    const fetchPlans = useCallback(async (page: number) => {
        try {
            setLoading(true);
            setError(null);

            const options: GetBeatPlansOptions = {
                page,
                limit: itemsPerPage,
                status: initialStatus,
            };

            const response = await getBeatPlans(options);

            if (response.success) {
                setBeatPlans(response.data);
                setTotalPlans(response.pagination?.total ?? 0);
                setTotalPages(response.pagination?.pages ?? 1);
            } else {
                setError('Failed to fetch beat plans');
            }
        } catch (err: unknown) {
            console.error('Error fetching beat plans:', err);
            setError(err instanceof Error ? err.message : 'An unexpected error occurred');
            toast.error('Failed to load beat plans');
        } finally {
            setLoading(false);
        }
    }, [itemsPerPage, initialStatus]);

    useEffect(() => {
        fetchPlans(currentPage);
    }, [currentPage, fetchPlans]);

    const refreshPlans = async () => {
        await fetchPlans(currentPage);
    };

    const handleDeletePlan = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this beat plan assignment?')) return;

        try {
            const response = await deleteBeatPlan(id);
            if (response.success) {
                toast.success('Beat plan assignment deleted successfully');
                if (beatPlans.length === 1 && currentPage > 1) {
                    setCurrentPage(prev => prev - 1);
                } else {
                    refreshPlans();
                }
            }
        } catch (err: unknown) {
            console.error('Error deleting beat plan:', err);
            toast.error(err instanceof Error ? err.message : 'Failed to delete beat plan');
        }
    };

    return {
        beatPlans,
        loading,
        error,
        totalPlans,
        currentPage,
        itemsPerPage,
        totalPages,
        setCurrentPage,
        refreshPlans,
        handleDeletePlan,
    };
};
