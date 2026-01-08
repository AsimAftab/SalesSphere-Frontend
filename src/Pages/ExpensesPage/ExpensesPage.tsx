import React, { useState } from "react";
import Sidebar from "../../components/layout/Sidebar/Sidebar";
import ExpensesContent from "./ExpensesContent";
import ExpenseFormModal from "../../components/modals/ExpenseFormModal";
import ConfirmationModal from "../../components/modals/ConfirmationModal";
import { useExpenseViewState } from "./components/useExpenseViewState";
import { ExpenseExportService } from "./components/ExportExpenseService";
import { type Expense } from "../../api/expensesService";
import toast from "react-hot-toast";

const ExpensesPage: React.FC = () => {
  // 1. Facade Hook handles all logic
  const { state, actions, permissions } = useExpenseViewState();
  const [exportingStatus, setExportingStatus] = useState<'pdf' | 'excel' | null>(null);

  // Export Logic (kept here or moved to reusable hook if generic)
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
        // Data & State
        tableData={state.expenses}
        isFetchingList={state.isLoading}
        userProfile={state.userProfile}

        // Filter Props
        searchTerm={state.searchTerm}
        setSearchTerm={actions.setSearchTerm}
        selectedDateFilter={state.selectedDate}
        setSelectedDateFilter={actions.setSelectedDate}
        selectedMonth={state.selectedMonth}
        setSelectedMonth={actions.setSelectedMonth}
        selectedUserFilter={state.selectedUser}
        setSelectedUserFilter={actions.setSelectedUser}
        selectedCategoryFilter={state.selectedCategory}
        setSelectedCategoryFilter={actions.setSelectedCategory}
        selectedReviewerFilter={state.selectedReviewer}
        setSelectedReviewerFilter={actions.setSelectedReviewer}
        onResetFilters={actions.resetFilters}

        // Pagination
        currentPage={state.currentPage}
        setCurrentPage={actions.setCurrentPage}
        ITEMS_PER_PAGE={state.itemsPerPage}
        totalItems={state.expenses.length} // Should be total count from API ideally, using filtered length for now

        // Actions
        handleCreate={actions.openCreateModal}
        handleBulkDelete={actions.openDeleteModal}
        onUpdateStatus={(id, status) => actions.updateStatus({ id, status: status as 'approved' | 'rejected' | 'pending' })}

        // Export
        onExportPdf={(data) => handleExport('pdf', data)}
        onExportExcel={(data) => handleExport('excel', data)}
        exportingStatus={exportingStatus}

        // Selection
        selectedIds={state.selectedIds}
        onToggleSelection={actions.toggleSelection}
        onSelectAll={actions.selectAll}

        // Permissions
        permissions={permissions}
      />

      {/* Logic for Modals is also strictly controlled by the Hook */}
      <ExpenseFormModal
        isOpen={state.isCreateModalOpen}
        onClose={actions.closeCreateModal}
        categories={state.categories || []}
        parties={state.parties || []}
        isSaving={state.isCreating}
        onSave={async (data, file) => {
          actions.createExpense({ data, file });
        }}
      />

      <ConfirmationModal
        isOpen={state.isDeleteModalOpen}
        title="Confirm Deletion"
        message={`Are you sure you want to delete ${state.idsToDelete.length} item(s)? This action cannot be undone.`}
        confirmButtonText={state.isDeleting ? "Deleting..." : "Delete"}
        confirmButtonVariant="danger"
        onConfirm={() => actions.deleteExpenses(state.idsToDelete)}
        onCancel={actions.closeDeleteModal}
      />
    </Sidebar>
  );
};

export default ExpensesPage;
