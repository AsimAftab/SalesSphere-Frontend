import React, { useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css"; 
import { Loader2} from "lucide-react"; 

import Button from "../../components/UI/Button/Button";
import DatePicker from "../../components/UI/DatePicker/DatePicker";
import FilterDropdown from '../../components/UI/FilterDropDown/FilterDropDown';
import FilterBar from "../../components/UI/FilterDropDown/FilterBar"; 

import { useTableSelection } from "../../components/hooks/useTableSelection";
import { MiscWorkHeader } from "./components/MiscWorkHeader";
import { MiscWorkTable } from "./components/MiscWorkTable";
import { MiscWorkMobileList } from "./components/MiscWorkMobileList";
import { MiscellaneouSkeleton } from "./components/MiscWorkSkeletons";
import { type MiscWork as MiscWorkType } from "../../api/miscellaneousWorkService";

interface MiscellaneousWorkContentProps {
  tableData: MiscWorkType[];
  isFetchingList: boolean;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  totalItems: number;
  ITEMS_PER_PAGE: number;
  isFilterVisible: boolean;
  setIsFilterVisible: (visible: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
  selectedEmployee: string[]; 
  setSelectedEmployee: (ids: string[]) => void;
  selectedMonth: string[];
  setSelectedMonth: (months: string[]) => void;
  employeeOptions: { label: string; value: string }[];
  onResetFilters: () => void;
  handleViewImage: (images: string[]) => void;
  onDelete: (id: string) => void;
  handleBulkDelete: (ids: string[]) => void; 
  onExportPdf: (data: MiscWorkType[]) => void; 
  onExportExcel: (data: MiscWorkType[]) => void;
}

const MONTH_OPTIONS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const MiscellaneousWorkContent: React.FC<MiscellaneousWorkContentProps> = (props) => {
  const { tableData, isFetchingList, currentPage, ITEMS_PER_PAGE, onResetFilters } = props;

  const hasLoadedOnce = useRef(false);

  // FIX: Mark as loaded once the first request finishes, even if data is empty
  if (!isFetchingList && !hasLoadedOnce.current) {
    hasLoadedOnce.current = true;
  }

  // Initial load is only true during the very first active fetch
  const isInitialLoad = isFetchingList && !hasLoadedOnce.current;

  const filteredData = useMemo(() => {
    if (!Array.isArray(tableData)) return [];
    return tableData.filter((work) => {
      const nature = (work.natureOfWork || "").toLowerCase();
      const addr = (work.address || "").toLowerCase();
      const emp = (work.employee?.name || "").toLowerCase();
      const term = (props.searchQuery || "").toLowerCase();

      const matchesSearch = term === "" || nature.includes(term) || addr.includes(term) || emp.includes(term);

      let matchesMonth = true;
      if (props.selectedMonth.length > 0 && work.workDate) {
        const monthName = MONTH_OPTIONS[new Date(work.workDate).getMonth()];
        matchesMonth = props.selectedMonth.includes(monthName);
      }

      let matchesDate = true;
      if (props.selectedDate && work.workDate) {
        const d1 = new Date(work.workDate);
        const d2 = props.selectedDate;
        matchesDate = d1.getFullYear() === d2.getFullYear() &&
                      d1.getMonth() === d2.getMonth() &&
                      d1.getDate() === d2.getDate();
      }

      return matchesSearch && matchesMonth && matchesDate;
    });
  }, [tableData, props.searchQuery, props.selectedMonth, props.selectedDate]);

  const { selectedIds, toggleRow, selectAll, clearSelection } = useTableSelection(filteredData);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col relative p-0 md:p-2">
      <SkeletonTheme baseColor="#e2e8f0" highlightColor="#f1f5f9">
        
        {/* 1. HEADER SECTION: Always Visible after initial logic */}
        <MiscWorkHeader 
          searchQuery={props.searchQuery}
          setSearchQuery={(val) => { props.setSearchQuery(val); props.setCurrentPage(1); }}
          isFilterVisible={props.isFilterVisible}
          setIsFilterVisible={props.setIsFilterVisible}
          selectedCount={selectedIds.length}
          onBulkDelete={() => { props.handleBulkDelete(selectedIds); clearSelection(); }}
          onExportPdf={() => props.onExportPdf(filteredData)}
          onExportExcel={() => props.onExportExcel(filteredData)}
        />

        {/* 2. FILTERS SECTION: Always Visible */}
        <FilterBar isVisible={props.isFilterVisible} onClose={() => props.setIsFilterVisible(false)} onReset={onResetFilters}>
          <FilterDropdown 
              label="Created By" 
              options={props.employeeOptions.map((opt) => opt.label)} 
              selected={props.selectedEmployee} 
              onChange={(val) => { props.setSelectedEmployee(val); props.setCurrentPage(1); }} 
          />
          <FilterDropdown 
              label="Month" 
              options={MONTH_OPTIONS} 
              selected={props.selectedMonth} 
              onChange={(val) => { props.setSelectedMonth(val); props.setCurrentPage(1); }} 
          />
          <div className="flex flex-col min-w-[140px] flex-1 sm:flex-none">
            <DatePicker 
              value={props.selectedDate} 
              onChange={(date) => { props.setSelectedDate(date); props.setCurrentPage(1); }} 
              placeholder="Work Date" 
              isClearable 
              className="bg-none border-gray-100 text-sm text-gray-900 font-semibold placeholder:text-gray-900" 
            />
          </div>
        </FilterBar>

        {/* 3. MAIN DATA AREA: Swaps between Skeleton, Data, or Empty Message */}
        <div className="relative flex-1 mt-4">
          {isInitialLoad ? (
            <MiscellaneouSkeleton rows={ITEMS_PER_PAGE} />
          ) : (
            <>
              {/* Background Overlay for background fetches */}
              {isFetchingList && hasLoadedOnce.current && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/40 backdrop-blur-[1px] rounded-lg">
                  <div className="bg-white p-3 rounded-full shadow-xl border border-gray-100">
                    <Loader2 className="animate-spin text-secondary h-6 w-6" />
                  </div>
                </div>
              )}

              <div className={`transition-opacity duration-300 ${isFetchingList && hasLoadedOnce.current ? 'opacity-40' : 'opacity-100'}`}>
                {filteredData.length > 0 ? (
                  <>
                    <div className="hidden md:block">
                      <MiscWorkTable 
                        data={filteredData} 
                        selectedIds={selectedIds} 
                        onToggle={toggleRow} 
                        onSelectAll={(checked) => selectAll(checked)}
                        onViewImage={props.handleViewImage}
                        onDelete={props.onDelete}
                        startIndex={(currentPage - 1) * ITEMS_PER_PAGE}
                      />
                    </div>
                    <div className="md:hidden block w-full px-0">
                      <MiscWorkMobileList 
                        data={filteredData} 
                        selectedIds={selectedIds} 
                        onToggle={toggleRow}
                        onViewImage={props.handleViewImage}
                        onDelete={props.onDelete}
                      />
                    </div>
                  </>
                ) : (
                  /* --- THE EMPTY STATE MESSAGE --- */
                  <div className="flex flex-col items-center justify-center p-10 bg-white rounded-2xl border border-dashed border-gray-200 mx-4 md:mx-0 shadow-sm">
                    <h3 className="text-lg text-gray-900">No data has been recorded yet</h3>
                    
                  </div>
                )}

                {/* 4. PAGINATION SECTION */}
                {props.totalItems > ITEMS_PER_PAGE && (
                  <div className="flex flex-row items-center justify-between p-4 sm:p-6 text-sm text-gray-500">
                    <p className="hidden sm:block">Showing {filteredData.length} records</p>
                    <div className="flex items-center gap-2 w-full sm:w-auto justify-center">
                      <Button 
                        onClick={() => props.setCurrentPage(currentPage - 1)} 
                        variant="secondary" 
                        disabled={currentPage === 1 || isFetchingList} 
                        className="px-3 py-1 text-xs"
                      >
                        Prev
                      </Button>
                      <span className="px-2 font-bold text-gray-900 text-xs">
                        {currentPage} / {props.totalPages}
                      </span>
                      <Button 
                        onClick={() => props.setCurrentPage(currentPage + 1)} 
                        variant="secondary" 
                        disabled={currentPage >= props.totalPages || isFetchingList} 
                        className="px-3 py-1 text-xs"
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </SkeletonTheme>
    </motion.div>
  );
};

export default MiscellaneousWorkContent;