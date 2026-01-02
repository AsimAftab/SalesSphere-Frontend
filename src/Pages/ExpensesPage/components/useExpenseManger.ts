import { useState, useMemo, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  ExpenseRepository, 
  type ExpenseFilters, 
  type Expense 
} from "../../../api/expensesService";
import toast from "react-hot-toast";

/**
 * Enterprise-grade Expense Manager Hook
 * Adheres to SRP by managing state and DIP by relying on ExpenseRepository.
 */
export const useExpenseManager = (itemsPerPage: number) => {
  const queryClient = useQueryClient();
  
  // 1. Unified State Management for Server-Side Filtering
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  // New: States for Month and Submitter filters
  const [selectedMonth, setSelectedMonth] = useState<string[]>([]);
  const [selectedUser, setSelectedUser] = useState<string[]>([]);

  /**
   * 2. API Filter Object Orchestration
   * Every property change here will trigger a React Query refetch.
   */
  const filters = useMemo((): ExpenseFilters => ({
    page: currentPage,
    limit: itemsPerPage,
    search: searchTerm,
    date: selectedDate ? selectedDate.toISOString().split('T')[0] : undefined,
    // Sending multi-select arrays as single strings/values if the backend requires
    month: selectedMonth.length > 0 ? selectedMonth[0] : undefined,
    submittedBy: selectedUser.length > 0 ? selectedUser[0] : undefined,
  }), [currentPage, itemsPerPage, searchTerm, selectedDate, selectedMonth, selectedUser]);

  /**
   * 3. Server-Side Data Fetching
   * placeholderData keeps the previous data visible while the new filtered request is loading.
   */
  const { data: expenses, isFetching, error } = useQuery<Expense[]>({
    queryKey: ['expenses', 'list', filters],
    queryFn: () => ExpenseRepository.getExpenses(filters),
    placeholderData: (prev) => prev, 
  });

  /**
   * 4. Mutation Logic with Consistent Cache Invalidation
   */
  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'approved' | 'rejected' | 'pending' }) => 
      ExpenseRepository.updateExpenseStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast.success("Settlement status updated successfully");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update status");
    }
  });

  /**
   * 5. State Transition Handlers
   */
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset pagination on filter change to avoid empty results
  }, []);

  const handleFilterReset = useCallback(() => {
    setSearchTerm("");
    setSelectedDate(null);
    setSelectedMonth([]);
    setSelectedUser([]);
    setCurrentPage(1);
  }, []);

  return {
    expenses: expenses || [],
    isFetching,
    error,
    
    pagination: {
      currentPage,
      setCurrentPage,
      itemsPerPage,
    },
    filters: {
      searchTerm,
      setSearchTerm: handleSearchChange,
      selectedDate,
      setSelectedDate,
      selectedMonth,
      setSelectedMonth,
      selectedUser,
      setSelectedUser,
      reset: handleFilterReset,
    },
    
    operations: {
      updateStatus: statusMutation.mutate,
      isUpdating: statusMutation.isPending,
      invalidateCache: () => queryClient.invalidateQueries({ queryKey: ['expenses'] }),
    }
  };
};