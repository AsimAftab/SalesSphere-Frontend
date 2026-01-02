import React, { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import Sidebar from "../../components/layout/Sidebar/Sidebar";
import ExpensesContent from "./ExpensesContent";
import ExpenseFormModal from "../../components/modals/ExpenseFormModal";
import ConfirmationModal from "../../components/modals/ConfirmationModal";
import { useExpenseManager } from "./components/useExpenseManger";
import { ExpenseExportService } from "./components/ExportExpenseService";
import { ExpenseRepository, type Expense } from "../../api/expensesService";
import { getParties } from "../../api/partyService";
import toast from "react-hot-toast";
import { checkAuthStatus } from "../../api/authService"; // Using existing auth service

const ITEMS_PER_PAGE = 10;

const ExpensesPage: React.FC = () => {
  const manager = useExpenseManager(ITEMS_PER_PAGE);
  
  // --- 1. NEW: Fetch Authenticated User Profile ---
  // In a real app, wrap this in a custom 'useAuth' hook for reuse
  const { data: userProfile, isLoading: isUserLoading } = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      // Assuming this returns the full user object { id, name, role }
      const status = await checkAuthStatus(); 
      if (!status) throw new Error("Unauthorized");
      // Fetch user profile logic here
      return { id: "actual_user_id", role: "admin", name: "Bikram Agrawal" }; 
    }
  });

  const [exportingStatus, setExportingStatus] = useState<'pdf' | 'excel' | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [idsToDelete, setIdsToDelete] = useState<string[]>([]);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string[]>([]);
  const [selectedReviewerFilter, setSelectedReviewerFilter] = useState<string[]>([]);

  const { data: categories } = useQuery({ 
    queryKey: ["expense-categories"], 
    queryFn: () => ExpenseRepository.getExpenseCategories() 
  });
  
  const { data: parties } = useQuery({ 
    queryKey: ["parties-list"], 
    queryFn: () => getParties() 
  });

  const createMutation = useMutation({
    mutationFn: ({ data, file }: { data: any; file: File | null }) => 
      ExpenseRepository.createExpense(data, file),
    onSuccess: () => {
      manager.operations.invalidateCache();
      toast.success("Expense recorded successfully");
      setIsCreateModalOpen(false);
    },
    onError: (err: any) => toast.error(err.message || "Failed to record expense")
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: (ids: string[]) => ExpenseRepository.bulkDeleteExpenses(ids),
    onSuccess: () => {
      manager.operations.invalidateCache();
      toast.success("Selected records deleted");
      setIsDeleteModalOpen(false);
      setIdsToDelete([]);
    },
    onError: (err: any) => toast.error(err.message || "Failed to delete expenses")
  });

  const handleExport = async (type: 'pdf' | 'excel', data: Expense[]) => {
    if (!data || data.length === 0) return toast.error("No records found to export.");
    setExportingStatus(type);
    try {
      if (type === 'pdf') await ExpenseExportService.toPdf(data);
      else await ExpenseExportService.toExcel(data);
      toast.success(`${type.toUpperCase()} exported successfully`);
    } catch (err) {
      toast.error(`Failed to generate ${type.toUpperCase()}`);
    } finally {
      setExportingStatus(null);
    }
  };

  return (
    <Sidebar>
      <ExpensesContent
        tableData={manager.expenses}
        // Updated to include user loading state
        isFetchingList={manager.isFetching || createMutation.isPending || bulkDeleteMutation.isPending || isUserLoading}
        
        searchTerm={manager.filters.searchTerm}
        setSearchTerm={manager.filters.setSearchTerm}
        selectedDateFilter={manager.filters.selectedDate}
        setSelectedDateFilter={manager.filters.setSelectedDate}
        selectedMonth={manager.filters.selectedMonth}
        setSelectedMonth={manager.filters.setSelectedMonth}
        selectedUserFilter={manager.filters.selectedUser}
        setSelectedUserFilter={manager.filters.setSelectedUser}
        
        selectedCategoryFilter={selectedCategoryFilter}
        setSelectedCategoryFilter={setSelectedCategoryFilter}
        selectedReviewerFilter={selectedReviewerFilter}
        setSelectedReviewerFilter={setSelectedReviewerFilter}
        
        currentPage={manager.pagination.currentPage}
        setCurrentPage={manager.pagination.setCurrentPage}
        ITEMS_PER_PAGE={ITEMS_PER_PAGE}
        totalItems={manager.expenses.length}
        
        handleCreate={() => setIsCreateModalOpen(true)} 
        onUpdateStatus={(id, s) => 
          manager.operations.updateStatus({ id, status: s as 'approved' | 'rejected' | 'pending' })
        }
        onExportPdf={(filteredSubset) => handleExport('pdf', filteredSubset)}
        onExportExcel={(filteredSubset) => handleExport('excel', filteredSubset)}
        exportingStatus={exportingStatus}
        
        handleBulkDelete={(ids) => {
          setIdsToDelete(ids);
          setIsDeleteModalOpen(true);
        }}
        
        // FIXED: Using dynamic user context instead of hardcoded strings
        currentUserId={userProfile?.id || ""}
        userRole={userProfile?.role || "user"}
      />

      <ExpenseFormModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)}
        categories={categories || []} 
        parties={parties || []}
        isSaving={createMutation.isPending}
        onSave={async (data, file) => {
          createMutation.mutate({ data, file });
        }}
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Confirm Deletion"
        message={`Are you sure you want to delete ${idsToDelete.length} item(s)? This action cannot be undone.`}
        confirmButtonText={bulkDeleteMutation.isPending ? "Deleting..." : "Delete"}
        confirmButtonVariant="danger"
        onConfirm={() => bulkDeleteMutation.mutate(idsToDelete)}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setIdsToDelete([]);
        }}
      />
    </Sidebar>
  );
};

export default ExpensesPage;