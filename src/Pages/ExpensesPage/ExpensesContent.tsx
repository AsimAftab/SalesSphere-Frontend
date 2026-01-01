import React, { useState, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from "lucide-react"; 
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

// Types
import { type Expense } from "../../api/expensesService";

// FIXED: Added missing interface definition
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
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [reviewingExpense, setReviewingExpense] = useState<Expense | null>(null);
  const hasLoadedOnce = useRef(false);

  // FIX: Mark as loaded once the first request finishes, even if data is empty
  if (!props.isFetchingList && !hasLoadedOnce.current) {
    hasLoadedOnce.current = true;
  }

  // Initial load is strictly for the very first fetch
  const isInitialLoad = props.isFetchingList && !hasLoadedOnce.current;

  // 1. CLIENT-SIDE FILTERING LOGIC
  const filteredData = useMemo(() => {
    if (!Array.isArray(props.tableData)) return [];
    return props.tableData.filter((exp: Expense) => { // FIXED: Added type
      const title = (exp.title || "").toLowerCase();
      const category = (exp.category || "").toLowerCase();
      const term = (props.searchTerm || "").toLowerCase();
      const matchesSearch = term === "" || title.includes(term) || category.includes(term);

      let matchesMonth = true;
      if (props.selectedMonth.length > 0 && exp.incurredDate) {
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

      const matchesUser = props.selectedUserFilter.length === 0 || props.selectedUserFilter.includes(exp.createdBy.name);
      return matchesSearch && matchesMonth && matchesDate && matchesUser;
    });
  }, [props.tableData, props.searchTerm, props.selectedMonth, props.selectedDateFilter, props.selectedUserFilter]);

  // 2. STABLE FILTER OPTIONS
  const uniqueSubmitters = useMemo(() => {
    const currentNames = props.tableData.map((e: Expense) => e.createdBy.name); // FIXED: Added type
    const combined = Array.from(new Set([...currentNames, ...props.selectedUserFilter]));
    return combined.sort();
  }, [props.tableData, props.selectedUserFilter]);

  // 3. FINALIZED STATUS GUARD
  const handleStatusClick = (exp: Expense) => {
    const status = exp.status.toLowerCase();
    if (status === 'approved' || status === 'rejected') {
      toast.error(`${status} status cannot be modified.`);
      return;
    }
    setReviewingExpense(exp);
  };

  const startIndex = (props.currentPage - 1) * props.ITEMS_PER_PAGE;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col p-0 md:p-2 relative">
      <SkeletonTheme baseColor="#e2e8f0" highlightColor="#f1f5f9">
        
        {/* --- HEADER: Always Visible --- */}
        <ExpensesHeader 
          searchTerm={props.searchTerm}
          setSearchTerm={props.setSearchTerm}
          isFilterVisible={isFilterVisible}
          setIsFilterVisible={setIsFilterVisible}
          selectedCount={selectedIds.length}
          onBulkDelete={() => { props.handleBulkDelete(selectedIds); setSelectedIds([]); }}
          onExportPdf={() => props.onExportPdf(filteredData)}
          onExportExcel={() => props.onExportExcel(filteredData)}
          handleCreate={props.handleCreate}
          setCurrentPage={props.setCurrentPage}
        />

        {/* --- FILTERS: Always Visible --- */}
        <div className="px-4 md:px-0">
          <FilterBar 
            isVisible={isFilterVisible} 
            onClose={() => setIsFilterVisible(false)} 
            onReset={() => {
              props.setSelectedDateFilter(null);
              props.setSelectedMonth([]);
              props.setSelectedUserFilter([]);
              props.setSearchTerm("");
              props.setCurrentPage(1);
            }}
          >
            <FilterDropdown 
              label="Submitter" 
              selected={props.selectedUserFilter} 
              options={uniqueSubmitters} 
              onChange={(val: string[]) => { props.setSelectedUserFilter(val); props.setCurrentPage(1); }} 
            />
            <FilterDropdown 
              label="Month" 
              selected={props.selectedMonth} 
              options={MONTH_OPTIONS} 
              onChange={(val: string[]) => { props.setSelectedMonth(val); props.setCurrentPage(1); }} 
            />
            <div className="flex flex-col min-w-[140px]">
              <DatePicker 
                value={props.selectedDateFilter} 
                onChange={(date: Date | null) => { props.setSelectedDateFilter(date); props.setCurrentPage(1); }}
                placeholder="Work Date" 
                isClearable 
                className="bg-none border-gray-100 text-sm text-gray-900 font-semibold" 
              />
            </div>
          </FilterBar>
        </div>

        {/* --- MAIN AREA: Only Data swaps with Skeleton/Empty --- */}
        <div className="relative flex-1 mt-4">
          {isInitialLoad ? (
            <ExpensesSkeleton rows={props.ITEMS_PER_PAGE} />
          ) : (
            <>
              {/* Refetching Overlay */}
              {props.isFetchingList && hasLoadedOnce.current && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/40 backdrop-blur-[1px] rounded-lg">
                  <Loader2 className="animate-spin text-secondary h-6 w-6" />
                </div>
              )}

              <div className={`transition-opacity duration-300 ${props.isFetchingList && hasLoadedOnce.current ? 'opacity-40' : 'opacity-100'}`}>
                {filteredData.length > 0 ? (
                  <>
                    <div className="hidden md:block">
                      <ExpenseTable 
                        data={filteredData} 
                        selectedIds={selectedIds} 
                        setSelectedIds={setSelectedIds} 
                        onBadgeClick={handleStatusClick} 
                        startIndex={startIndex} 
                      />
                    </div>
                    <div className="md:hidden block w-full px-0">
                      <ExpenseMobileList 
                        data={filteredData} 
                        selectedIds={selectedIds} 
                        setSelectedIds={setSelectedIds} 
                        onBadgeClick={handleStatusClick} 
                      />
                    </div>
                  </>
                ) : (
                  /* --- ENTERPRISE EMPTY STATE --- */
                  <div className="flex flex-col items-center justify-center p-16 bg-white rounded-2xl border border-dashed border-gray-200 mx-4 md:mx-0 shadow-sm">
                    <h3 className="text-lg  text-gray-900 tracking-tight">No Expense data has been recorded yet</h3>
                   
                   
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </SkeletonTheme>

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