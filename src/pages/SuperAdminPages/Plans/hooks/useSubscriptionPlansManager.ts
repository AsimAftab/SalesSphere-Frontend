import { useState, useEffect, useCallback, useMemo } from 'react';
import subscriptionPlanService from '@/api/SuperAdmin/subscriptionPlanService';
import type { SubscriptionPlan } from '@/api/SuperAdmin/subscriptionPlanService';
import toast from 'react-hot-toast';

const ITEMS_PER_PAGE = 6;

export const useSubscriptionPlansManager = () => {
    const [systemPlans, setSystemPlans] = useState<SubscriptionPlan[]>([]);
    const [customPlans, setCustomPlans] = useState<SubscriptionPlan[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);

    const fetchPlans = useCallback(async () => {
        try {
            setLoading(true);
            const [allRes, customRes] = await Promise.all([
                subscriptionPlanService.getAll(),
                subscriptionPlanService.getCustomPlans()
            ]);

            const allPlans = allRes || [];
            const tierOrder: Record<string, number> = { basic: 0, standard: 1, premium: 2 };
            const sorted = allPlans
                .filter((p: SubscriptionPlan) => p.isSystemPlan)
                .sort((a: SubscriptionPlan, b: SubscriptionPlan) => (tierOrder[a.tier] ?? 3) - (tierOrder[b.tier] ?? 3));
            setSystemPlans(sorted);
            setCustomPlans(customRes || []);
        } catch {
            toast.error('Failed to load subscription plans');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPlans();
    }, [fetchPlans]);

    // Search filtering (custom plans only)
    const filteredCustomPlans = useMemo(() => {
        if (!searchQuery.trim()) return customPlans;
        const q = searchQuery.toLowerCase();
        return customPlans.filter(p => p.name.toLowerCase().includes(q));
    }, [customPlans, searchQuery]);

    // Pagination
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedCustomPlans = filteredCustomPlans.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    // Reset page when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    // Modal actions
    const openCreate = useCallback(() => {
        setEditingPlan(null);
        setIsModalOpen(true);
    }, []);

    const openEdit = useCallback((plan: SubscriptionPlan) => {
        setEditingPlan(plan);
        setIsModalOpen(true);
    }, []);

    const closeModal = useCallback(() => {
        setIsModalOpen(false);
        setEditingPlan(null);
    }, []);

    const handleSave = useCallback(async (planData: Partial<SubscriptionPlan>) => {
        try {
            if (editingPlan?._id) {
                await subscriptionPlanService.update(editingPlan._id, planData);
                toast.success('Plan updated successfully');
            } else {
                await subscriptionPlanService.createCustom(planData as Parameters<typeof subscriptionPlanService.createCustom>[0]);
                toast.success('Custom plan created successfully');
            }
            closeModal();
            fetchPlans();
        } catch {
            toast.error('Failed to save plan');
        }
    }, [editingPlan, fetchPlans, closeModal]);

    const handleDelete = useCallback(async (id: string) => {
        try {
            await subscriptionPlanService.delete(id);
            toast.success('Plan deleted successfully');
            fetchPlans();
        } catch {
            toast.error('Failed to delete plan');
        }
    }, [fetchPlans]);

    return {
        systemPlans,
        customPlans: {
            data: filteredCustomPlans,
            paginatedData: paginatedCustomPlans,
            totalItems: filteredCustomPlans.length
        },
        loading,
        searchQuery,
        setSearchQuery,
        pagination: {
            currentPage,
            onPageChange: setCurrentPage,
            itemsPerPage: ITEMS_PER_PAGE,
            totalItems: filteredCustomPlans.length
        },
        modalState: {
            isOpen: isModalOpen,
            editingPlan,
            openCreate,
            openEdit,
            close: closeModal
        },
        actions: {
            handleSave,
            handleDelete,
            refresh: fetchPlans
        }
    };
};
