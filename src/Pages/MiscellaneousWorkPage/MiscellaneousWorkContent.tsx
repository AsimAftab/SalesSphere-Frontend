import React from "react";
import { motion } from "framer-motion";
import { EmptyState } from "../../components/UI/EmptyState/EmptyState";
import { MiscWorkHeader } from "./components/MiscWorkHeader";
import FilterBar from "../../components/UI/FilterDropDown/FilterBar";
import FilterDropdown from "../../components/UI/FilterDropDown/FilterDropDown";
import DatePicker from "../../components/UI/DatePicker/DatePicker";
import { MiscWorkTable } from "./components/MiscWorkTable";
import { MiscWorkMobileList } from "./components/MiscWorkMobileList";
import MiscellaneouSkeleton from "./components/MiscWorkSkeletons";
import Pagination from "../../components/UI/Page/Pagination";
import { type MiscWork } from "../../api/miscellaneousWorkService";

interface MiscellaneousWorkContentProps {
  state: {
    miscWorks: MiscWork[];
    totalItems: number;
    currentPage: number;
    searchQuery: string;
    isFilterVisible: boolean; // Added
    isFetching: boolean; // Added
    filters: {
      date: Date | null;
      months: string[];
      employees: string[];
      assigners: string[];
    };
    modals: any;
    selectedIds: string[];
    employeeOptions: { label: string; value: string }[];
    assignerOptions: { label: string; value: string }[];
  };
  actions: {
    setCurrentPage: (page: number) => void;
    setSearchQuery: (query: string) => void; // Added
    setIsFilterVisible: (visible: boolean) => void; // Added
    setFilters: (filters: any) => void; // Added
    onResetFilters: () => void; // Added
    setSelectedIds: (ids: string[] | ((prev: string[]) => string[])) => void;
    modals: {
      openImageModal: (images: string[]) => void;
      openDeleteModal: (ids: string[]) => void;
    };
  };
  permissions: {
    canDelete: boolean;
    canViewDetails: boolean;
    canExportPdf: boolean;
    canExportExcel: boolean;
  };
  onExportPdf?: (data: MiscWork[]) => void;
  onExportExcel?: (data: MiscWork[]) => void;
}

const MiscellaneousWorkContent: React.FC<MiscellaneousWorkContentProps> = ({ state, actions, permissions, onExportPdf, onExportExcel }) => {
  const { miscWorks, totalItems, currentPage, searchQuery, filters, selectedIds, isFetching, isFilterVisible } = state;
  const { setCurrentPage, setSelectedIds, modals, setSearchQuery, setIsFilterVisible } = actions;

  // Local Helpers for Selection since hook doesn't provide them standardly
  const toggleRow = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const selectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(miscWorks.map(w => w._id));
    } else {
      setSelectedIds([]);
    }
  };

  if (isFetching && miscWorks.length === 0) {
    return (
      <div className="flex-1 flex flex-col p-4 sm:p-0">
        <MiscellaneouSkeleton
          rows={10}
          isFilterVisible={isFilterVisible}
          permissions={permissions}
        />
      </div>
    );
  }

  const startIndex = (currentPage - 1) * 10;
  const ITEMS_PER_PAGE = 10;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-full"
    >
      <MiscWorkHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isFilterVisible={isFilterVisible}
        setIsFilterVisible={setIsFilterVisible}
        selectedCount={selectedIds.length}
        onBulkDelete={() => modals.openDeleteModal(selectedIds)}
        canExportPdf={permissions.canExportPdf}
        canExportExcel={permissions.canExportExcel}
        onExportPdf={() => onExportPdf && onExportPdf(miscWorks)}
        onExportExcel={() => onExportExcel && onExportExcel(miscWorks)}
      />

      {/* Filter Section */}
      <FilterBar
        isVisible={isFilterVisible}
        onClose={() => setIsFilterVisible(false)}
        onReset={actions.onResetFilters}
      >
        <FilterDropdown
          label="Employee"
          options={state.employeeOptions.map(opt => opt.value)}
          selected={filters.employees}
          onChange={(val) => actions.setFilters({ ...filters, employees: val })}
        />
        <FilterDropdown
          label="Assigner"
          options={state.assignerOptions.map(opt => opt.value)}
          selected={filters.assigners}
          onChange={(val) => actions.setFilters({ ...filters, assigners: val })}
        />
        <FilterDropdown
          label="Month"
          options={["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]}
          selected={filters.months}
          onChange={(val) => actions.setFilters({ ...filters, months: val })}
        />
        <div className="min-w-[140px] flex-1 sm:flex-none">
          <DatePicker
            value={filters.date}
            onChange={(val) => actions.setFilters({ ...filters, date: val })}
            placeholder="Work Date"
            isClearable
            className="bg-none border-gray-100 text-sm text-gray-900 font-semibold placeholder:text-gray-900"
          />
        </div>
      </FilterBar>

      <div className="flex-1 overflow-hidden flex flex-col">
        {miscWorks.length > 0 ? (
          <>
            <div className="hidden md:block flex-1 overflow-auto">
              <MiscWorkTable
                data={miscWorks}
                selectedIds={selectedIds}
                onToggle={toggleRow}
                onSelectAll={selectAll}
                onViewImage={modals.openImageModal}
                onDelete={(id: string) => modals.openDeleteModal([id])}
                startIndex={startIndex}
                canDelete={permissions.canDelete}
              />
            </div>

            <div className="md:hidden flex-1 overflow-auto">
              <MiscWorkMobileList
                data={miscWorks}
                selectedIds={selectedIds}
                onToggle={toggleRow}
                onViewImage={modals.openImageModal}
                onDelete={(id: string) => modals.openDeleteModal([id])}
                canDelete={permissions.canDelete}
              />
            </div>

            <div className="flex-shrink-0">
              <Pagination
                currentPage={currentPage}
                totalItems={totalItems}
                itemsPerPage={ITEMS_PER_PAGE}
                onPageChange={setCurrentPage}
              />
            </div>
          </>
        ) : (
          <EmptyState
            title="No Miscellaneous Work Found"
            description={searchQuery || filters.date || filters.months.length > 0 ||
              filters.employees.length > 0 || filters.assigners.length > 0
              ? "No work records match your current filters. Try adjusting your search criteria."
              : "No miscellaneous work records available. Records of miscellaneous work will appear here."}
            icon={
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
            }
          />
        )}
      </div>
    </motion.div>
  );
};

export default MiscellaneousWorkContent;