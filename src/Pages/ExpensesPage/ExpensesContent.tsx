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

// Sub-components
import { ExpensesHeader } from "./components/ExpensesHeader";
import { ExpensesSkeleton } from "./components/ExpensesSkeleton";
import { ExpenseTable } from "./components/ExpenseTable";
import { ExpenseMobileList } from "./components/ExpenseMobileList";

// Hooks
import { useTableSelection } from "../../components/hooks/useTableSelection";

// Types
import { type Expense } from "../../api/expensesService";

interface ExpensesContentProps {
  tableData: Expense[];
  isFetchingList: boolean;
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  selectedDateFilter: Date | null;
  setSelectedDateFilter: (date: Date | null) => void;
  selectedMonth: string[];
  setSelectedMonth: (months: string[]) => void;
  selectedUserFilter: string[];
  setSelectedUserFilter: (users: string[]) => void;
  selectedCategoryFilter: string[];
  setSelectedCategoryFilter: (categories: string[]) => void;
  selectedReviewerFilter: string[];
  setSelectedReviewerFilter: (reviewers: string[]) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  ITEMS_PER_PAGE: number;
  totalItems: number;
  totalPages?: number;
  handleCreate: () => void;
  handleBulkDelete: (ids: string[]) => void;
  onUpdateStatus: (id: string, newStatus: string) => void;
  onExportPdf: (data: Expense[]) => void;
  onExportExcel: (data: Expense[]) => void;
  exportingStatus: 'pdf' | 'excel' | null;
  isUpdatingStatus?: boolean;
  currentUserId: string;
  userRole: string;
}

const MONTH_OPTIONS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const statusOptions: StatusOption[] = [
  { value: 'pending', label: 'Pending', colorClass: 'blue' },
  { value: 'approved', label: 'Approved', colorClass: 'green' },
  { value: 'rejected', label: 'Rejected', colorClass: 'red' },
];

