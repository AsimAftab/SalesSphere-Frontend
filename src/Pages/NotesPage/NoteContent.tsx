import React, { useState } from "react";
import { motion } from "framer-motion";
import NoteHeader from "./components/NoteHeader";
import NoteTable from "./components/NoteTable";
import NoteMobileList from "./components/NoteMobileList";
import NoteSkeleton from "./components/NoteSkeleton";
import Button from "../../components/UI/Button/Button";
import { type Note } from "../../api/notesService";
import { useAuth } from "../../api/authService"; // Import useAuth

// --- NEW FILTER COMPONENT IMPORTS ---
import FilterBar from "../../components/UI/FilterDropDown/FilterBar";
import FilterDropdown from "../../components/UI/FilterDropDown/FilterDropDown";
import DatePicker from "../../components/UI/DatePicker/DatePicker";

interface Props {
  data: Note[];
  isFetching: boolean;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onBulkDelete: (ids: string[]) => void;
  onExportPdf: (data: Note[]) => void;
  onExportExcel: (data: Note[]) => void;
  handleCreate: () => void;

  // Pagination Props
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  ITEMS_PER_PAGE: number;

  // --- NEW FILTER PROPS ---
  isFilterVisible: boolean;
  setIsFilterVisible: (visible: boolean) => void;
  onResetFilters: () => void;
  employeeOptions: string[];
  selectedEmployee: string[];
  setSelectedEmployee: (val: string[]) => void;
  selectedMonth: string[];
  setSelectedMonth: (val: string[]) => void;
  selectedDate: Date | null;
  setSelectedDate: (val: Date | null) => void;
  selectedEntityType: string[];
  setSelectedEntityType: (val: string[]) => void;
}

const NoteContent: React.FC<Props> = (props) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const { hasPermission } = useAuth(); // Hook usage

  // Permission Checks
  const canCreate = hasPermission('notes', 'create');
  const canExportPdf = hasPermission('notes', 'exportPdf');
  const canExportExcel = hasPermission('notes', 'exportExcel');
  const canBulkDelete = hasPermission('notes', 'bulkDelete');
  // const canDelete = hasPermission('notes', 'delete'); // For individual rows if needed

  // --- Pagination Logic ---
  const totalPages = Math.ceil(props.data.length / props.ITEMS_PER_PAGE);
  const startIndex = (props.currentPage - 1) * props.ITEMS_PER_PAGE;
  const paginatedData = props.data.slice(startIndex, startIndex + props.ITEMS_PER_PAGE);

  // --- Selection Handlers ---
  const toggleRow = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const selectAll = (checked: boolean) => {
    setSelectedIds(checked ? paginatedData.map(x => x.id) : []);
  };

  // --- Loading State ---
  if (props.isFetching && props.data.length === 0) {
    return <NoteSkeleton rows={props.ITEMS_PER_PAGE} />;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col">
      {/* 1. Integrated Header with Filter Toggle */}
      <NoteHeader
        searchQuery={props.searchQuery}
        setSearchQuery={(q) => {
          props.setSearchQuery(q);
          props.setCurrentPage(1); // Reset to page 1 on search
        }}
        isFilterVisible={props.isFilterVisible}
        setIsFilterVisible={props.setIsFilterVisible}
        selectedCount={selectedIds.length}
        onBulkDelete={() => {
          props.onBulkDelete(selectedIds);
          setSelectedIds([]); // Clear local selection after delete
        }}
        onOpenCreateModal={props.handleCreate}
        onExportPdf={() => props.onExportPdf(props.data)}
        onExportExcel={() => props.onExportExcel(props.data)}
        setCurrentPage={props.setCurrentPage}

        // Pass Permissions
        canCreate={canCreate}
        canExportPdf={canExportPdf}
        canExportExcel={canExportExcel}
        canBulkDelete={canBulkDelete}
      />

      {/* 2. Toggleable Filter Bar Section */}
      <div className="px-0">
        <FilterBar
          isVisible={props.isFilterVisible}
          onClose={() => props.setIsFilterVisible(false)}
          onReset={props.onResetFilters}
        >
          <FilterDropdown
            label="Created By"
            options={props.employeeOptions}
            selected={props.selectedEmployee}
            onChange={props.setSelectedEmployee}
          />
          <FilterDropdown
            label="Entity Type"
            options={["Party", "Prospect", "Site"]}
            selected={props.selectedEntityType}
            onChange={props.setSelectedEntityType}
          />
          <FilterDropdown
            label="Month"
            options={[
              "January", "February", "March", "April", "May", "June",
              "July", "August", "September", "October", "November", "December"
            ]}
            selected={props.selectedMonth}
            onChange={props.setSelectedMonth}
          />
          <div className="min-w-[140px] flex-1 sm:flex-none">
            <DatePicker
              value={props.selectedDate}
              onChange={props.setSelectedDate}
              placeholder="Select Date"
              isClearable
              className="bg-none border-gray-100 text-sm text-gray-900 font-semibold placeholder:text-gray-900"
            />
          </div>
        </FilterBar>
      </div>

      {/* 3. Main Content Area */}
      <div className="relative  flex-grow">
        {props.data.length > 0 ? (
          <>
            <div className="hidden md:block">
              <NoteTable
                data={paginatedData}
                selectedIds={selectedIds}
                onToggle={toggleRow}
                onSelectAll={selectAll}
                startIndex={startIndex}
              />
            </div>

            <div className="md:hidden">
              <NoteMobileList
                data={paginatedData}
                selectedIds={selectedIds}
                onToggle={toggleRow}
              />
            </div>

            {/* Pagination Controls */}
            {props.data.length > props.ITEMS_PER_PAGE && (
              <div className="flex items-center justify-between p-6 text-sm text-gray-500">
                <p className="hidden sm:block">
                  Showing {startIndex + 1} to {Math.min(startIndex + props.ITEMS_PER_PAGE, props.data.length)} of {props.data.length}
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
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Notes Found
            </h3>
            <p className="text-gray-500 text-center max-w-md">
              {props.searchQuery || props.selectedDate || props.selectedMonth.length > 0 ||
                props.selectedEmployee.length > 0 || props.selectedEntityType.length > 0
                ? "No notes match your current filters. Try adjusting your search criteria."
                : "No note records available. Create your first note to get started."}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default NoteContent;