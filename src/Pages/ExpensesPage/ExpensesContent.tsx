import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { EmptyState } from '../../components/UI/EmptyState/EmptyState';
import { SkeletonTheme } from 'react-loading-skeleton';
import { ExpenseTable } from './components/ExpenseTable';
import { ExpenseMobileList } from './components/ExpenseMobileList';
import Pagination from '../../components/UI/Page/Pagination';
import StatusUpdateModal from '../../components/modals/StatusUpdateModal';
import { type Expense } from '../../api/expensesService';
import { ExpensesSkeleton } from './components/ExpensesSkeleton';

interface ExpensesContentProps {
  state: {
    expenses: Expense[];
    isLoading: boolean;
    selectedIds: string[];
    // Filters for EmptyState logic
    searchTerm: string;
    selectedDate: Date | null;
    selectedMonth: string[];
    selectedUser: string[];
    selectedCategory: string[];
    selectedReviewer: string[];

    // Pagination
    totalItems: number;
    itemsPerPage: number;
    currentPage: number;

    // Actions state
    isUpdatingStatus: boolean;
  };
  actions: {
    toggleSelection: (id: string) => void;
    selectAll: (ids: string[]) => void;
    updateStatus: (payload: { id: string; status: 'approved' | 'rejected' | 'pending' }) => void;
    setCurrentPage: (page: number) => void;
  };
  permissions: {
    canView: boolean;
    canCreate: boolean;
    canUpdate: boolean;
    canDelete: boolean;
    canApprove: boolean;
    canExportPdf: boolean;
    canExportExcel: boolean;
    canViewDetail: boolean;
  };
  onExportPdf?: (data: Expense[]) => void;
  onExportExcel?: (data: Expense[]) => void;
}

const ExpensesContent: React.FC<ExpensesContentProps> = ({ state, actions, permissions }) => {
  const { expenses, isLoading, selectedIds, searchTerm, selectedDate, selectedMonth, selectedUser, selectedCategory, selectedReviewer, currentPage, totalItems, itemsPerPage, isUpdatingStatus } = state;
  const { toggleSelection, selectAll, updateStatus, setCurrentPage } = actions;

  const [reviewingExpense, setReviewingExpense] = useState<Expense | null>(null);

  const handleStatusClick = (expense: Expense) => {
    setReviewingExpense(expense);
  };

  if (isLoading) {
    return <ExpensesSkeleton />;
  }

  const startIndex = (currentPage - 1) * itemsPerPage;

  // Options for status modal
  const statusOptions = [
    { value: 'approved', label: 'Approve', colorClass: 'text-green-600 bg-green-50' },
    { value: 'rejected', label: 'Reject', colorClass: 'text-red-600 bg-red-50' },
    { value: 'pending', label: 'Pending', colorClass: 'text-yellow-600 bg-yellow-50' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-full w-full"
    >
      <SkeletonTheme baseColor="#f3f4f6" highlightColor="#e5e7eb">
        {expenses.length === 0 ? (
          <EmptyState
            title="No Expenses Found"
            description={searchTerm || selectedDate || selectedMonth.length > 0 ||
              selectedUser.length > 0 || selectedCategory.length > 0 ||
              selectedReviewer.length > 0
              ? "No expenses match your current filters. Try adjusting your search criteria."
              : "No expense records available. Create your first expense to get started."}
            icon={
              <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
          />
        ) : (
          <>
            <div className="hidden md:block flex-1 overflow-auto">
              <ExpenseTable
                data={expenses}
                selectedIds={selectedIds}
                onToggle={toggleSelection}
                onSelectAll={(checked: boolean) => selectAll(checked ? expenses.map((d: Expense) => d.id) : [])}
                onBadgeClick={permissions.canApprove ? handleStatusClick : (_) => { }}
                startIndex={startIndex}
                permissions={permissions}
              />
            </div>

            <div className="md:hidden block w-full flex-1 overflow-auto">
              <ExpenseMobileList
                data={expenses}
                selectedIds={selectedIds}
                onToggle={toggleSelection}
                onBadgeClick={permissions.canApprove ? handleStatusClick : (_) => { }}
                permissions={permissions}
              />
            </div>

            <div className="flex-shrink-0">
              <Pagination
                currentPage={currentPage}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
              />
            </div>
          </>
        )}
      </SkeletonTheme>

      <StatusUpdateModal
        isOpen={!!reviewingExpense}
        onClose={() => setReviewingExpense(null)}
        currentValue={reviewingExpense?.status || ''}
        entityIdLabel="Entry Title"
        entityIdValue={reviewingExpense?.title || ''}
        title="Approve Settlement"
        options={statusOptions}
        isSaving={isUpdatingStatus}
        onSave={(newVal: string) => {
          if (reviewingExpense) updateStatus({ id: reviewingExpense.id, status: newVal as any });
          setReviewingExpense(null);
        }}
      />
    </motion.div>
  );
};

export default ExpensesContent;