import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { 
  getTourPlans, 
  updateTourStatus, 
  bulkDeleteTourPlans, // Ensure this is exported from your service
  type TourPlan, 
  type TourStatus 
} from '../../../api/tourPlanService';

const useTourManager = () => {
  const queryClient = useQueryClient();
  
  // NEW: State for multi-select logic
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [filters, setFilters] = useState({
    date: null as Date | null,
    employees: [] as string[],
    statuses: [] as string[],
    months: [] as string[],
  });

  const { data: tourPlans = [], isFetching } = useQuery<TourPlan[]>({
    queryKey: ["tour-plans"],
    queryFn: getTourPlans,
  });

  const filteredData = useMemo(() => {
    return tourPlans.filter((plan: TourPlan) => {
      // 1. Search Logic: Employee Name or Place
      const matchesSearch = plan.placeOfVisit.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           plan.createdBy.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      // 2. Status Logic: Multi-select statuses
      const matchesStatus = filters.statuses.length === 0 || 
                           filters.statuses.includes(plan.status);

      // 3. Date Filter: Matches the specific Start Date
      const matchesDate = !filters.date || 
                         plan.startDate === filters.date.toISOString().split('T')[0];

      // 4. Month Filter: Derived from the Start Date
      const matchesMonth = filters.months.length === 0 || (() => {
        if (!plan.startDate) return false;
        // Extracts full month name (e.g., "January") from the startDate string
        const monthName = new Date(plan.startDate).toLocaleString('en-US', { month: 'long' });
        return filters.months.includes(monthName);
      })();

      // 5. Employee Filter: Multi-select employee names
      const matchesEmployee = filters.employees.length === 0 || 
                             filters.employees.includes(plan.createdBy.name);
      
      // Combine all conditions
      return matchesSearch && matchesStatus && matchesDate && matchesMonth && matchesEmployee;
    });
  }, [tourPlans, searchQuery, filters]);


  // NEW: Bulk Delete Mutation
  const bulkDeleteMutation = useMutation({
    mutationFn: (ids: string[]) => bulkDeleteTourPlans(ids),
    onSuccess: () => {
      toast.success("Plans deleted successfully");
      setSelectedIds([]); // Clear selection
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
  });

  // ... (Filtering logic remains same)

  return {
    tourPlans: filteredData,
    isFetching,
    currentPage,
    setCurrentPage,
    isFilterVisible,
    setIsFilterVisible,
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    employeeOptions: Array.from(new Set(tourPlans.map(p => p.createdBy.name))),
    onResetFilters: () => {
      setSearchQuery("");
      setFilters({ date: null, employees: [], statuses: [], months: [] });
      setSelectedIds([]);
    },
    // FIXED: Adding missing properties
    selectedIds,
    setSelectedIds,
    handleBulkDelete: () => {
      if (selectedIds.length > 0) {
        bulkDeleteMutation.mutate(selectedIds);
      }
    },
    isDeleting: bulkDeleteMutation.isPending,
    handleUpdateStatus: (id: string, status: TourStatus) => updateStatus.mutate({ id, status }),
    isUpdating: updateStatus.isPending
  };
};

export default useTourManager;