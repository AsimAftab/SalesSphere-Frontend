// /src/Pages/ExpensesPage/ExpensesPage.tsx

import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Sidebar from "../../components/layout/Sidebar/Sidebar";
import { 
  getExpenses, 
  type GetExpensesOptions, 
  type GetExpensesResponse 
} from "../../api/expensesService";
import ExpensesContent, { ExpensesSkeleton } from "./ExpensesContent";
import toast from "react-hot-toast";

const EXPENSE_KEYS = {
  all: ["expenses"] as const,
  list: (filters: GetExpensesOptions) => [...EXPENSE_KEYS.all, "list", filters] as const,
};

const ExpensesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Filters
  const [selectedDateFilter, setSelectedDateFilter] = useState<Date | null>(null);
  const [selectedMonth, setSelectedMonth] = useState("");

  const listQueryOptions: GetExpensesOptions = useMemo(() => ({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    date: selectedDateFilter?.toISOString().split('T')[0],
    month: selectedMonth,
  }), [currentPage, selectedDateFilter, selectedMonth]);

  // --- DATA FETCHING ---
  const { data: listResponse, isLoading, isFetching } = useQuery<GetExpensesResponse, Error>({
    queryKey: EXPENSE_KEYS.list(listQueryOptions),
    queryFn: () => getExpenses(listQueryOptions),
    placeholderData: (prev: GetExpensesResponse | undefined) => prev,
  });

  // --- BULK DELETE MUTATION ---
  const deleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      // Logic: Replace this with your actual delete API call
      console.log("Deleting expenses with IDs:", ids);
      return new Promise((resolve) => setTimeout(resolve, 1000));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXPENSE_KEYS.all });
      toast.success("Selected expenses deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete selected expenses");
    }
  });

  // --- NEW: STATUS UPDATE MUTATION ---
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, newStatus }: { id: string; newStatus: string }) => {
      // Logic: Replace this with your actual update API call
      // return await updateExpenseStatusApi(id, newStatus);
      console.log(`Updating Expense ${id} to ${newStatus}`);
      return new Promise((resolve) => setTimeout(resolve, 800));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXPENSE_KEYS.all });
      toast.success("Status updated successfully");
    },
    onError: () => {
      toast.error("Failed to update status");
    }
  });

  // --- HANDLERS ---
  const handleCreate = () => {
    console.log("Open Create Expense Modal");
  };

  const handleBulkDelete = (ids: string[]) => {
    if (window.confirm(`Are you sure you want to delete ${ids.length} item(s)?`)) {
      deleteMutation.mutate(ids);
    }
  };

  // Logic: Wrapper for the mutation to pass down to content
  const handleUpdateStatus = (id: string, newStatus: string) => {
    updateStatusMutation.mutate({ id, newStatus });
  };

  if (isLoading && !listResponse) {
    return (
      <Sidebar>
        {/* FIX: Provided required 'rows' prop */}
        <ExpensesSkeleton rows={ITEMS_PER_PAGE} />
      </Sidebar>
    );
  }

  return (
    <Sidebar>
      <ExpensesContent
        tableData={listResponse?.data || []}
        isFetchingList={isFetching || deleteMutation.isPending}
        selectedDateFilter={selectedDateFilter}
        setSelectedDateFilter={setSelectedDateFilter}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={listResponse?.pagination.pages || 1}
        totalItems={listResponse?.pagination.total || 0}
        ITEMS_PER_PAGE={ITEMS_PER_PAGE}
        handleCreate={handleCreate}
        handleBulkDelete={handleBulkDelete}
        // FIX: Provided required update props
        onUpdateStatus={handleUpdateStatus}
        isUpdatingStatus={updateStatusMutation.isPending}
      />
    </Sidebar>
  );
};

export default ExpensesPage;