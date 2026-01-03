import React, { useState } from "react";
import { motion } from "framer-motion";
import NoteHeader from "./components/NoteHeader";
import NoteTable from "./components/NoteTable";
import NoteMobileList from "./components/NoteMobileList";
import NoteSkeleton from "./components/NoteSkeleton";
import Button from "../../components/UI/Button/Button";
import { type Note } from "../../api/notesService";

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
      <div className="relative mt-4 flex-grow">
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
          <div className="text-center p-20 bg-white border rounded-xl text-gray-400 font-medium">
            No notes found matching the selected filters.
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default NoteContent;