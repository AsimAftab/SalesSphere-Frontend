import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { LeaveRepository, type LeaveStatus } from '../../../api/leaveService';
import toast from 'react-hot-toast';

export const useLeaveManager = () => {
  const queryClient = useQueryClient();
  
  // --- UI State ---
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  
  const [filters, setFilters] = useState({
    date: null as Date | null,
    employees: [] as string[],
    statuses: [] as string[],
    months: [] as string[],
  });

  // --- Data Fetching ---
  const { data: leaves = [], isLoading } = useQuery({
    queryKey: ["leaves-admin"],
    queryFn: LeaveRepository.getAllLeaves,
  });

  // --- Mutations ---
  const updateStatus = useMutation({
  mutationFn: ({ id, status }: { id: string; status: LeaveStatus }) => 
    LeaveRepository.updateLeaveStatus(id, status),
  onSuccess: () => {
    toast.success("Status Updated and Attendance Synced");
    
    // 1. Refresh the Leaves list
    queryClient.invalidateQueries({ queryKey: ["leaves-admin"] });
    
    // 2. Refresh the Attendance data
    // Using only the prefix ["attendance"] invalidates ALL month/year combinations
    queryClient.invalidateQueries({ 
      queryKey: ["attendance"],
      exact: false 
    }); 
  },
  onError: () => toast.error("Failed to update status")
});

  const bulkDelete = useMutation({
    mutationFn: (ids: string[]) => LeaveRepository.bulkDeleteLeaves(ids),
    onSuccess: () => {
      toast.success("Selected Items Deleted");
      setSelectedIds([]); 
      queryClient.invalidateQueries({ queryKey: ["leaves-admin"] });
    },
    onError: () => toast.error("Failed to delete selected items")
  });

  // --- Search and Filter Logic ---
  // --- Search and Filter Logic ---
  const filteredData = useMemo(() => {
    return leaves.filter((l) => {
      // 1. Basic Search
      const matchesSearch = l.createdBy.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          l.category.toLowerCase().includes(searchQuery.toLowerCase());

      // 2. Status Filter
      const matchesStatus = filters.statuses.length === 0 || filters.statuses.includes(l.status);

      // 3. FIXED: Start Date Filter
      // We format the local Date object to YYYY-MM-DD manually to avoid timezone shifts
      const matchesDate = !filters.date || (() => {
        const year = filters.date.getFullYear();
        const month = String(filters.date.getMonth() + 1).padStart(2, '0');
        const day = String(filters.date.getDate()).padStart(2, '0');
        const formattedFilterDate = `${year}-${month}-${day}`;
        
        return l.startDate === formattedFilterDate;
      })();

      // 4. Month Filter
      const monthName = new Date(l.startDate).toLocaleString('en-US', { month: 'long' });
      const matchesMonth = filters.months.length === 0 || filters.months.includes(monthName);

      // 5. Employee Filter
      const matchesEmployee = filters.employees.length === 0 || filters.employees.includes(l.createdBy.name);
      
      return matchesSearch && matchesStatus && matchesDate && matchesMonth && matchesEmployee;
    });
  }, [leaves, searchQuery, filters]);

  // --- Return Enterprise Manager Object ---
  return {
    leaves: filteredData,
    isLoading,
    currentPage,
    setCurrentPage,
    searchQuery,
    setSearchQuery,
    selectedIds,
    setSelectedIds,
    isFilterVisible,
    setIsFilterVisible,
    filters,
    setFilters,
    employeeOptions: Array.from(new Set(leaves.map(l => l.createdBy.name))),

    // ACTION HANDLERS
    // FIX: Wrapped mutate to accept two arguments (id, status) instead of an object
    handleUpdateStatus: (id: string, status: LeaveStatus) => 
      updateStatus.mutate({ id, status }),

    handleBulkDelete: (ids: string[]) => bulkDelete.mutate(ids),
    
    // PENDING STATES
    isUpdating: updateStatus.isPending,
    isDeleting: bulkDelete.isPending
  };
};