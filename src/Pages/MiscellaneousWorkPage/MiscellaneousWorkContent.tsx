import React from "react";
import { motion } from "framer-motion";
import { EmptyState } from "../../components/UI/EmptyState/EmptyState";
import { MiscWorkTable } from "./components/MiscWorkTable";
import { MiscWorkMobileList } from "./components/MiscWorkMobileList";
import Pagination from "../../components/UI/Page/Pagination";
import { type MiscWork } from "../../api/miscellaneousWorkService";

interface MiscellaneousWorkContentProps {
  state: {
    miscWorks: MiscWork[];
    totalItems: number;
    currentPage: number;
    searchQuery: string;
    filters: {
      date: Date | null;
      months: string[];
      employees: string[];
    };
    modals: any;
    selectedIds: string[];
    employeeOptions: { label: string; value: string }[];
  };
  actions: {
    setCurrentPage: (page: number) => void;
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

const MiscellaneousWorkContent: React.FC<MiscellaneousWorkContentProps> = ({ state, actions, permissions }) => {
  const { miscWorks, totalItems, currentPage, searchQuery, filters, selectedIds } = state;
  const { setCurrentPage, setSelectedIds, modals } = actions;

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

  const startIndex = (currentPage - 1) * 10;
  const ITEMS_PER_PAGE = 10;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-full"
    >
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
              filters.employees.length > 0
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