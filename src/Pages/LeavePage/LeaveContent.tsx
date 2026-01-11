import React, { useState } from "react";
import { motion } from "framer-motion";
import { EmptyState } from "../../components/UI/EmptyState/EmptyState";
import toast from "react-hot-toast";

// Components
import LeaveHeader from "./Components/LeaveHeader";
import LeaveTable from "./Components/LeaveTable";
import LeaveMobileList from "./Components/LeaveMobileList";
import LeaveSkeleton from "./Components/LeaveSkeleton";
import FilterBar from "../../components/UI/FilterDropDown/FilterBar";
import FilterDropdown from "../../components/UI/FilterDropDown/FilterDropDown";
import DatePicker from "../../components/UI/DatePicker/DatePicker";
import StatusUpdateModal from "../../components/modals/StatusUpdateModal";
import Pagination from "../../components/UI/Page/Pagination";

// Hooks & Types
import { type LeaveRequest, type LeaveStatus } from "../../api/leaveService";
import { type LeavePermissions } from "./Components/useLeaveManager";

interface LeaveContentProps {
  tableState: {
    data: LeaveRequest[];
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
    options: {
      employees: string[];
    };
  };
  actions: {
    updateStatus: (id: string, status: LeaveStatus) => void;
    bulkDelete: (ids: string[]) => void;
    exportPdf: (data: LeaveRequest[]) => void;
    exportExcel: (data: LeaveRequest[]) => void;
    isUpdating: boolean;
    isDeleting: boolean;
    onResetFilters: () => void;
  };
  permissions: LeavePermissions;
  currentUserId?: string;
}

const LeaveContent: React.FC<LeaveContentProps> = ({ tableState, filterState, actions, permissions, currentUserId }) => {
  const [reviewingLeave, setReviewingLeave] = useState<LeaveRequest | null>(null);

  // Constants
  const { data, isLoading, pagination, selection } = tableState;
  const { searchQuery, onSearch, isVisible, onToggle, values, onFilterChange, options } = filterState;

  // Pagination Logic
  const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
  const paginatedData = data.slice(startIndex, startIndex + pagination.itemsPerPage);

  const toggleRow = (id: string) => {
    if (selection.selectedIds.includes(id)) {
      selection.onSelect(selection.selectedIds.filter(selectedId => selectedId !== id));
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

  const handleStatusUpdateClick = (leave: LeaveRequest) => {
    // 0. Security Policy: No Self-Approval
    if (currentUserId && leave.createdBy.id === currentUserId) {
      toast.error("Security Policy: You cannot authorize or change the status of your own submissions.");
      return;
    }

    // 1. Permission Guard
    if (!permissions.canApprove) {
      toast.error("You don't have permission to update status.");
      return;
    }

    setReviewingLeave(leave);
  };

  if (isLoading && data.length === 0) {
    return (
      <div className="flex-1 flex flex-col p-4 sm:p-0">
        <LeaveSkeleton
          rows={pagination.itemsPerPage}
          permissions={permissions}
        />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col">
      {/* 1. Status Update Modal */}
      <StatusUpdateModal
        isOpen={!!reviewingLeave}
        onClose={() => setReviewingLeave(null)}
        onSave={(newVal) => {
          if (reviewingLeave) actions.updateStatus(reviewingLeave.id, newVal as LeaveStatus);
          setReviewingLeave(null);
        }}
        currentValue={reviewingLeave?.status || ""}
        entityIdValue={reviewingLeave?.createdBy?.name || ""}
        entityIdLabel="Employee"
        title="Review Leave Application"
        options={[
          { value: "pending", label: "Pending", colorClass: "blue" },
          { value: "approved", label: "Approved", colorClass: "green" },
          { value: "rejected", label: "Rejected", colorClass: "red" },
        ]}
        isSaving={actions.isUpdating}
      />

      {/* 2. Responsive Header */}
      <LeaveHeader
        searchQuery={searchQuery}
        setSearchQuery={onSearch}
        isFilterVisible={isVisible}
        setIsFilterVisible={onToggle}
        onExportPdf={() => actions.exportPdf(data)}
        onExportExcel={() => actions.exportExcel(data)}
        selectedCount={selection.selectedIds.length}
        onBulkDelete={() => actions.bulkDelete(selection.selectedIds)}
        setCurrentPage={pagination.onPageChange}
        permissions={permissions}
      />

      {/* 3. Filter Section */}
      <FilterBar
        isVisible={isVisible}
        onClose={() => onToggle(false)}
        onReset={actions.onResetFilters}
      >
        <FilterDropdown
          label="Employee"
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
          label="Month"
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

      {/* 4. Main Table/List Area */}
      <div className="relative flex-grow mt-4">
        {data.length > 0 ? (
          <>
            <LeaveTable
              data={paginatedData}
              selectedIds={selection.selectedIds}
              onToggle={toggleRow}
              onSelectAll={selectAll}
              startIndex={startIndex}
              onStatusClick={handleStatusUpdateClick}
              canDelete={permissions.canBulkDelete}
              canApprove={permissions.canApprove}
            />

            <LeaveMobileList
              data={paginatedData}
              selectedIds={selection.selectedIds}
              onToggle={toggleRow}
              onStatusClick={handleStatusUpdateClick}
            />
          </>
        ) : (
          <EmptyState
            title="No Leave Requests Found"
            description={searchQuery || values.date || values.months.length > 0 ||
              values.employees.length > 0 || values.statuses.length > 0
              ? "No leave requests match your current filters. Try adjusting your search criteria."
              : "No leave request records available. Leave applications will appear here once submitted."}
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
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            }
          />
        )}

        {/* 5. Pagination */}
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

export default LeaveContent;