// src/Pages/TourPlanPage/components/useTourManager.ts
import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  getTourPlans,
  updateTourStatus,
  bulkDeleteTourPlans,
  createTourPlan,
  type TourPlan,
  type TourStatus,
  type CreateTourRequest
} from '../../../api/tourPlanService';
import { useAuth } from '@/api/authService';

// Permission interface for type safety
export interface TourPlanPermissions {
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  canBulkDelete: boolean;
  canApprove: boolean;
  canExportPdf: boolean;
  canExportExcel: boolean;
}

const useTourManager = () => {
  const queryClient = useQueryClient();
  const { hasPermission, user } = useAuth();

  // --- Permissions Grouping (Enterprise Pattern) ---
  const permissions: TourPlanPermissions = useMemo(() => ({
    canCreate: hasPermission("tourPlan", "create"),
    canUpdate: hasPermission("tourPlan", "update"),
    canDelete: hasPermission("tourPlan", "delete"),
    canBulkDelete: hasPermission("tourPlan", "bulkDelete"),
    canApprove: hasPermission("tourPlan", "approve"),
    canExportPdf: hasPermission("tourPlan", "exportPdf"),
    canExportExcel: hasPermission("tourPlan", "exportExcel"),
  }), [hasPermission]);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [filters, setFilters] = useState({
    date: null as Date | null,
    employees: [] as string[],
    statuses: [] as string[],
    months: [] as string[],
    creators: [] as string[],
    reviewers: [] as string[],
  });

  const { data: tourPlans = [], isFetching } = useQuery<TourPlan[]>({
    queryKey: ["tour-plans"],
    queryFn: getTourPlans,
  });

  // --- Mutations (Centralized Business Logic) ---

  const createMutation = useMutation({
    mutationFn: (data: CreateTourRequest) => createTourPlan(data),
    onSuccess: () => {
      toast.success("Tour plan created successfully!");
      queryClient.invalidateQueries({ queryKey: ["tour-plans"] });
    },
    onError: () => toast.error("Failed to create tour plan"),
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: (ids: string[]) => bulkDeleteTourPlans(ids),
    onSuccess: () => {
      toast.success("Plans deleted successfully");
      setSelectedIds([]);
      queryClient.invalidateQueries({ queryKey: ["tour-plans"] });
    },
    onError: () => toast.error("Failed to delete plans"),
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: TourStatus }) => updateTourStatus(id, status),
    onSuccess: () => {
      toast.success("Status updated");
      queryClient.invalidateQueries({ queryKey: ["tour-plans"] });
    },
    onError: (err: Error) => {
      // Use specific error message if available, fallback to generic
      toast.error(err.message || "Failed to update status");
    }
  });

  // --- Filtering Logic ---
  const filteredData = useMemo(() => {
    return tourPlans.filter((plan: TourPlan) => {
      const matchesSearch = plan.placeOfVisit.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plan.createdBy.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filters.statuses.length === 0 || filters.statuses.includes(plan.status);

      // Fix: Use local date comparison to avoid timezone shifts
      const matchesDate = !filters.date || (() => {
        const d = filters.date;
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const filterDateStr = `${year}-${month}-${day}`;
        // Assuming plan.startDate is YYYY-MM-DD string
        return plan.startDate === filterDateStr;
      })();

      const matchesMonth = filters.months.length === 0 || (() => {
        if (!plan.startDate) return false;
        const monthName = new Date(plan.startDate).toLocaleString('en-US', { month: 'long' });
        return filters.months.includes(monthName);
      })();
      const matchesEmployee = filters.employees.length === 0 || filters.employees.includes(plan.createdBy.name);

      const matchesCreator = filters.creators.length === 0 ||
        (plan.createdBy?.name && filters.creators.includes(plan.createdBy.name));

      const matchesReviewer = filters.reviewers.length === 0 || (() => {
        const hasNone = filters.reviewers.includes('None');
        const realReviewers = filters.reviewers.filter(r => r !== 'None');

        const isUnreviewed = hasNone && (!plan.approvedBy?.name);
        const isReviewedBySelected = !!plan.approvedBy?.name && realReviewers.includes(plan.approvedBy.name);

        return isUnreviewed || isReviewedBySelected;
      })();

      return matchesSearch && matchesStatus && matchesDate && matchesMonth && matchesEmployee && matchesCreator && matchesReviewer;
    });
  }, [tourPlans, searchQuery, filters]);

  // --- Pagination Logic ---
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * 10;
    return filteredData.slice(startIndex, startIndex + 10);
  }, [filteredData, currentPage]);

  return {
    tableState: {
      data: filteredData,
      paginatedData,
      loading: isFetching,
      pagination: {
        currentPage,
        onPageChange: setCurrentPage,
        itemsPerPage: 10,
        totalItems: filteredData.length
      },
      selection: {
        selectedIds,
        onSelect: setSelectedIds,
        toggleRow: (id: string) => {
          setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
          );
        },
        selectAll: (checked: boolean) => {
          setSelectedIds(checked ? filteredData.map(d => d.id) : []);
        }
      }
    },
    filterState: {
      searchQuery,
      onSearch: setSearchQuery,
      isVisible: isFilterVisible,
      onToggle: setIsFilterVisible,
      values: filters,
      onFilterChange: setFilters,
      onReset: () => {
        setSearchQuery("");
        setFilters({ date: null, employees: [], statuses: [], months: [], creators: [], reviewers: [] });
        setSelectedIds([]);
      },
      options: {
        employees: Array.from(new Set(tourPlans.map(p => p.createdBy.name))),
        creators: Array.from(new Set(tourPlans.map(p => p.createdBy?.name).filter(Boolean))) as string[],
        reviewers: Array.from(new Set(tourPlans.map(p => p.approvedBy?.name).filter(Boolean))) as string[],
      }
    },
    actions: {
      create: async (data: CreateTourRequest) => createMutation.mutateAsync(data),
      delete: async (id: string) => {
        // Re-use bulk delete for single item to keep API surface small if backed supports it, 
        // OR use separate delete if available. Assuming bulk delete works for array of 1.
        await bulkDeleteMutation.mutateAsync([id]);
      },
      bulkDelete: async (ids: string[]) => {
        if (ids.length > 0) await bulkDeleteMutation.mutateAsync(ids);
      },
      updateStatus: async (id: string, status: TourStatus) => await updateStatus.mutateAsync({ id, status }),
      isCreating: createMutation.isPending,
      isDeleting: bulkDeleteMutation.isPending,
      isUpdating: updateStatus.isPending
    },
    permissions: {
      ...permissions,
      canView: true, // Defaulting to true or check 'tourPlan.view'
      canEdit: permissions.canUpdate,
    },
    currentUserId: user?.id || user?._id,
  };
};

export default useTourManager;