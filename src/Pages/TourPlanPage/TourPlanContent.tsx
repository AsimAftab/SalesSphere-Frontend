import React from "react";
import { motion } from "framer-motion";
import { EmptyState } from "../../components/UI/EmptyState";
import TourPlanTable from "./components/TourPlanTable";
import TourPlanMobileList from "./components/TourPlanMobileList";
import Pagination from "../../components/UI/Pagination";
import { type TourPlan } from "../../api/tourPlanService";

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
    values: any;
  };
  actions: {
    create: (data: any) => Promise<void>;
    updateStatus: (id: string, status: any) => Promise<void>;
    delete: (id: string) => Promise<void>;
    bulkDelete: (ids: string[]) => Promise<void>;
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

const TourPlanContent: React.FC<TourPlanContentProps> = ({ tableState, filterState, permissions }) => {
  const { data, paginatedData, selection, pagination } = tableState;
  const { searchQuery, values } = filterState;
  const { toggleRow, selectAll } = selection;

  const handleStatusUpdateClick = (plan: TourPlan) => {
    console.log("Status update clicked for plan", plan.id);
  };

  const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-full bg-gray-50/50"
    >
      <div className="flex-1 overflow-hidden flex flex-col relative z-0">
        {
          data.length > 0 ? (
            <>
              <div className="hidden md:block h-full overflow-auto">
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
                values.employees.length > 0 || values.statuses.length > 0
                ? "No tour plans match your current filters. Try adjusting your search criteria."
                : "No tour plan records available. Create your first tour plan to get started."}
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
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                  />
                </svg>
              }
            />
          )
        }
      </div>

      {/* Pagination Controls */}
      <div className="flex-shrink-0 border-t bg-white p-4">
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