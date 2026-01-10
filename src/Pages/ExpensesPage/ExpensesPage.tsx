import React from "react";
import Sidebar from "../../components/layout/Sidebar/Sidebar";
import ExpensesContent from "./ExpensesContent";
import ExpenseFormModal from "../../components/modals/ExpenseFormModal";
import ConfirmationModal from "../../components/modals/ConfirmationModal";
import ErrorBoundary from "../../components/UI/ErrorBoundary/ErrorBoundary";
import { useExpenseViewState } from "./components/useExpenseViewState";
import { ExpenseExportService } from "./components/ExportExpenseService";
import { type Expense } from "../../api/expensesService";
import toast from "react-hot-toast";

const ExpensesPage: React.FC = () => {
  // 1. Facade Hook handles all logic (using client-side filtering / pagination now)
  const { state, actions, permissions } = useExpenseViewState();

  // Export Logic (kept here or moved to reusable hook if generic)
  const handleExport = async (type: 'pdf' | 'excel', dataToExport: Expense[]) => {
    try {
      if (type === 'pdf') {
        toast.promise(ExpenseExportService.toPdf(dataToExport), {
          loading: 'Generating PDF...',
          success: 'PDF downloaded successfully',
          error: 'Failed to generate PDF'
        });
      } else {
        toast.promise(ExpenseExportService.toExcel(dataToExport), {
          loading: 'Generating Excel...',
          success: 'Excel downloaded successfully',
          error: 'Failed to generate Excel'
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Sidebar>
      <ErrorBoundary>
        <ExpensesContent
          state={state}
          actions={actions}
          permissions={permissions}
          onExportPdf={(data) => handleExport('pdf', data)}
          onExportExcel={(data) => handleExport('excel', data)}
        />
      </ErrorBoundary>

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
