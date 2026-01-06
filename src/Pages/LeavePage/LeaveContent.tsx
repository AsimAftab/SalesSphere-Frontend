import React, { useState } from "react";
import { motion } from "framer-motion";
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
import Button from "../../components/UI/Button/Button";

// Hooks & Types
import { useTableSelection } from "../../components/hooks/useTableSelection";
import { type LeaveRequest, type LeaveStatus } from "../../api/leaveService";

interface LeaveContentProps {
  tableData: LeaveRequest[];
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
  onExportPdf: (data: LeaveRequest[]) => void;
  onExportExcel: (data: LeaveRequest[]) => void;
  onUpdateStatus: (id: string, status: LeaveStatus) => void;
  isUpdatingStatus: boolean;
  selectedIds: string[];
  setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>;
  onBulkDelete: (ids: string[]) => void;
  isDeletingBulk: boolean;
}

const LeaveContent: React.FC<LeaveContentProps> = (props) => {
  const [reviewingLeave, setReviewingLeave] = useState<LeaveRequest | null>(null);

  // Pagination Logic
  const totalPages = Math.ceil(props.tableData.length / props.ITEMS_PER_PAGE);
  const startIndex = (props.currentPage - 1) * props.ITEMS_PER_PAGE;
  const paginatedData = props.tableData.slice(startIndex, startIndex + props.ITEMS_PER_PAGE);

  // Reusable Table Selection Hook
  const { selectedIds, toggleRow, selectAll } = useTableSelection(paginatedData);

  const handleStatusUpdateClick = (leave: LeaveRequest) => {
    if (leave.status !== "pending") {
      toast.error(`This leave request has already been ${leave.status.toUpperCase()}.`);
      return;
    }
    setReviewingLeave(leave);
  };

  if (props.isFetchingList && props.tableData.length === 0) {
    return (
      <div className="flex-1 flex flex-col p-4 sm:p-0">
        <LeaveSkeleton rows={props.ITEMS_PER_PAGE} isFilterVisible={props.isFilterVisible} />
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
          if (reviewingLeave) props.onUpdateStatus(reviewingLeave.id, newVal as LeaveStatus);
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
        isSaving={props.isUpdatingStatus}
      />

      {/* 2. Responsive Header */}
      <LeaveHeader
        searchQuery={props.searchQuery}
        setSearchQuery={props.setSearchQuery}
        isFilterVisible={props.isFilterVisible}
        setIsFilterVisible={props.setIsFilterVisible}
        onExportPdf={() => props.onExportPdf(props.tableData)}
        onExportExcel={() => props.onExportExcel(props.tableData)}
        selectedCount={selectedIds.length}
        onBulkDelete={() => props.onBulkDelete(selectedIds)}
        setCurrentPage={props.setCurrentPage}
      />

      {/* 3. Filter Section */}
      <FilterBar
        isVisible={props.isFilterVisible}
        onClose={() => props.setIsFilterVisible(false)}
        onReset={props.onResetFilters}
      >
        <FilterDropdown label="Employee" options={props.employeeOptions} selected={props.selectedEmployee} onChange={props.setSelectedEmployee} />
        <FilterDropdown label="Status" options={["pending", "approved", "rejected"]} selected={props.selectedStatus} onChange={props.setSelectedStatus} />
        <FilterDropdown label="Month" options={["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]} selected={props.selectedMonth} onChange={props.setSelectedMonth} />
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

      {/* 4. Main Table/List Area */}
      <div className="relative flex-grow mt-4">
        {props.tableData.length > 0 ? (
          <>
            <LeaveTable
              data={paginatedData}
              selectedIds={selectedIds}
              onToggle={toggleRow}
              onSelectAll={selectAll}
              startIndex={startIndex}
              onStatusClick={handleStatusUpdateClick}
            />

            <LeaveMobileList
              data={paginatedData}
              selectedIds={selectedIds}
              onToggle={toggleRow}
              onStatusClick={handleStatusUpdateClick}
            />
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
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Leave Requests Found
            </h3>
            <p className="text-gray-500 text-center max-w-md">
              {props.searchQuery || props.selectedDate || props.selectedMonth.length > 0 ||
                props.selectedEmployee.length > 0 || props.selectedStatus.length > 0
                ? "No leave requests match your current filters. Try adjusting your search criteria."
                : "No leave request records available. Leave applications will appear here once submitted."}
            </p>
          </div>
        )}

        {/* 5. Pagination */}
        {props.tableData.length > props.ITEMS_PER_PAGE && (
          <div className="flex items-center justify-between p-6 text-sm text-gray-500">
            <p className="hidden sm:block">
              Showing {startIndex + 1} to {Math.min(props.currentPage * props.ITEMS_PER_PAGE, props.tableData.length)} of {props.tableData.length} entries
            </p>
            <div className="flex items-center gap-2 w-full sm:w-auto justify-center">
              <Button onClick={() => props.setCurrentPage((prev) => prev - 1)} variant="secondary" disabled={props.currentPage === 1} className="px-3 py-1 text-xs">Prev</Button>
              <span className="px-4 font-bold text-gray-900 text-xs">{props.currentPage} / {totalPages}</span>
              <Button onClick={() => props.setCurrentPage((prev) => prev + 1)} variant="secondary" disabled={props.currentPage >= totalPages} className="px-3 py-1 text-xs">Next</Button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default LeaveContent;