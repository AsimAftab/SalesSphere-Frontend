import React from 'react';
import { Trash2, Filter } from 'lucide-react';
import Button from '../../../components/UI/Button/Button';
import SearchBar from '../../../components/UI/SearchBar/SearchBar';
import ExportActions from '../../../components/UI/Export/ExportActions';
import { AnimatePresence, motion } from 'framer-motion';

interface Props {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  isFilterVisible: boolean;
  setIsFilterVisible: (val: boolean) => void;
  selectedCount: number;
  onBulkDelete: () => void;
  canExportPdf: boolean;
  canExportExcel: boolean;
  onExportPdf: () => void;
  onExportExcel: () => void;
  canBulkDelete?: boolean;
}

export const MiscWorkHeader: React.FC<Props> = ({
  searchQuery, setSearchQuery, isFilterVisible, setIsFilterVisible,
  selectedCount, onBulkDelete, canExportPdf, canExportExcel, onExportPdf, onExportExcel, canBulkDelete
}) => (
  <div className="w-full flex flex-col gap-0 mb-8">
    {/* SECTION 1: Top Row (Title, Search, Actions) */}
    <div className="w-full flex flex-col lg:flex-row lg:items-center justify-between gap-6">
      {/* Title */}
      <div className="text-left shrink-0">
        <h1 className="text-2xl sm:text-3xl font-black text-[#202224]">Miscellaneous Work</h1>
        <p className="text-xs sm:text-sm text-gray-500">Manage tasks and staff assignments.</p>
      </div>

      {/* Actions Wrapper */}
      <div className="flex flex-col lg:flex-row items-center gap-4 w-full lg:w-auto lg:flex-1 lg:justify-end">

        {/* Search Bar */}
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search By Employee, Address or Nature of Work"
          className="w-full lg:w-72 xl:w-80"
        />

        {/* Utilities */}
        <div className="flex items-center justify-between lg:justify-end gap-3 w-full lg:w-auto">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsFilterVisible(!isFilterVisible)} className={`p-2.5 rounded-lg border ${isFilterVisible ? 'bg-secondary text-white' : 'bg-white text-gray-600'}`}>
              <Filter className="h-5 w-5" />
            </button>

            <ExportActions
              onExportPdf={canExportPdf ? onExportPdf : undefined}
              onExportExcel={canExportExcel ? onExportExcel : undefined}
            />
          </div>

          <AnimatePresence>
            {canBulkDelete && selectedCount > 0 && (
              <motion.div
                key="bulk-delete-inline"
                initial={{ opacity: 0, width: 0, scale: 0.9 }}
                animate={{ opacity: 1, width: 'auto', scale: 1 }}
                exit={{ opacity: 0, width: 0, scale: 0.9 }}
                className="hidden 2xl:flex items-center overflow-hidden"
              >
                <Button variant="danger" onClick={onBulkDelete} className="h-10 px-3 text-xs flex items-center gap-2 font-bold whitespace-nowrap">
                  <Trash2 size={16} /> <span>Delete</span> ({selectedCount})
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>

    {/* ROW 2: Bulk Delete Action (Smaller Screens) */}
    <AnimatePresence>
      {canBulkDelete && selectedCount > 0 && (
        <motion.div
          key="bulk-delete-row"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden 2xl:hidden w-full"
        >
          <div className="flex items-center justify-end w-full border-t border-gray-100 mt-4 pt-4">
            <Button variant="danger" onClick={onBulkDelete} className="h-10 px-3 text-xs flex items-center gap-2 font-bold whitespace-nowrap">
              <Trash2 size={16} /> <span>Delete</span> ({selectedCount})
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);