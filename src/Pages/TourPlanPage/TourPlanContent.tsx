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
import Button from "../../components/UI/Button/Button";

// Hooks
import { useTableSelection } from "../../components/hooks/useTableSelection";

// Types
import { type TourPlan, type TourStatus } from "../../api/tourPlanService";
import { type TourPlanPermissions } from "./components/useTourManager";

export interface TourPlanContentProps {
  tableData: TourPlan[];
  isFetchingList: boolean;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  ITEMS_PER_PAGE: number;
  isFilterVisible: boolean;
  setIsFilterVisible: React.Dispatch<React.SetStateAction<boolean>>;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
  selectedEmployee: string[];
  setSelectedEmployee: (employees: string[]) => void;
  selectedStatus: string[];
  setSelectedStatus: (statuses: string[]) => void;
  selectedMonth: string[];
  setSelectedMonth: (months: string[]) => void;
  employeeOptions: string[];
  onResetFilters: () => void;
  onExportPdf: (data: TourPlan[]) => void;
  onExportExcel: (data: TourPlan[]) => void;
  onUpdateStatus: (id: string, status: TourStatus) => void;
  isUpdatingStatus: boolean;
  selectedIds: string[];
  setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>;
  onBulkDelete: (ids: string[]) => void;
  isDeletingBulk: boolean;
  // --- NEW PROPS FOR CREATE MODAL ---
  handleCreate: () => void;
  isSaving: boolean;
  permissions: TourPlanPermissions;
  currentUserId?: string;
}

const TourPlanContent: React.FC<TourPlanContentProps> = (props) => {
  const [editingTour, setEditingTour] = useState<TourPlan | null>(null);

  const totalPages = Math.ceil(props.tableData.length / props.ITEMS_PER_PAGE);
  const startIndex = (props.currentPage - 1) * props.ITEMS_PER_PAGE;
  const paginatedData = props.tableData.slice(startIndex, props.currentPage * props.ITEMS_PER_PAGE);

  // 1. REUSE TABLE SELECTION HOOK
  const { selectedIds, toggleRow, selectAll } = useTableSelection(paginatedData);

  /**
   * FIXED: Business Logic for Status Change
   */
  const handleStatusUpdateClick = (tour: TourPlan) => {
    // 0. Security Policy: No Self-Approval
    if (props.currentUserId && tour.createdBy.id === props.currentUserId) {
      toast.error("Security Policy: You cannot authorize or change the status of your own submissions.");
      return;
    }

    // 1. Permission Guard
    if (!props.permissions.canApprove) {
      toast.error("You don't have permission to update status.");
      return;
    }

    // 2. Business Logic: Admins/Approvers can modify ANY status including Final ones.
    // Regular users are blocked by the permission guard above.
    // So we just proceed.
    setEditingTour(tour);
  };

  // 2. Skeleton Loading State Logic
  if (props.isFetchingList && props.tableData.length === 0) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col p-4 sm:p-0">
        <TourPlanSkeleton
          rows={props.ITEMS_PER_PAGE}
          isFilterVisible={props.isFilterVisible}
          permissions={props.permissions}
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
          if (editingTour) props.onUpdateStatus(editingTour.id, newVal as TourStatus);
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
        isSaving={props.isUpdatingStatus}
      />

      {/* 4. Responsive Header */}
      <div className="flex flex-col gap-4">
        <TourPlanHeader
          searchQuery={props.searchQuery}
          setSearchQuery={props.setSearchQuery}
          isFilterVisible={props.isFilterVisible}
          setIsFilterVisible={props.setIsFilterVisible}
          onExportPdf={() => props.onExportPdf(props.tableData)}
          onExportExcel={() => props.onExportExcel(props.tableData)}
          selectedCount={selectedIds.length}
          onBulkDelete={() => props.onBulkDelete(selectedIds)}
          setCurrentPage={props.setCurrentPage}
          onOpenCreateModal={props.handleCreate}
          permissions={props.permissions}
        />
      </div>

      {/* 5. Filter Section */}
      <div className="px-0 sm:px-0">
        <FilterBar
          isVisible={props.isFilterVisible}
          onClose={() => props.setIsFilterVisible(false)}
          onReset={props.onResetFilters}
        >
          <FilterDropdown label="Created By" options={props.employeeOptions} selected={props.selectedEmployee} onChange={props.setSelectedEmployee} />
          <FilterDropdown label="Status" options={["pending", "approved", "rejected"]} selected={props.selectedStatus} onChange={props.setSelectedStatus} />
          <FilterDropdown label="Start Month" options={["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]} selected={props.selectedMonth} onChange={props.setSelectedMonth} />
          <div className="min-w-[140px] flex-1 sm:flex-none">
            <DatePicker
              value={props.selectedDate}
              onChange={props.setSelectedDate}
              placeholder="Start Date"
              isClearable
              className="bg-none border-gray-100 text-sm text-gray-900 font-semibold placeholder:text-gray-900"
            />
          </div>
        </FilterBar>
      </div>

      {/* 6. Main Content Area */}
      <div className="relative flex-grow">
        {props.tableData.length > 0 ? (
          <>
            <div className="hidden md:block">
              <TourPlanTable
                data={paginatedData}
                selectedIds={selectedIds}
                onToggle={toggleRow}
                onSelectAll={(checked: boolean) => selectAll(checked)}
                startIndex={startIndex}
                onStatusClick={handleStatusUpdateClick}
                canDelete={props.permissions.canBulkDelete}
                canApprove={props.permissions.canApprove}
              />
            </div>

            <div className="md:hidden">
              <TourPlanMobileList
                data={paginatedData}
                selectedIds={selectedIds}
                onToggle={toggleRow}
                onStatusClick={handleStatusUpdateClick}
                canDelete={props.permissions.canBulkDelete}
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
              {props.searchQuery || props.selectedDate || props.selectedMonth.length > 0 ||
                props.selectedEmployee.length > 0 || props.selectedStatus.length > 0
                ? "No tour plans match your current filters. Try adjusting your search criteria."
                : "No tour plan records available. Create your first tour plan to get started."}
            </p>
          </div>
        )}

        {/* 7. Pagination Logic */}
        {props.tableData.length > props.ITEMS_PER_PAGE && (
          <div className="flex items-center justify-between p-6 text-sm text-gray-500">
            <p className="hidden sm:block">
              Showing {startIndex + 1} to {Math.min(props.currentPage * props.ITEMS_PER_PAGE, props.tableData.length)} of {props.tableData.length}
            </p>
            <div className="flex items-center gap-2 w-full sm:w-auto justify-center">
              <Button onClick={() => props.setCurrentPage((prev) => prev - 1)} variant="secondary" disabled={props.currentPage === 1} className="px-2 py-1 text-xs">Prev</Button>
              <span className="px-4 font-bold text-gray-900 text-xs">{props.currentPage} / {totalPages}</span>
              <Button onClick={() => props.setCurrentPage((prev) => prev + 1)} variant="secondary" disabled={props.currentPage >= totalPages} className="px-2 py-1 text-xs">Next</Button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TourPlanContent;