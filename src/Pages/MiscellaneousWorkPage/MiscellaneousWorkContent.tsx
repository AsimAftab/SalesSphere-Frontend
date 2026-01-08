import React, { useState } from "react";
import { motion } from "framer-motion";
import "react-loading-skeleton/dist/skeleton.css";

import Button from "../../components/UI/Button/Button";
import DatePicker from "../../components/UI/DatePicker/DatePicker";
import FilterDropdown from '../../components/UI/FilterDropDown/FilterDropDown';
import FilterBar from "../../components/UI/FilterDropDown/FilterBar";

import { MiscWorkHeader } from "./components/MiscWorkHeader";
import { MiscWorkTable } from "./components/MiscWorkTable";
import { MiscWorkMobileList } from "./components/MiscWorkMobileList";
import { MiscellaneouSkeleton } from "./components/MiscWorkSkeletons";
import { type MiscWork as MiscWorkType } from "../../api/miscellaneousWorkService";

interface MiscellaneousWorkContentProps {
  tableData: MiscWorkType[];
  isFetchingList: boolean;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  ITEMS_PER_PAGE: number;

  // Filter Props
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

  // Actions
  handleViewImage: (images: string[]) => void;
  onDelete: (id: string) => void;
  onBulkDelete: (ids: string[]) => void;
  onExportPdf: (data: MiscWorkType[]) => void;
  onExportExcel: (data: MiscWorkType[]) => void;

  // Permissions
  canDelete: boolean;
  canExportPdf: boolean;
  canExportExcel: boolean;
}

const MONTH_OPTIONS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const MiscellaneousWorkContent: React.FC<MiscellaneousWorkContentProps> = (props) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // --- 1. Pagination Logic ---
  const totalPages = Math.ceil(props.tableData.length / props.ITEMS_PER_PAGE);
  const startIndex = (props.currentPage - 1) * props.ITEMS_PER_PAGE;
  const paginatedData = props.tableData.slice(startIndex, startIndex + props.ITEMS_PER_PAGE);

  // --- 2. Selection Handlers ---
  const toggleRow = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const selectAll = (checked: boolean) => {
    setSelectedIds(checked ? paginatedData.map(x => x._id) : []);
  };

  // --- 3. Skeleton Loading Implementation ---
  // Early return if fetching and no data exists (Matches NoteContent pattern)
  if (props.isFetchingList && props.tableData.length === 0) {
    return <MiscellaneouSkeleton rows={props.ITEMS_PER_PAGE} />;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col">

      {/* 1. Header Section */}
      <MiscWorkHeader
        searchQuery={props.searchQuery}
        setSearchQuery={(val) => {
          props.setSearchQuery(val);
          props.setCurrentPage(1); // Reset to page 1 on search
        }}
        isFilterVisible={props.isFilterVisible}
        setIsFilterVisible={props.setIsFilterVisible}
        selectedCount={selectedIds.length}
        onBulkDelete={() => {
          props.onBulkDelete(selectedIds);
          setSelectedIds([]); // Clear local selection after delete
        }}
        canExportPdf={props.canExportPdf}
        canExportExcel={props.canExportExcel}
        onExportPdf={() => props.onExportPdf(props.tableData)}
        onExportExcel={() => props.onExportExcel(props.tableData)}
      />

      {/* 2. Filter Bar Section */}
      <div className="px-0">
        <FilterBar
          isVisible={props.isFilterVisible}
          onClose={() => props.setIsFilterVisible(false)}
          onReset={props.onResetFilters}
        >
          <FilterDropdown
            label="Created By"
            options={props.employeeOptions.map(opt => opt.label)}
            selected={props.selectedEmployee}
            onChange={props.setSelectedEmployee}
          />
          <FilterDropdown
            label="Month"
            options={MONTH_OPTIONS}
            selected={props.selectedMonth}
            onChange={props.setSelectedMonth}
          />
          <div className="min-w-[140px] flex-1 sm:flex-none">
            <DatePicker
              value={props.selectedDate}
              onChange={props.setSelectedDate}
              placeholder="Work Date"
              isClearable
              className="bg-none border-gray-100 text-sm text-gray-900 font-semibold placeholder:text-gray-900"
            />
          </div>
        </FilterBar>
      </div>

      {/* 3. Main Content Area */}
      <div className="relative  flex-grow">
        {props.tableData.length > 0 ? (
          <>
            <div className="hidden md:block">
              <MiscWorkTable
                data={paginatedData}
                selectedIds={selectedIds}
                onToggle={toggleRow}
                onSelectAll={selectAll}
                onViewImage={props.handleViewImage}
                onDelete={props.onDelete}
                startIndex={startIndex}
                canDelete={props.canDelete}
              />
            </div>

            <div className="md:hidden">
              <MiscWorkMobileList
                data={paginatedData}
                selectedIds={selectedIds}
                onToggle={toggleRow}
                onViewImage={props.handleViewImage}
                onDelete={props.onDelete}
                canDelete={props.canDelete}
              />
            </div>

            {/* Pagination Controls */}
            {props.tableData.length > props.ITEMS_PER_PAGE && (
              <div className="flex items-center justify-between p-6 text-sm text-gray-500">
                <p className="hidden sm:block">
                  Showing {startIndex + 1} to {Math.min(startIndex + props.ITEMS_PER_PAGE, props.tableData.length)} of {props.tableData.length}
                </p>
                <div className="flex items-center gap-2 w-full sm:w-auto justify-center">
                  <Button
                    onClick={() => props.setCurrentPage((prev) => prev - 1)}
                    variant="secondary"
                    disabled={props.currentPage === 1}
                    className="px-3 py-1 text-xs"
                  >
                    Prev
                  </Button>
                  <span className="px-4 font-bold text-gray-900 text-xs">
                    {props.currentPage} / {totalPages}
                  </span>
                  <Button
                    onClick={() => props.setCurrentPage((prev) => prev + 1)}
                    variant="secondary"
                    disabled={props.currentPage >= totalPages}
                    className="px-3 py-1 text-xs"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
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
                  d="M9 5H6a2 2 0 01-2-2V5a2 2 0 01-2 2m2 0h10a2 2 0 012 2v2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Miscellaneous Work Found
            </h3>
            <p className="text-gray-500 text-center max-w-md">
              {props.searchQuery || props.selectedDate || props.selectedMonth.length > 0 ||
                props.selectedEmployee.length > 0
                ? "No work records match your current filters. Try adjusting your search criteria."
                : "No miscellaneous work records available. Records of miscellaneous work will appear here."}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MiscellaneousWorkContent;