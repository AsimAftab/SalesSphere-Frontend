import React from 'react';
import { FunnelIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import Button from "../../../components/UI/Button/Button";
import SearchBar from "../../../components/UI/SearchBar/SearchBar";
import ExportActions from "../../../components/UI/Export/ExportActions";

import { type LeavePermissions } from './useLeaveManager';

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
  permissions
}) => {
  return (
    <div className="w-full flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
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
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
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
      </div>
    </div>
  );
};

export default LeaveHeader;