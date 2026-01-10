import React from "react";
import { motion } from "framer-motion";
import "react-loading-skeleton/dist/skeleton.css";

import DatePicker from "../../components/UI/DatePicker/DatePicker";
import FilterDropdown from '../../components/UI/FilterDropDown/FilterDropDown';
import FilterBar from "../../components/UI/FilterDropDown/FilterBar";
import Pagination from "../../components/UI/Pagination";

import { MiscWorkHeader } from "./components/MiscWorkHeader";
import { MiscWorkTable } from "./components/MiscWorkTable";
import { MiscWorkMobileList } from "./components/MiscWorkMobileList";
import { MiscellaneouSkeleton } from "./components/MiscWorkSkeletons";
import { type MiscWork as MiscWorkType } from "../../api/miscellaneousWorkService";

import { type MiscWorkPermissions } from "./components/useMiscellaneousManager";

interface MiscellaneousWorkContentProps {
  state: any; // In real app use ReturnType<typeof useMiscellaneousManager>['state']
  actions: any;
  permissions: MiscWorkPermissions;
  // Extra handlers that might not be in the hook's actions (like exports if they stay in page)
  onExportPdf: (data: MiscWorkType[]) => void;
  onExportExcel: (data: MiscWorkType[]) => void;
}

const MONTH_OPTIONS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const MiscellaneousWorkContent: React.FC<MiscellaneousWorkContentProps> = ({ state, actions, permissions, onExportPdf, onExportExcel }) => {
  const {
    miscWorks, isFetching, currentPage, ITEMS_PER_PAGE = 10,
    searchQuery, isFilterVisible, filters, selectedIds, employeeOptions, totalItems
  } = state;

  const {
    setCurrentPage, setSearchQuery, setIsFilterVisible, setFilters,
    setSelectedIds, onResetFilters, modals
  } = actions;

  // --- 1. Pagination Logic ---
  const startIndex = (currentPage - 1) * (ITEMS_PER_PAGE || 10);
  const paginatedData = miscWorks.slice(startIndex, startIndex + (ITEMS_PER_PAGE || 10));


  // --- 2. Selection Handlers ---
  const toggleRow = (id: string) => {
    setSelectedIds((prev: string[]) =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const selectAll = (checked: boolean) => {
    setSelectedIds(checked ? paginatedData.map((x: any) => x._id) : []);
  };

  // --- 3. Skeleton Loading ---
  if (isFetching && miscWorks.length === 0) {
    return <MiscellaneouSkeleton
      rows={ITEMS_PER_PAGE || 10}
      permissions={{
        canDelete: permissions.canDelete,
        canExportPdf: permissions.canExportPdf,
        canExportExcel: permissions.canExportExcel,
        canViewDetails: permissions.canViewDetails
      }}
    />;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col">

      {/* 1. Header Section */}
      <MiscWorkHeader
        searchQuery={searchQuery}
        setSearchQuery={(val) => {
          setSearchQuery(val);
          setCurrentPage(1);
        }}
        isFilterVisible={isFilterVisible}
        setIsFilterVisible={setIsFilterVisible}
        selectedCount={selectedIds.length}
        onBulkDelete={() => {
          actions.handleBulkDelete(selectedIds);
          setSelectedIds([]);
        }}
        canExportPdf={permissions.canExportPdf}
        canExportExcel={permissions.canExportExcel}
        onExportPdf={() => onExportPdf(miscWorks)}
        onExportExcel={() => onExportExcel(miscWorks)}
      />

      {/* 2. Filter Bar Section */}
      <div className="px-0">
        <FilterBar
          isVisible={isFilterVisible}
          onClose={() => setIsFilterVisible(false)}
          onReset={onResetFilters}
        >
          <FilterDropdown
            label="Created By"
            options={employeeOptions.map((opt: any) => opt.label)}
            selected={filters.employees}
            onChange={(val) => setFilters((prev: any) => ({ ...prev, employees: val }))}
          />
          <FilterDropdown
            label="Month"
            options={MONTH_OPTIONS}
            selected={filters.months}
            onChange={(val) => setFilters((prev: any) => ({ ...prev, months: val }))}
          />
          <div className="min-w-[140px] flex-1 sm:flex-none">
            <DatePicker
              value={filters.date}
              onChange={(date) => setFilters((prev: any) => ({ ...prev, date }))}
              placeholder="Work Date"
              isClearable
              className="bg-none border-gray-100 text-sm text-gray-900 font-semibold placeholder:text-gray-900"
            />
          </div>
        </FilterBar>
      </div>

      {/* 3. Main Content Area */}
      <div className="relative flex-grow">
        {miscWorks.length > 0 ? (
          <>
            <div className="hidden md:block">
              <MiscWorkTable
                data={paginatedData}
                selectedIds={selectedIds}
                onToggle={toggleRow}
                onSelectAll={selectAll}
                onViewImage={modals.openImageModal}
                onDelete={(id) => modals.openDeleteModal([id])}
                startIndex={startIndex}
                canDelete={permissions.canDelete}
              />
            </div>

            <div className="md:hidden">
              <MiscWorkMobileList
                data={paginatedData}
                selectedIds={selectedIds}
                onToggle={toggleRow}
                onViewImage={modals.openImageModal}
                onDelete={(id) => modals.openDeleteModal([id])}
                canDelete={permissions.canDelete}
              />
            </div>

            {/* Pagination Controls */}
            {miscWorks.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalItems={totalItems || miscWorks.length}
                itemsPerPage={ITEMS_PER_PAGE || 10}
                onPageChange={setCurrentPage}
              />
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
              {searchQuery || filters.date || filters.months.length > 0 ||
                filters.employees.length > 0
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