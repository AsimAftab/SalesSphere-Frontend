import React from 'react';
import { FunnelIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { type TourPlanPermissions } from './useTourManager';
import { Button, SearchBar, ExportActions } from '@/components/ui';

interface TourPlanHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isFilterVisible: boolean;
  setIsFilterVisible: (visible: boolean) => void;
  onExportPdf: () => void;
  onExportExcel: () => void;
  onOpenCreateModal: () => void;
  selectedCount: number;
  onBulkDelete: () => void;
  setCurrentPage: (page: number) => void;
  permissions: TourPlanPermissions;
}

const TourPlanHeader: React.FC<TourPlanHeaderProps> = ({
  searchQuery,
  setSearchQuery,
  isFilterVisible,
  setIsFilterVisible,
  onExportPdf,
  onExportExcel,
  onOpenCreateModal,
  selectedCount,
  onBulkDelete,
  setCurrentPage,
  permissions
}) => {
  return (
    /* FIXED: Removed px-1 and added w-full to ensure edge-to-edge alignment */
    <div className="w-full flex flex-col gap-0 mb-8">

      {/* SECTION 1: Top Row (Title, Search, Actions) */}
      <div className="w-full flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Title */}
        <div className="text-left shrink-0">
          <h1 className="text-2xl sm:text-3xl font-black text-[#202224]">Tour Plans</h1>
          <p className="text-xs sm:text-sm text-gray-500">Manage employee travel schedules.</p>
        </div>

        {/* Actions Wrapper */}
        <div className="flex flex-col lg:flex-row items-center gap-4 w-full lg:w-auto lg:flex-1 lg:justify-end">

          {/* Search Bar */}
          <SearchBar
            value={searchQuery}
            onChange={(val) => {
              setSearchQuery(val);
              setCurrentPage(1);
            }}
            placeholder="Search By Place or Created By"
            className="w-full lg:w-72 xl:w-80"
          />

          {/* Utilities (Filter, Export, Delete) */}
          <div className="flex items-center justify-between lg:justify-end gap-3 w-full lg:w-auto">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsFilterVisible(!isFilterVisible)}
                className={`p-2.5 rounded-lg border transition-colors ${isFilterVisible
                  ? 'bg-secondary text-white border-secondary shadow-md'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                  }`}
              >
                <FunnelIcon className="h-5 w-5" />
              </button>

              <ExportActions
                onExportPdf={permissions.canExportPdf ? onExportPdf : undefined}
                onExportExcel={permissions.canExportExcel ? onExportExcel : undefined}
              />
            </div>

            <AnimatePresence>
              {permissions.canBulkDelete && selectedCount > 0 && (
                <motion.div
                  key="bulk-delete-inline"
                  initial={{ opacity: 0, width: 0, scale: 0.9 }}
                  animate={{ opacity: 1, width: 'auto', scale: 1 }}
                  exit={{ opacity: 0, width: 0, scale: 0.9 }}
                  className="hidden 2xl:flex items-center overflow-hidden"
                >
                  <Button
                    variant="danger"
                    onClick={onBulkDelete}
                    className="h-10 px-3 text-xs flex items-center gap-2 font-bold whitespace-nowrap"
                  >
                    <Trash2 size={16} /> <span>Delete</span> ({selectedCount})
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {permissions.canCreate && (
            <div className="w-full lg:w-auto">
              <Button
                className="h-11 lg:h-10 w-full lg:w-auto px-6 tracking-wider flex items-center justify-center gap-2 shadow-sm"
                onClick={onOpenCreateModal}
              >
                <span>Create Tour</span>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* ROW 2: Bulk Delete Action (Smaller Screens) - Outside the top flex row */}
      <AnimatePresence>
        {permissions.canBulkDelete && selectedCount > 0 && (
          <motion.div
            key="bulk-delete-row"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden 2xl:hidden w-full"
          >
            <div className="flex items-center justify-end w-full border-t border-gray-100 mt-4 pt-4">
              <Button
                variant="danger"
                onClick={onBulkDelete}
                className="h-10 px-3 text-xs flex items-center gap-2 font-bold whitespace-nowrap"
              >
                <Trash2 size={16} /> <span>Delete</span> ({selectedCount})
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TourPlanHeader;