import React from 'react';
import { motion } from 'framer-motion';
import { EmptyState } from '../../components/ui/EmptyState/EmptyState';
import { SkeletonTheme } from 'react-loading-skeleton';
import { ExpenseTable } from './components/ExpenseTable';
import { ExpenseMobileList } from './components/ExpenseMobileList';
import Pagination from '../../components/ui/Page/Pagination';
import StatusUpdateModal from '../../components/modals/CommonModals/StatusUpdateModal';
import { type Expense } from '../../api/expensesService';
import { type User } from '../../api/authService';
import { ExpensesSkeleton } from './components/ExpensesSkeleton';
import { ExpensesHeader } from './components/ExpensesHeader';
import expensesIcon from '../../assets/images/icons/expenses-icon.svg';

// Filter Imports
import FilterBar from "../../components/ui/FilterDropDown/FilterBar";
import FilterDropdown from "../../components/ui/FilterDropDown/FilterDropDown";
import DatePicker from "../../components/ui/DatePicker/DatePicker";

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
    selectedStatus: string[];

    // Pagination
    totalItems: number;
    itemsPerPage: number;
    currentPage: number;

    // Actions state
    isUpdatingStatus: boolean;
    userProfile: User | null;
    isFilterVisible: boolean;
    submitters: string[];
    reviewers: string[];
    uniqueCategories: string[];

    // State from Hook
    reviewingExpense: Expense | null;
  };
  actions: {
    toggleSelection: (id: string) => void;
    selectAll: (ids: string[]) => void;
    updateStatus: (payload: { id: string; status: 'approved' | 'rejected' | 'pending' }) => void;
    setSearchTerm: (val: string) => void;
    setCurrentPage: (page: number) => void;
    openCreateModal: () => void;
    toggleFilterVisibility: () => void;
    openDeleteModal: (ids: string[]) => void; // Added

    // Filter Actions
    setSelectedDate: (date: Date | null) => void;
    setSelectedMonth: (months: string[]) => void;
    setSelectedUser: (users: string[]) => void;
    setSelectedCategory: (cats: string[]) => void;
    setSelectedReviewer: (reviewers: string[]) => void;
    setSelectedStatus: (status: string[]) => void;
    resetFilters: () => void;

    // Hook Actions
    initiateStatusUpdate: (expense: Expense) => void;
    closeStatusModal: () => void;
  };
  permissions: {
    canView: boolean;
    canCreate: boolean;
    canUpdate: boolean;
    canDelete: boolean;
    canBulkDelete: boolean; // Added
    canApprove: boolean;
    canExportPdf: boolean;
    canExportExcel: boolean;
    canViewDetail: boolean;
  };
  onExportPdf?: (data: Expense[]) => void;
  onExportExcel?: (data: Expense[]) => void;
}

const ExpensesContent: React.FC<ExpensesContentProps> = ({ state, actions, permissions, onExportPdf, onExportExcel }) => {
  const { expenses, isLoading, selectedIds, searchTerm, selectedDate, selectedMonth, selectedUser, selectedCategory, selectedReviewer, selectedStatus, currentPage, totalItems, itemsPerPage, isUpdatingStatus, isFilterVisible, submitters, reviewers, uniqueCategories, reviewingExpense } = state;
  const { toggleSelection, selectAll, updateStatus, setSearchTerm, setCurrentPage, openCreateModal, toggleFilterVisibility, setSelectedDate, setSelectedMonth, setSelectedCategory, setSelectedUser, setSelectedReviewer, setSelectedStatus, resetFilters, openDeleteModal, initiateStatusUpdate, closeStatusModal } = actions;

  if (isLoading) {
    return <ExpensesSkeleton permissions={permissions} />;
  }

  const startIndex = (currentPage - 1) * itemsPerPage;

  // Options for status modal
  const statusOptions = [
    { value: 'pending', label: 'Pending', colorClass: 'blue' },
    { value: 'approved', label: 'Approved', colorClass: 'green' },
    { value: 'rejected', label: 'Rejected', colorClass: 'red' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-full w-full"
    >
      <SkeletonTheme baseColor="#f3f4f6" highlightColor="#e5e7eb">
        <ExpensesHeader
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          isFilterVisible={isFilterVisible}
          setIsFilterVisible={toggleFilterVisibility}
          selectedCount={selectedIds.length}
          onBulkDelete={() => openDeleteModal(selectedIds)}
          onExportPdf={() => onExportPdf && onExportPdf(expenses)}
          onExportExcel={() => onExportExcel && onExportExcel(expenses)}
          handleCreate={openCreateModal}
          setCurrentPage={setCurrentPage}
          permissions={permissions}
        />

        <FilterBar
          isVisible={isFilterVisible}
          onClose={toggleFilterVisibility}
          onReset={resetFilters}
        >
          <FilterDropdown
            label="Submitted By"
            options={submitters}
            selected={selectedUser}
            onChange={setSelectedUser}
          />

          <FilterDropdown
            label="Category"
            options={uniqueCategories}
            selected={selectedCategory}
            onChange={setSelectedCategory}
          />

          <FilterDropdown
            label="Reviewer"
            options={reviewers}
            selected={selectedReviewer}
            onChange={setSelectedReviewer}
            showNoneOption

          />
          <FilterDropdown
            label="Status"
            options={["pending", "approved", "rejected"]}
            selected={selectedStatus}
            onChange={setSelectedStatus}
          />

          <FilterDropdown
            label="Month"
            options={["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]}
            selected={selectedMonth}
            onChange={setSelectedMonth}
          />

          <div className="min-w-[140px] flex-1 sm:flex-none">
            <DatePicker
              value={selectedDate}
              onChange={setSelectedDate}
              placeholder="Incurred Date"
              isClearable
              className="bg-none border-gray-100 text-sm text-gray-900 font-semibold placeholder:text-gray-900"
            />
          </div>

        </FilterBar>

        {expenses.length === 0 ? (
          <EmptyState
            title="No Expenses Found"
            description={searchTerm || selectedDate || selectedMonth.length > 0 ||
              selectedUser.length > 0 || selectedCategory.length > 0 ||
              selectedReviewer.length > 0
              ? "No expenses match your current filters. Try adjusting your search criteria."
              : "No expense records available. Create your first expense to get started."}
            icon={
              <img
                src={expensesIcon}
                alt="No Expenses"
                className="w-16 h-16 opacity-50 filter grayscale"
              />
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
                onBadgeClick={initiateStatusUpdate}
                startIndex={startIndex}
                permissions={permissions}
              />
            </div>

            <div className="md:hidden block w-full flex-1 overflow-auto">
              <ExpenseMobileList
                data={expenses}
                selectedIds={selectedIds}
                onToggle={toggleSelection}
                onBadgeClick={initiateStatusUpdate}
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
        onClose={closeStatusModal}
        currentValue={reviewingExpense?.status || ''}
        entityIdLabel="Entry Title"
        entityIdValue={reviewingExpense?.title || ''}
        title="Approve Settlement"
        options={statusOptions}
        isSaving={isUpdatingStatus}
        onSave={(newVal: string) => {
          if (reviewingExpense) updateStatus({ id: reviewingExpense.id, status: newVal as 'approved' | 'rejected' | 'pending' });
        }}
      />
    </motion.div>
  );
};

export default ExpensesContent;