const ExpensesContent: React.FC<ExpensesContentProps> = (props) => {
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [reviewingExpense, setReviewingExpense] = useState<Expense | null>(null);
  const hasLoadedOnce = useRef(false);

  if (!props.isFetchingList && !hasLoadedOnce.current) {
    hasLoadedOnce.current = true;
  }

  const isInitialLoad = props.isFetchingList && !hasLoadedOnce.current;

  // 1. CLIENT-SIDE FILTERING LOGIC
  const filteredData = useMemo(() => {
    if (!Array.isArray(props.tableData)) return [];
    return props.tableData.filter((exp: Expense) => {
      const title = (exp.title || "").toLowerCase();
      const category = (exp.category || "").toLowerCase();
      const term = (props.searchTerm || "").toLowerCase();

      const matchesSearch = term === "" || title.includes(term) || category.includes(term);

      let matchesMonth = true;
      if ((props.selectedMonth?.length ?? 0) > 0 && exp.incurredDate) {
        const monthName = MONTH_OPTIONS[new Date(exp.incurredDate).getMonth()];
        matchesMonth = props.selectedMonth.includes(monthName);
      }

      let matchesDate = true;
      if (props.selectedDateFilter && exp.incurredDate) {
        const d1 = new Date(exp.incurredDate);
        const d2 = props.selectedDateFilter;
        matchesDate = d1.getFullYear() === d2.getFullYear() &&
          d1.getMonth() === d2.getMonth() &&
          d1.getDate() === d2.getDate();
      }

      const matchesUser = (props.selectedUserFilter?.length ?? 0) === 0 ||
        props.selectedUserFilter.includes(exp.createdBy.name);

      const matchesCategory = (props.selectedCategoryFilter?.length ?? 0) === 0 ||
        props.selectedCategoryFilter.includes(exp.category);

      const reviewerName = exp.approvedBy?.name || "None";
      const matchesReviewer = (props.selectedReviewerFilter?.length ?? 0) === 0 ||
        props.selectedReviewerFilter.includes(reviewerName);

      return matchesSearch && matchesMonth && matchesDate && matchesUser && matchesCategory && matchesReviewer;
    });
  }, [props.tableData, props.searchTerm, props.selectedMonth, props.selectedDateFilter, props.selectedUserFilter, props.selectedCategoryFilter, props.selectedReviewerFilter]);

  // 2. REUSE TABLE SELECTION HOOK
  //const { selectedIds, toggleRow, selectAll, clearSelection } = useTableSelection(filteredData);

  const { selectedIds, clearSelection } = useTableSelection(filteredData);

  // 3. DYNAMIC FILTER OPTIONS
  const uniqueSubmitters = useMemo(() => {
    return Array.from(new Set(props.tableData.map(e => e.createdBy.name))).sort();
  }, [props.tableData]);

  const uniqueCategories = useMemo(() => {
    return Array.from(new Set(props.tableData.map(e => e.category))).sort();
  }, [props.tableData]);

  const uniqueReviewers = useMemo(() => {
    return Array.from(new Set(props.tableData.map(e => e.approvedBy?.name || "None"))).sort();
  }, [props.tableData]);

  const handleStatusClick = (exp: Expense) => {
    const status = exp.status.toLowerCase();
    if (status === 'approved' || status === 'rejected') {
      toast.error(`This record is already ${status.toUpperCase()} and cannot be modified.`);
      return;
    }

    if (exp.createdBy.id === props.currentUserId) {
      toast.error("Security Policy: You cannot approve or reject your own expense submissions.");
      return;
    }

    setReviewingExpense(exp);
  };

  const startIndex = (props.currentPage - 1) * props.ITEMS_PER_PAGE;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col p-0 md:p-2 relative">
      <SkeletonTheme baseColor="#e2e8f0" highlightColor="#f1f5f9">

        {/* Show full page skeleton on initial load */}
        {isInitialLoad ? (
          <ExpensesSkeleton rows={props.ITEMS_PER_PAGE} />
        ) : (
          <div className="w-full flex flex-col ">

            {/* HEADER appears only after initial load */}
            <ExpensesHeader
              searchTerm={props.searchTerm}
              setSearchTerm={props.setSearchTerm}
              isFilterVisible={isFilterVisible}
              setIsFilterVisible={setIsFilterVisible}
              selectedCount={selectedIds.length}
              onBulkDelete={() => { props.handleBulkDelete(selectedIds); clearSelection(); }}
              onExportPdf={() => props.onExportPdf(filteredData)}
              onExportExcel={() => props.onExportExcel(filteredData)}
              handleCreate={props.handleCreate}
              setCurrentPage={props.setCurrentPage}
            />

            {/* CONTENT */}
            <div className="px-0 md:px-0">
              <FilterBar
                isVisible={isFilterVisible}
                onClose={() => setIsFilterVisible(false)}
                onReset={() => {
                  props.setSelectedDateFilter(null);
                  props.setSelectedMonth([]);
                  props.setSelectedUserFilter([]);
                  props.setSelectedCategoryFilter([]);
                  props.setSelectedReviewerFilter([]);
                  props.setSearchTerm("");
                  props.setCurrentPage(1);
                }}
              >
                <FilterDropdown
                  label="Submitted By"
                  selected={props.selectedUserFilter || []}
                  options={uniqueSubmitters}
                  onChange={(val: string[]) => { props.setSelectedUserFilter(val); props.setCurrentPage(1); }}
                />
                <FilterDropdown
                  label="Category"
                  selected={props.selectedCategoryFilter || []}
                  options={uniqueCategories}
                  onChange={(val: string[]) => { props.setSelectedCategoryFilter(val); props.setCurrentPage(1); }}
                />
                <FilterDropdown
                  label="Reviewer"
                  selected={props.selectedReviewerFilter || []}
                  options={uniqueReviewers}
                  onChange={(val: string[]) => { props.setSelectedReviewerFilter(val); props.setCurrentPage(1); }}
                />
                <FilterDropdown
                  label="Month"
                  selected={props.selectedMonth || []}
                  options={MONTH_OPTIONS}
                  onChange={(val: string[]) => { props.setSelectedMonth(val); props.setCurrentPage(1); }}
                />
                <div className="flex flex-col min-w-[140px]">
                  <DatePicker
                    value={props.selectedDateFilter}
                    onChange={(date: Date | null) => { props.setSelectedDateFilter(date); props.setCurrentPage(1); }}
                    placeholder="Incurred Date"
                    isClearable
                    className="bg-none border-gray-100 text-sm text-gray-900 font-semibold placeholder:text-gray-900"
                  />
                </div>
              </FilterBar>
            </div>

            {/* SHOW EMPTY STATE IF NO DATA */}
            {filteredData.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-4">
                <div className="bg-gray-100 rounded-full p-6 mb-4">
                  <svg
                    className="w-16 h-16 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No Expenses Found
                </h3>
                <p className="text-gray-500 text-center max-w-md">
                  {props.searchTerm || props.selectedDateFilter || props.selectedMonth.length > 0 ||
                    props.selectedUserFilter.length > 0 || props.selectedCategoryFilter.length > 0 ||
                    props.selectedReviewerFilter.length > 0
                    ? "No expenses match your current filters. Try adjusting your search criteria."
                    : "No expense records available. Create your first expense to get started."}
                </p>
              </div>
            ) : (
              <>
                {/* DESKTOP TABLE */}
                <div className="hidden md:block">
                  <ExpenseTable
                    data={filteredData}
                    selectedIds={selectedIds}
                    //onToggle={toggleRow}
                    //onSelectAll={(checked) => selectAll(checked)}
                    onBadgeClick={handleStatusClick}
                    startIndex={startIndex}
                  />
                </div>

                {/* MOBILE CARDS */}
                <div className="md:hidden block w-full">
                  <ExpenseMobileList
                    data={filteredData}
                    selectedIds={selectedIds}
                    //onToggle={toggleRow}
                    onBadgeClick={handleStatusClick}
                  />
                </div>
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
        isSaving={props.isUpdatingStatus}
        onSave={(newVal: string) => {
          if (reviewingExpense) props.onUpdateStatus(reviewingExpense.id, newVal);
          setReviewingExpense(null);
        }}
      />
    </motion.div>
  );

};

export default ExpensesContent;