import React, { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

// Composition Components
import TourPlanHeader from "./components/TourPlanHeader";
import TourPlanTable from "./components/TourPlanTable";
import TourPlanMobileList from "./components/TourPlanMobileList";
import TourPlanSkeleton from "./components/TourPlanSkeleton";
import FilterBar from "../../components/UI/FilterDropDown/FilterBar";
import FilterDropdown from "../../components/UI/FilterDropDown/FilterDropDown";
import DatePicker from "../../components/UI/DatePicker/DatePicker";
import StatusUpdateModal from "../../components/modals/StatusUpdateModal";
import Pagination from "../../components/UI/Pagination";

// Hooks
// Types
import { type TourPlan, type TourStatus } from "../../api/tourPlanService";
import { type TourPlanPermissions } from "./components/useTourManager";

export interface TourPlanContentProps {
  tableState: {
    data: TourPlan[];
    isLoading: boolean;
    pagination: {
      currentPage: number;
      onPageChange: (page: number) => void;
      itemsPerPage: number;
      totalItems: number;
    };
    selection: {
      selectedIds: string[];
      onSelect: (ids: string[]) => void;
    };
  };
  filterState: {
    searchQuery: string;
    onSearch: (query: string) => void;
    isVisible: boolean;
    onToggle: (visible: boolean) => void;
    values: {
      date: Date | null;
      employees: string[];
      statuses: string[];
      months: string[];
    };
    onFilterChange: (filters: any) => void;
    onReset: () => void;
    options: {
      employees: string[];
    };
  };
  actions: {
    create: () => void;
    updateStatus: (id: string, status: TourStatus) => void;
    bulkDelete: (ids: string[]) => void;
    exportPdf: (data: TourPlan[]) => void;
    exportExcel: (data: TourPlan[]) => void;
    isCreating: boolean;
    isUpdating: boolean;
    isDeleting: boolean;
  };
  permissions: TourPlanPermissions;
  currentUserId?: string;
}

const TourPlanContent: React.FC<TourPlanContentProps> = ({ tableState, filterState, actions, permissions, currentUserId }) => {
  const [editingTour, setEditingTour] = useState<TourPlan | null>(null);

  // Constants
  const { data, isLoading, pagination, selection } = tableState;
  const { searchQuery, onSearch, isVisible, onToggle, values, onFilterChange, onReset, options } = filterState;

  const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
  const paginatedData = data.slice(startIndex, startIndex + pagination.itemsPerPage);

  // 1. REUSE TABLE SELECTION HOOK (Lifted State from props)
  const toggleRow = (id: string) => {
    if (selection.selectedIds.includes(id)) {
      selection.onSelect(selection.selectedIds.filter(item => item !== id));
    } else {
      selection.onSelect([...selection.selectedIds, id]);
    }
  };

  const selectAll = (checked: boolean) => {
    if (checked) {
      selection.onSelect(paginatedData.map(item => item.id));
    } else {
      selection.onSelect([]);
    }
  };

  /**
   * FIXED: Business Logic for Status Change
   */
  const handleStatusUpdateClick = (tour: TourPlan) => {
    // 0. Security Policy: No Self-Approval
    if (currentUserId && tour.createdBy.id === currentUserId) {
      toast.error("Security Policy: You cannot authorize or change the status of your own submissions.");
      return;
    }

    // 1. Permission Guard
    if (!permissions.canApprove) {
      toast.error("You don't have permission to update status.");
      return;
    }

    // 2. Business Logic: Admins/Approvers can modify ANY status including Final ones.
    setEditingTour(tour);
  };

  // 2. Skeleton Loading State Logic
  if (isLoading && data.length === 0) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col p-4 sm:p-0">
        <TourPlanSkeleton
          rows={pagination.itemsPerPage}
          isFilterVisible={isVisible}
          permissions={permissions}
        />
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col">
      {/* 3. Status Update Modal */}
      <StatusUpdateModal
        isOpen={!!editingTour}
        onClose={() => setEditingTour(null)}
        onSave={(newVal) => {
          if (editingTour) actions.updateStatus(editingTour.id, newVal as TourStatus);
          setEditingTour(null);
        }}
        currentValue={editingTour?.status || ""}
        entityIdValue={editingTour?.createdBy?.name || ""}
        entityIdLabel="Employee"
        title="Update Tour Status"
        options={[
          { value: "pending", label: "Pending", colorClass: "blue" },
          { value: "approved", label: "Approved", colorClass: "green" },
          { value: "rejected", label: "Rejected", colorClass: "red" },
        ]}
        isSaving={actions.isUpdating}
      />

      {/* 4. Responsive Header */}
      <div className="flex flex-col gap-4">
        <TourPlanHeader
          searchQuery={searchQuery}
          setSearchQuery={onSearch}
          isFilterVisible={isVisible}
          setIsFilterVisible={onToggle}
          onExportPdf={() => actions.exportPdf(data)}
          onExportExcel={() => actions.exportExcel(data)}
          selectedCount={selection.selectedIds.length}
          onBulkDelete={() => actions.bulkDelete(selection.selectedIds)}
          setCurrentPage={pagination.onPageChange}
          onOpenCreateModal={actions.create}
          permissions={permissions}
        />
      </div>

      {/* 5. Filter Section */}
      <div className="px-0 sm:px-0">
        <FilterBar
          isVisible={isVisible}
          onClose={() => onToggle(false)}
          onReset={onReset}
        >
          <FilterDropdown
            label="Created By"
            options={options.employees}
            selected={values.employees}
            onChange={(val) => onFilterChange((prev: any) => ({ ...prev, employees: val }))}
          />
          <FilterDropdown
            label="Status"
            options={["pending", "approved", "rejected"]}
            selected={values.statuses}
            onChange={(val) => onFilterChange((prev: any) => ({ ...prev, statuses: val }))}
          />
          <FilterDropdown
            label="Start Month"
            options={["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]}
            selected={values.months}
            onChange={(val) => onFilterChange((prev: any) => ({ ...prev, months: val }))}
          />
          <div className="min-w-[140px] flex-1 sm:flex-none">
            <DatePicker
              value={values.date}
              onChange={(val) => onFilterChange((prev: any) => ({ ...prev, date: val }))}
              placeholder="Start Date"
              isClearable
              className="bg-none border-gray-100 text-sm text-gray-900 font-semibold placeholder:text-gray-900"
            />
          </div>
        </FilterBar>
      </div>

      {/* 6. Main Content Area */}
      <div className="relative flex-grow">
        {data.length > 0 ? (
          <>
            <div className="hidden md:block">
              <TourPlanTable
                data={paginatedData}
                selectedIds={selection.selectedIds}
                onToggle={toggleRow}
                onSelectAll={(checked: boolean) => selectAll(checked)}
                startIndex={startIndex}
                onStatusClick={handleStatusUpdateClick}
                canDelete={permissions.canBulkDelete}
                canApprove={permissions.canApprove}
              />
            </div>

            <div className="md:hidden">
              <TourPlanMobileList
                data={paginatedData}
                selectedIds={selection.selectedIds}
                onToggle={toggleRow}
                onStatusClick={handleStatusUpdateClick}
                canDelete={permissions.canBulkDelete}
              />
            </div>
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
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Tour Plans Found
            </h3>
            <p className="text-gray-500 text-center max-w-md">
              {searchQuery || values.date || values.months.length > 0 ||
                values.employees.length > 0 || values.statuses.length > 0
                ? "No tour plans match your current filters. Try adjusting your search criteria."
                : "No tour plan records available. Create your first tour plan to get started."}
            </p>
          </div>
        )}

        {/* 7. Pagination Logic */}
        <Pagination
          currentPage={pagination.currentPage}
          totalItems={pagination.totalItems}
          itemsPerPage={pagination.itemsPerPage}
          onPageChange={pagination.onPageChange}
        />
      </div>
    </motion.div>
  );
};

export default TourPlanContent;