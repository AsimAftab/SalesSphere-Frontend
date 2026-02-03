import React from 'react';
import { Filter, Search, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, ExportActions } from '@/components/ui';

interface NoteHeaderProps {
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

  // Permission Props
  canCreate: boolean;
  canExportPdf: boolean;
  canExportExcel: boolean;
  canBulkDelete: boolean;
}

const NoteHeader: React.FC<NoteHeaderProps> = ({
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
  canCreate,
  canExportPdf,
  canExportExcel,
  canBulkDelete
}) => {
  return (
    /* edge-to-edge alignment */
    <div className="w-full flex flex-col gap-0 mb-8">

      {/* ROW 1: Title and Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">

        {/* SECTION 1: Title and Description */}
        <div className="text-left shrink-0">
          <h1 className="text-2xl sm:text-3xl font-black text-[#202224]"> Notes</h1>
          <p className="text-xs sm:text-sm text-gray-500">Log and track communications.</p>
        </div>

        {/* SECTION 2: Actions Wrapper */}
        <div className="flex flex-col lg:flex-row items-center gap-4 w-full lg:w-auto lg:flex-1 lg:justify-end">

          {/* MOBILE ROW 1: Search Bar */}
          <div className="relative w-full lg:w-72 xl:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="search"
              placeholder="Search by Title or Created By"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="h-11 lg:h-10 w-full bg-gray-200 rounded-full pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-secondary transition-all"
            />
          </div>

          {/* MOBILE ROW 2: Utilities (Filter, Export, Delete) */}
          <div className="flex items-center justify-between lg:justify-end gap-3 w-full lg:w-auto">
            <div className="flex items-center gap-3">
              {/* Filter Toggle Button */}
              <button
                onClick={() => setIsFilterVisible(!isFilterVisible)}
                className={`p-2.5 rounded-lg border transition-colors ${isFilterVisible
                  ? 'bg-secondary text-white border-secondary shadow-md'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                  }`}
              >
                <Filter className="h-5 w-5" />
              </button>

              <ExportActions
                onExportPdf={canExportPdf ? onExportPdf : undefined}
                onExportExcel={canExportExcel ? onExportExcel : undefined}
              />

              {/* Delete Button (2XL Screens - Inline) */}
              <AnimatePresence>
                {selectedCount > 0 && canBulkDelete && (
                  <motion.div
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


            {/* MOBILE ROW 3: Primary Create Button */}
            {canCreate && (
              <div className="w-full lg:w-auto">
                <Button
                  onClick={onOpenCreateModal}
                  className="h-11 lg:h-10 w-full lg:w-auto px-6  tracking-wider flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>Create Note</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ROW 2: Bulk Delete Action (Appears on next line for smaller screens, hidden on 2XL) */}
      <AnimatePresence>
        {selectedCount > 0 && canBulkDelete && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden 2xl:hidden"
          >
            <div className="flex items-center justify-end w-full border-t border-gray-100 mt-4 pt-4">
              <Button
                variant="danger"
                onClick={onBulkDelete}
                className="h-10 px-3 text-xs flex items-center justify-center gap-2 font-bold whitespace-nowrap"
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

export default NoteHeader;