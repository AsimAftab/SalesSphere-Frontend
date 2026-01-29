import React from 'react';
import { FunnelIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import Button from "../../../components/UI/Button/Button";
import SearchBar from "../../../components/UI/SearchBar/SearchBar";
import ExportActions from "../../../components/UI/Export/ExportActions";

import { type LeavePermissions } from '../useLeaveManager';

interface LeaveHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isFilterVisible: boolean;
  setIsFilterVisible: (visible: boolean) => void;
  onExportPdf: () => void;
  onExportExcel: () => void;
  selectedCount: number;
  onBulkDelete: () => void;
  setCurrentPage: (page: number) => void;
  permissions: LeavePermissions;
  onCreateClick?: () => void;
}

const LeaveHeader: React.FC<LeaveHeaderProps> = ({
  searchQuery,
  setSearchQuery,
  isFilterVisible,
  setIsFilterVisible,
  onExportPdf,
  onExportExcel,
  selectedCount,
  onBulkDelete,
  setCurrentPage,
  permissions,
  onCreateClick
}) => {
  return (
    <div className="w-full flex flex-col gap-0 mb-8">
      {/* ROW 1: Title and Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="text-left shrink-0">
          <h1 className="text-2xl sm:text-3xl font-black text-[#202224]">Leave Requests</h1>
          <p className="text-xs sm:text-sm text-gray-500">Manage employee leave applications.</p>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-4 w-full lg:w-auto lg:flex-1 lg:justify-end">
          <SearchBar
            value={searchQuery}
            onChange={(val) => {
              setSearchQuery(val);
              setCurrentPage(1);
            }}
            placeholder="Search By Employee or Category"
            className="w-full lg:w-72 xl:w-80"
          />

          <div className="flex items-center justify-between lg:justify-end gap-3 w-full lg:w-auto">
            <div className="flex items-center gap-3">
              <Button
                variant={isFilterVisible ? 'secondary' : 'outline'}
                onClick={() => setIsFilterVisible(!isFilterVisible)}
                className={`p-2.5 rounded-lg ${isFilterVisible ? 'shadow-md' : 'border-gray-200 text-gray-600'}`}
              >
                <FunnelIcon className="h-5 w-5" />
              </Button>

              <ExportActions
                onExportPdf={permissions.canExportPdf ? onExportPdf : undefined}
                onExportExcel={permissions.canExportExcel ? onExportExcel : undefined}
              />
            </div>

            {/* Bulk Delete (2XL Screens - Inline) */}
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

            {permissions.canCreate && onCreateClick && (
              <Button
                variant="secondary"
                onClick={onCreateClick}
                className="whitespace-nowrap"
              >
                Create Leave
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* ROW 2: Bulk Delete Action (Smaller Screens) */}
      <AnimatePresence>
        {permissions.canBulkDelete && selectedCount > 0 && (
          <motion.div
            key="bulk-delete-row"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden 2xl:hidden"
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

export default LeaveHeader;