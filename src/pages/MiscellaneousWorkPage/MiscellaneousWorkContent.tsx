import React from "react";
import { motion } from "framer-motion";
import { MiscWorkHeader } from "./components/MiscWorkHeader";
import { MiscWorkTable } from "./components/MiscWorkTable";
import { MiscWorkMobileList } from "./components/MiscWorkMobileList";
import MiscellaneouSkeleton from "./components/MiscWorkSkeletons";
import { type MiscWork } from "@/api/miscellaneousWorkService";
import miscellaneousWorkIcon from "@/assets/images/icons/miscellaneous-work-icon.svg";
import { EmptyState, FilterBar, FilterDropdown, DatePicker, Pagination } from '@/components/ui';

interface MiscellaneousWorkContentProps {
  state: {
    miscWorks: MiscWork[]; // Full filtered data (for export)
    paginatedMiscWorks: MiscWork[]; // Sliced data (for table)
    totalItems: number;
    totalPages: number;
    itemsPerPage: number;
    currentPage: number;
    searchQuery: string;
    isFilterVisible: boolean;
    isFetching: boolean;
    filters: {
      date: Date | null;
      months: string[];
      employees: string[];
      assigners: string[];
    };
    modals: {
      isImageModalOpen: boolean;
      imagesToView: string[];
      isDeleteModalOpen: boolean;
    };
    selectedIds: string[];
    employeeOptions: { label: string; value: string }[];
    assignerOptions: { label: string; value: string }[];
  };
  actions: {
    setCurrentPage: (page: number) => void;
    setSearchQuery: (query: string) => void;
    setIsFilterVisible: (visible: boolean) => void;
    setFilters: (filters: { date: Date | null; months: string[]; employees: string[]; assigners: string[] }) => void;
    onResetFilters: () => void;

    // Selection Actions
    toggleSelection: (id: string) => void;
    selectAll: (checked: boolean) => void;

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
    canBulkDelete: boolean;
  };
  onExportPdf?: (data: MiscWork[]) => void;
  onExportExcel?: (data: MiscWork[]) => void;
}

const MiscellaneousWorkContent: React.FC<MiscellaneousWorkContentProps> = ({ state, actions, permissions, onExportPdf, onExportExcel }) => {
  const { paginatedMiscWorks, totalItems, currentPage, searchQuery, filters, selectedIds, isFetching, isFilterVisible, itemsPerPage } = state;
  const { setCurrentPage, modals, setSearchQuery, setIsFilterVisible } = actions;

  if (isFetching && state.miscWorks.length === 0) {
    return (
      <div className="flex-1 flex flex-col p-4 sm:p-0">
        <MiscellaneouSkeleton
          rows={itemsPerPage}
          isFilterVisible={isFilterVisible}
          permissions={permissions}
        />
      </div>
    );
  }

  const startIndex = (currentPage - 1) * itemsPerPage;

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
        // Export handlers use the FULL list (state.miscWorks), not paginated list
        onExportPdf={() => onExportPdf && onExportPdf(state.miscWorks)}
        onExportExcel={() => onExportExcel && onExportExcel(state.miscWorks)}
        canBulkDelete={permissions.canBulkDelete}
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
        {state.miscWorks.length > 0 ? (
          <>
            <div className="hidden md:block flex-1 overflow-auto">
              <MiscWorkTable
                data={paginatedMiscWorks} // Use sliced data
                selectedIds={selectedIds}
                onToggle={actions.toggleSelection}
                onSelectAll={actions.selectAll}
                onViewImage={modals.openImageModal}
                onDelete={(id: string) => modals.openDeleteModal([id])}
                startIndex={startIndex}
                canDelete={permissions.canDelete}
              />
            </div>

            <div className="md:hidden flex-1 overflow-auto">
              <MiscWorkMobileList
                data={paginatedMiscWorks} // Use sliced data
                selectedIds={selectedIds}
                onToggle={actions.toggleSelection}
                onViewImage={modals.openImageModal}
                onDelete={(id: string) => modals.openDeleteModal([id])}
                canDelete={permissions.canDelete}
              />
            </div>

            <div className="flex-shrink-0 mt-4">
              <Pagination
                currentPage={currentPage}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
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
              <img
                src={miscellaneousWorkIcon}
                alt="No Miscellaneous Work"
                className="w-16 h-16 opacity-50 filter grayscale"
              />
            }
          />
        )}
      </div>
    </motion.div>
  );
};

export default MiscellaneousWorkContent;