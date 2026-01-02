import React from 'react';
import { Search, Trash2, Filter } from 'lucide-react';
import Button from '../../../components/UI/Button/Button';
import ExportActions from '../../../components/UI/ExportActions';
import { AnimatePresence, motion } from 'framer-motion';

interface Props {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  isFilterVisible: boolean;
  setIsFilterVisible: (val: boolean) => void;
  selectedCount: number;
  onBulkDelete: () => void;
  onExportPdf: () => void;
  onExportExcel: () => void;
}

export const MiscWorkHeader: React.FC<Props> = ({ 
  searchQuery, setSearchQuery, isFilterVisible, setIsFilterVisible, 
  selectedCount, onBulkDelete, onExportPdf, onExportExcel 
}) => (
  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 px-1">
    <div className="text-left">
      <h1 className="text-2xl sm:text-3xl font-bold text-[#202224]">Miscellaneous Work</h1>
      <p className="text-xs sm:text-sm text-gray-500">Manage tasks and staff assignments.</p>
    </div>

    <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
      <div className="relative w-full sm:w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input 
          type="search" 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search By Employee, Address or Nature of Work  " 
          className="h-10 w-full bg-gray-200 rounded-full pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-secondary" 
        />
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto justify-start sm:justify-end">
        <button onClick={() => setIsFilterVisible(!isFilterVisible)} className={`p-2.5 rounded-lg border ${isFilterVisible ? 'bg-secondary text-white' : 'bg-white text-gray-600'}`}>
          <Filter className="h-5 w-5" />
        </button>

        <AnimatePresence>
          {selectedCount > 0 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <Button variant="danger" onClick={onBulkDelete} className="h-10 px-3 text-sm flex items-center gap-2">
                <Trash2 size={16} /> Delete ({selectedCount})
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        <ExportActions onExportPdf={onExportPdf} onExportExcel={onExportExcel} />
      </div>
    </div>
  </div>
);