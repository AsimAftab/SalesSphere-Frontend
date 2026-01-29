import React from "react";
import { motion } from "framer-motion";
import { EmptyState } from "../../components/UI/EmptyState/EmptyState";
import TourPlanTable from "./components/TourPlanTable";
import TourPlanMobileList from "./components/TourPlanMobileList";
import TourPlanHeader from "./components/TourPlanHeader";
import FilterBar from "../../components/UI/FilterDropDown/FilterBar";
import FilterDropdown from "../../components/UI/FilterDropDown/FilterDropDown";
import DatePicker from "../../components/UI/DatePicker/DatePicker";
import Pagination from "../../components/UI/Page/Pagination";
import { type TourPlan, type TourPlanFilters, type TourStatus } from "../../api/tourPlanService";
import TourPlanSkeleton from "./components/TourPlanSkeleton";
import tourPlanIcon from "../../assets/Image/icons/TourPlanIcon.svg";

interface TourPlanContentProps {
  tableState: {
    data: TourPlan[];
    paginatedData: TourPlan[];
    selection: {
      selectedIds: string[];
      toggleRow: (id: string) => void;
      onSelect: (ids: string[]) => void;
      selectAll: (checked: boolean) => void;
    };
    pagination: {
      currentPage: number;
      totalItems: number;
      itemsPerPage: number;
      onPageChange: (page: number) => void;
    };
    loading: boolean;
  };
  filterState: {
    searchQuery: string;
    values: TourPlanFilters;
    onSearch: (query: string) => void;
    isVisible: boolean;
    options?: {
      creators: string[];
      reviewers: string[];
    };
  };
  actions: {
    create: () => void;
    updateStatus: (id: string, status: TourStatus) => Promise<TourPlan>;
    delete: (id: string) => Promise<void>;
    bulkDelete: (ids: string[]) => void;
    setIsFilterVisible: (visible: boolean) => void;
    setFilters: (filters: TourPlanFilters) => void;
    onResetFilters: () => void;
    exportPdf: (data: TourPlan[]) => void;
    exportExcel: (data: TourPlan[]) => void;
    onStatusClick: (plan: TourPlan) => void;
  };
  permissions: {
    canView: boolean;
    canCreate: boolean;
    canEdit: boolean;
    canDelete: boolean;
    canApprove: boolean;
    canBulkDelete: boolean;
  };
  currentUserId: string | undefined;
}

const TourPlanContent: React.FC<TourPlanContentProps> = ({ tableState, filterState, permissions, actions }) => {
  const { data, paginatedData, selection, pagination } = tableState;
  const { searchQuery, values } = filterState;
  const { toggleRow, selectAll } = selection;

  const handleStatusUpdateClick = (plan: TourPlan) => {
    actions.onStatusClick(plan);
  };

  const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;

  if (tableState.loading && data.length === 0) {
    return (
      <div className="flex-1 flex flex-col p-4 sm:p-0">
        <TourPlanSkeleton
          isFilterVisible={filterState.isVisible}
          permissions={{
            canUpdate: permissions.canEdit,
            canExportPdf: true,
            canExportExcel: true,
            ...permissions
          }}
        />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-full"
    >
      {/* Header Section */}
      <TourPlanHeader
        searchQuery={searchQuery}
        setSearchQuery={(q) => filterState.onSearch(q)}
        isFilterVisible={filterState.isVisible}
        setIsFilterVisible={(v) => actions.setIsFilterVisible(v)}
        onExportPdf={() => actions.exportPdf(data)}
        onExportExcel={() => actions.exportExcel(data)}
        onOpenCreateModal={actions.create}
        selectedCount={selection.selectedIds.length}
        onBulkDelete={() => actions.bulkDelete(selection.selectedIds)}
        setCurrentPage={pagination.onPageChange}
        permissions={{
          canExportPdf: true, canExportExcel: true, // Mocking if missing in props.permissions type
          canUpdate: permissions.canEdit,
          ...permissions
        }}
      />

      {/* Filter Section */}
      <FilterBar
        isVisible={filterState.isVisible}
        onClose={() => actions.setIsFilterVisible(false)}
        onReset={actions.onResetFilters}
      >
        <FilterDropdown
          label="Created By"
          options={filterState.options?.creators || []}
          selected={values.creators || []}
          onChange={(val) => actions.setFilters({ ...values, creators: val })}
        />
        <FilterDropdown
          label="Reviewer"
          options={filterState.options?.reviewers || []}
          selected={values.reviewers || []}
          onChange={(val) => actions.setFilters({ ...values, reviewers: val })}
          showNoneOption
        />

        <FilterDropdown
          label="Status"
          options={["pending", "approved", "rejected"]}
          selected={values.statuses || []}
          onChange={(val) => actions.setFilters({ ...values, statuses: val })}
        />
        <FilterDropdown
          label="Month"
          options={["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]}
          selected={values.months || []}
          onChange={(val) => actions.setFilters({ ...values, months: val })}
        />
        <div className="min-w-[140px] flex-1 sm:flex-none">
          <DatePicker
            value={values.date}
            onChange={(val) => actions.setFilters({ ...values, date: val })}
            placeholder="Start Date"
            isClearable
            className="bg-none border-gray-100 text-sm text-gray-900 font-semibold placeholder:text-gray-900"
          />
        </div>

      </FilterBar>

      <div className="flex-1 overflow-hidden flex flex-col relative z-0">
        {
          data.length > 0 ? (
            <>
              <div className="hidden md:block flex-1 overflow-auto">
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

              <div className="md:hidden h-full overflow-auto">
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
            <EmptyState
              title="No Tour Plans Found"
              description={searchQuery || values.date || values.months.length > 0 ||
                values.creators.length > 0 || values.statuses.length > 0
                ? "No tour plans match your current filters. Try adjusting your search criteria."
                : "No tour plan records available. Create your first tour plan to get started."}
              icon={
                <img
                  src={tourPlanIcon}
                  alt="No Tour Plans"
                  className="w-16 h-16 opacity-50 filter grayscale"
                />
              }
            />
          )
        }
      </div>

      {/* Pagination Controls */}
      <div className="flex-shrink-0">
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