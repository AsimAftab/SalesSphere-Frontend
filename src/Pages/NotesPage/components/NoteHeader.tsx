import React from 'react';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from "../../../components/UI/Button/Button";
import ExportActions from "../../../components/UI/ExportActions";

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
  setCurrentPage
}) => {
  return (
    /* edge-to-edge alignment */
    <div className="w-full flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
      
      {/* SECTION 1: Title and Description */}
      <div className="text-left shrink-0">
        <h1 className="text-2xl sm:text-3xl font-black text-[#202224]"> Notes</h1>
        <p className="text-xs sm:text-sm text-gray-500">Log and track communications.</p>
      </div>

      {/* SECTION 2: Actions Wrapper */}
      <div className="flex flex-col lg:flex-row items-center gap-4 w-full lg:w-auto lg:flex-1 lg:justify-end">
        
        {/* MOBILE ROW 1: Search Bar */}
        <div className="relative w-full lg:w-72 xl:w-80">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
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
              className={`p-2.5 rounded-lg border transition-colors ${
                isFilterVisible 
                  ? 'bg-secondary text-white border-secondary shadow-md' 
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
            >
              <FunnelIcon className="h-5 w-5" />
            </button>

            <ExportActions 
              onExportPdf={onExportPdf} 
              onExportExcel={onExportExcel} 
            />
          </div>
          
          <AnimatePresence>
            {selectedCount > 0 && (
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

        {/* MOBILE ROW 3: Primary Create Button */}
        <div className="w-full lg:w-auto">
        <Button 
          onClick={onOpenCreateModal}
          className="h-11 lg:h-10 w-full lg:w-auto px-6  tracking-wider flex items-center justify-center gap-2 shadow-sm"
        >
          <span>Create Note</span>
        </Button>
      </div>
      </div>
    </div>
  );
};

export default NoteHeader;