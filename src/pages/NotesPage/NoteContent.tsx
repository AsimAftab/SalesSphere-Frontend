import React from "react";
import { motion } from "framer-motion";
import NoteHeader from "./components/NoteHeader";
import NoteTable from "./components/NoteTable";
import NoteMobileList from "./components/NoteMobileList";
import NoteSkeleton from "./components/NoteSkeleton";
import { type Note } from "@/api/notesService";
import { useAuth } from "@/api/authService"; // Import useAuth
import NotesIcon from "@/assets/images/icons/notes-icon.svg";
import { EmptyState, FilterBar, FilterDropdown, DatePicker, Pagination } from '@/components/ui';


// --- NEW FILTER COMPONENT IMPORTS ---

interface Props {
  // Data
  data: Note[]; // Should be pre-paginated data (paginatedNotes)
  fullDataLength: number; // For "Showing X of Y"
  isFetching: boolean;

  // Search
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  // Actions
  onBulkDelete: (ids: string[]) => void;
  onExportPdf: (data: Note[]) => void; // Expects full filtered data
  onExportExcel: (data: Note[]) => void; // Expects full filtered data
  handleCreate: () => void;

  // Pagination Props
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
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

  // --- SELECTION PROPS ---
  selectedIds: string[];
  onToggleSelection: (id: string) => void;
  onSelectAll: (ids: string[]) => void;
}

const NoteContent: React.FC<Props> = (props) => {
  const { hasPermission } = useAuth(); // Hook usage

  // Permission Checks
  const canCreate = hasPermission('notes', 'create');
  const canExportPdf = hasPermission('notes', 'exportPdf');
  const canExportExcel = hasPermission('notes', 'exportExcel');
  const canBulkDelete = hasPermission('notes', 'bulkDelete');
  // const canDelete = hasPermission('notes', 'delete'); // For individual rows if needed

  // --- Loading State ---
  if (props.isFetching && props.data.length === 0) {
    return <NoteSkeleton rows={props.ITEMS_PER_PAGE} />;
  }

  // Handle Select All (Toggle between all IDs on page vs empty)
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      props.onSelectAll(props.data.map((n) => n.id));
    } else {
      props.onSelectAll([]);
    }
  };

  const startIndex = (props.currentPage - 1) * props.ITEMS_PER_PAGE;

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
        selectedCount={props.selectedIds.length}
        onBulkDelete={() => {
          props.onBulkDelete(props.selectedIds);
        }}
        onOpenCreateModal={props.handleCreate}
        // Note: Export actions usually need full filtered dataset, not just paginated page.
        // Assuming parent passes full filtered data via a different prop or we accept that export might look different?
        // Actually, props.onExportPdf calls take 'data'. If we pass 'props.data' here it's just the page.
        // But the parent 'NotesPage' likely has access to full 'manager.notes'.
        // Let's assume the parent handles the data passing to onExportPdf/Excel closures.
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
      <div className="relative flex-grow">
        {props.data.length > 0 ? (
          <>
            <div className="hidden md:block">
              <NoteTable
                data={props.data} // Pre-paginated
                selectedIds={props.selectedIds}
                onToggle={props.onToggleSelection}
                onSelectAll={handleSelectAll}
                startIndex={startIndex}
              />
            </div>

            <div className="md:hidden">
              <NoteMobileList
                data={props.data} // Pre-paginated
                selectedIds={props.selectedIds}
                onToggle={props.onToggleSelection}
              />
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={props.currentPage}
              totalItems={props.fullDataLength}
              itemsPerPage={props.ITEMS_PER_PAGE}
              onPageChange={props.setCurrentPage}
            />
          </>
        ) : (
          <EmptyState
            title="No Notes Found"
            description={
              props.searchQuery || props.selectedDate || props.selectedMonth.length > 0 ||
                props.selectedEmployee.length > 0 || props.selectedEntityType.length > 0
                ? "No notes match your current filters. Try adjusting your search criteria."
                : "No note records available. Create your first note to get started."
            }
            icon={
              <img
                src={NotesIcon}
                alt="No Notes"
                className="w-16 h-16 opacity-50 filter grayscale"
              />
            }
          />
        )}
      </div>
    </motion.div>
  );
};

export default NoteContent;