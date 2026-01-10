import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  getTourPlanById,
  deleteTourPlan,
  updateTourPlan,
  updateTourStatus
} from '../../api/tourPlanService';
import { useAuth } from '../../api/authService';

// Permission interface for type safety
export interface TourDetailPermissions {
  canUpdate: boolean;
  canDelete: boolean;
  canApprove: boolean;
}

export const useTourPlanDetail = (id: string | undefined) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { hasPermission } = useAuth();

  // --- Permissions ---
  const permissions: TourDetailPermissions = {
    canUpdate: hasPermission("tourPlan", "update"),
    canDelete: hasPermission("tourPlan", "delete"),
    canApprove: hasPermission("tourPlan", "approve"),
  };

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
    mutationFn: (data: any) => updateTourPlan(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tour-plan', id] });
      queryClient.invalidateQueries({ queryKey: ['tour-plans'] });
      toast.success("Tour Plan Updated Successfully");
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Update failed")
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ status, rejectionReason }: { status: any; rejectionReason?: string }) =>
      updateTourStatus(id!, status, rejectionReason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tour-plan', id] });
      queryClient.invalidateQueries({ queryKey: ['tour-plans'] });
      toast.success("Tour Status Updated");
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Status update failed")
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
    },
    actions: {
      update: updateMutation.mutateAsync,
      updateStatus: updateStatusMutation.mutateAsync,
      delete: deleteMutation.mutate,
    },
    permissions,
  };
};