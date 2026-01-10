import React, { useState, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { SkeletonTheme } from 'react-loading-skeleton';
import "react-loading-skeleton/dist/skeleton.css";
import toast from 'react-hot-toast';

// UI Components
import DatePicker from "../../components/UI/DatePicker/DatePicker";
import FilterBar from '../../components/UI/FilterDropDown/FilterBar';
import FilterDropdown from '../../components/UI/FilterDropDown/FilterDropDown';
import StatusUpdateModal, { type StatusOption } from "../../components/modals/StatusUpdateModal";
import Pagination from '../../components/UI/Pagination';

// Sub-components
import { ExpensesHeader } from "./components/ExpensesHeader";
import { ExpensesSkeleton } from "./components/ExpensesSkeleton";
import { ExpenseTable } from "./components/ExpenseTable";
import { ExpenseMobileList } from "./components/ExpenseMobileList";

// Types
import { type Expense } from "../../api/expensesService";

interface ExpensesContentProps {
  state: any; // Ideally typed from hook
  actions: any;
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
  onExportPdf: (data: Expense[]) => void;
  onExportExcel: (data: Expense[]) => void;
}

const MONTH_OPTIONS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const statusOptions: StatusOption[] = [
  { value: 'pending', label: 'Pending', colorClass: 'blue' },
  { value: 'approved', label: 'Approved', colorClass: 'green' },
  { value: 'rejected', label: 'Rejected', colorClass: 'red' },
];

const ExpensesContent: React.FC<ExpensesContentProps> = ({ state, actions, permissions, onExportPdf, onExportExcel }) => {
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [reviewingExpense, setReviewingExpense] = useState<Expense | null>(null);
  const hasLoadedOnce = useRef(false);

  const { expenses, isLoading, userProfile, searchTerm, selectedDate, selectedMonth, selectedUser, selectedCategory, selectedReviewer, currentPage, itemsPerPage, selectedIds } = state;
  const { setSearchTerm, setCurrentPage, setSelectedDate, setSelectedMonth, setSelectedUser, setSelectedCategory, setSelectedReviewer, resetFilters, toggleSelection, selectAll, updateStatus, openCreateModal, openDeleteModal } = actions;

  if (!isLoading && !hasLoadedOnce.current) {
    hasLoadedOnce.current = true;
  }

  const isInitialLoad = isLoading && !hasLoadedOnce.current;

  // Derive unique options from ALL filtered expenses (if available) or current page expenses
  // Ideally, 'allFilteredExpenses' should be in state for this, as established in the hook.
  const sourceData = state.allFilteredExpenses || expenses;

  const uniqueSubmitters = useMemo(() => {
    return Array.from(new Set(sourceData.map((e: Expense) => e.createdBy.name))).sort() as string[];
  }, [sourceData]);

  const uniqueCategories = useMemo(() => {
    return Array.from(new Set(sourceData.map((e: Expense) => e.category))).sort() as string[];
  }, [sourceData]);

  const uniqueReviewers = useMemo(() => {
    return Array.from(new Set(sourceData.map((e: Expense) => e.approvedBy?.name || "None"))).sort() as string[];
  }, [sourceData]);

  const handleStatusClick = (exp: Expense) => {
    const status = exp.status.toLowerCase();
    if (status === 'approved' || status === 'rejected') {
      toast.error(`This record is already ${status.toUpperCase()} and cannot be modified.`);
      return;
    }

    if (exp.createdBy.id === userProfile?.id) {
      toast.error("Security Policy: You cannot approve or reject your own expense submissions.");
      return;
    }

    if (!permissions.canApprove) {
      toast.error("Permission Denied: You do not have rights to approve/reject expenses.");
      return;
    }

    setReviewingExpense(exp);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col p-0 md:p-2 relative">
      <SkeletonTheme baseColor="#e2e8f0" highlightColor="#f1f5f9">
        {/* Show full page skeleton on initial load */}
        {isInitialLoad ? (
          <ExpensesSkeleton
            rows={itemsPerPage}
            permissions={permissions}
          />
        ) : (
          <div className="w-full flex flex-col ">
            {/* HEADER */}
            <ExpensesHeader
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              isFilterVisible={isFilterVisible}
              setIsFilterVisible={setIsFilterVisible}
              selectedCount={selectedIds.length}
              onBulkDelete={() => openDeleteModal(selectedIds)}
              onExportPdf={() => onExportPdf(state.allFilteredExpenses || expenses)}
              onExportExcel={() => onExportExcel(state.allFilteredExpenses || expenses)}
              handleCreate={openCreateModal}
              setCurrentPage={setCurrentPage}
              permissions={permissions}
            />

            {/* CONTENT */}
            <div className="px-0 md:px-0">
              <FilterBar
                isVisible={isFilterVisible}
                onClose={() => setIsFilterVisible(false)}
                onReset={resetFilters}
              >
                <FilterDropdown
                  label="Submitted By"
                  selected={selectedUser || []}
                  options={uniqueSubmitters}
                  onChange={(val: string[]) => { setSelectedUser(val); setCurrentPage(1); }}
                />
                <FilterDropdown
                  label="Category"
                  selected={selectedCategory || []}
                  options={uniqueCategories}
                  onChange={(val: string[]) => { setSelectedCategory(val); setCurrentPage(1); }}
                />
                <FilterDropdown
                  label="Reviewer"
                  selected={selectedReviewer || []}
                  options={uniqueReviewers}
                  onChange={(val: string[]) => { setSelectedReviewer(val); setCurrentPage(1); }}
                />
                <FilterDropdown
                  label="Month"
                  selected={selectedMonth || []}
                  options={MONTH_OPTIONS}
                  onChange={(val: string[]) => { setSelectedMonth(val); setCurrentPage(1); }}
                />
                <div className="flex flex-col min-w-[140px]">
                  <DatePicker
                    value={selectedDate}
                    onChange={(date: Date | null) => { setSelectedDate(date); setCurrentPage(1); }}
                    placeholder="Incurred Date"
                    isClearable
                    className="bg-none border-gray-100 text-sm text-gray-900 font-semibold placeholder:text-gray-900"
                  />
                </div>
              </FilterBar>
            </div>

            {/* SHOW EMPTY STATE IF NO DATA */}
            {expenses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-4">
                <div className="bg-gray-100 rounded-full p-6 mb-4">
                  <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No Expenses Found
                </h3>
                <p className="text-gray-500 text-center max-w-md">
                  {searchTerm || selectedDate || selectedMonth.length > 0 ||
                    selectedUser.length > 0 || selectedCategory.length > 0 ||
                    selectedReviewer.length > 0
                    ? "No expenses match your current filters. Try adjusting your search criteria."
                    : "No expense records available. Create your first expense to get started."}
                </p>
              </div>
            ) : (
              <>
                {/* DESKTOP TABLE */}
                <div className="hidden md:block">
                  <ExpenseTable
                    data={expenses}
                    selectedIds={selectedIds}
                    onToggle={toggleSelection}
                    onSelectAll={(checked) => selectAll(checked ? expenses.map((d: Expense) => d.id) : [])}
                    onBadgeClick={handleStatusClick}
                    startIndex={startIndex}
                    permissions={permissions}
                  />
                </div>

                {/* MOBILE CARDS */}
                <div className="md:hidden block w-full">
                  <ExpenseMobileList
                    data={expenses}
                    selectedIds={selectedIds}
                    onToggle={toggleSelection}
                    onBadgeClick={handleStatusClick}
                    permissions={permissions}
                  />
                </div>

                <Pagination
                  currentPage={currentPage}
                  totalItems={state.totalItems}
                  itemsPerPage={state.itemsPerPage}
                  onPageChange={setCurrentPage}
                />
              </>
            )}

          </div>
        )}

      </SkeletonTheme>

      {/* STATUS MODAL */}
      <StatusUpdateModal
        isOpen={!!reviewingExpense}
        onClose={() => setReviewingExpense(null)}
        currentValue={reviewingExpense?.status || ''}
        entityIdLabel="Entry Title"
        entityIdValue={reviewingExpense?.title || ''}
        title="Approve Settlement"
        options={statusOptions}
        isSaving={state.isUpdatingStatus}
        onSave={(newVal: string) => {
          if (reviewingExpense) updateStatus({ id: reviewingExpense.id, status: newVal as any });
          setReviewingExpense(null);
        }}
      />
    </motion.div>
  );
};

export default ExpensesContent;