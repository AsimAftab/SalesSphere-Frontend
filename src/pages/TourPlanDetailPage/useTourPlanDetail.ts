import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  getTourPlanById,
  deleteTourPlan,
  updateTourPlan,
  updateTourStatus,
  type CreateTourRequest,
  type TourStatus
} from '../../api/tourPlanService';
import { useAuth } from '@/api/authService';

// Permission interface for type safety
export interface TourDetailPermissions {
  canUpdate: boolean;
  canDelete: boolean;
  canApprove: boolean;
}

export const useTourPlanDetail = (id: string | undefined) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { hasPermission, user } = useAuth();

  // --- Permissions ---
  const permissions: TourDetailPermissions = {
    canUpdate: hasPermission("tourPlan", "update"),
    canDelete: hasPermission("tourPlan", "delete"),
    canApprove: hasPermission("tourPlan", "approve"),
  };

  // --- UI State ---
  const [activeModal, setActiveModal] = useState<'edit' | 'delete' | 'status' | null>(null);

  // --- Data Fetching ---
  const tourQuery = useQuery({
    queryKey: ['tour-plan', id],
    queryFn: () => getTourPlanById(id!),
    enabled: !!id,
  });

  // --- Mutations ---
  const deleteMutation = useMutation({
    mutationFn: () => deleteTourPlan(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tour-plans'] });
      toast.success("Tour Plan Deleted Successfully");
      navigate('/tour-plan');
    },
    onError: () => toast.error("Failed to delete tour plan")
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<CreateTourRequest>) => updateTourPlan(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tour-plan', id] });
      queryClient.invalidateQueries({ queryKey: ['tour-plans'] });
      toast.success("Tour Plan Updated Successfully");
    },
    onError: (err: Error) => toast.error(err.message || "Update failed")
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ status, rejectionReason }: { status: TourStatus; rejectionReason?: string }) =>
      updateTourStatus(id!, status, rejectionReason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tour-plan', id] });
      queryClient.invalidateQueries({ queryKey: ['tour-plans'] });
      toast.success("Tour Status Updated");
    },
    onError: (err: Error) => toast.error(err.message || "Status update failed")
  });

  return {
    data: {
      tourPlan: tourQuery.data,
    },
    state: {
      isLoading: tourQuery.isLoading,
      error: tourQuery.error ? (tourQuery.error as Error).message : null,
      isSaving: updateMutation.isPending || updateStatusMutation.isPending,
      isDeleting: deleteMutation.isPending,
      activeModal,
    },
    actions: {
      update: updateMutation.mutateAsync,
      updateStatus: updateStatusMutation.mutateAsync,
      delete: deleteMutation.mutate,
      openEditModal: () => setActiveModal('edit'),
      openDeleteModal: () => setActiveModal('delete'),
      openStatusModal: () => {
        const tour = tourQuery.data;
        if (tour && user && (tour.createdBy.id === (user.id || user._id))) {
          toast.error("Security Policy: You cannot authorize or change the status of your own submissions.");
          return;
        }
        setActiveModal('status');
      },
      closeModal: () => setActiveModal(null),
    },
    permissions,
  };
};