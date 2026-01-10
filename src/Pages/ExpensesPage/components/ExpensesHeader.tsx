import React from 'react';
import { Search, Trash2, Filter } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

// UI Components
import Button from '../../../components/UI/Button/Button';
import ExportActions from '../../../components/UI/Export/ExportActions';

interface ExpensesHeaderProps {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  isFilterVisible: boolean;
  setIsFilterVisible: (val: boolean) => void;
  selectedCount: number;
  onBulkDelete: () => void;
  onExportPdf: () => void;
  onExportExcel: () => void;
  handleCreate: () => void;
  setCurrentPage: (page: number) => void;
  // Permissions
  permissions: {
    canCreate: boolean;
    canDelete: boolean;
    canExportPdf: boolean;
    canExportExcel: boolean;
  };
}

export const ExpensesHeader: React.FC<ExpensesHeaderProps> = ({
  searchTerm,
  setSearchTerm,
  isFilterVisible,
  setIsFilterVisible,
  selectedCount,
  onBulkDelete,
  onExportPdf,
  onExportExcel,
  handleCreate,
  setCurrentPage,
  permissions
}) => (
  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 px-1">
    {/* Section 1: Title and Subtitle */}
    <div className="text-left">
      <h1 className="text-2xl sm:text-3xl font-black text-[#202224] ">
        Expenses List
      </h1>
      <p className="text-xs sm:text-sm text-gray-500">Track and audit settlement records.</p>
    </div>

    {/* Section 2: Actions Wrapper (Handles the 3-row mobile logic) */}
    <div className="flex flex-col lg:flex-row items-center gap-4 w-full lg:w-auto">

      {/* MOBILE ROW 1: Search Bar (Full width on mobile) */}
      <div className="relative w-full lg:w-72 xl:w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="search"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Reset pagination on search
          }}
          placeholder="Search By Title or Category"
          className="h-11 lg:h-10 w-full bg-gray-200 rounded-full pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-secondary transition-all"
        />
      </div>

      {/* MOBILE ROW 2: Utilities (Filter, Delete, Export) */}
      <div className="flex items-center justify-between lg:justify-end gap-3 w-full lg:w-auto">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsFilterVisible(!isFilterVisible)}
            className={`p-2.5 rounded-lg border transition-colors ${isFilterVisible ? 'bg-secondary text-white border-secondary' : 'bg-white text-gray-600 border-gray-200'
              }`}
          >
            <Filter className="h-5 w-5" />
          </button>

          <ExportActions
            onExportPdf={permissions.canExportPdf ? onExportPdf : undefined}
            onExportExcel={permissions.canExportExcel ? onExportExcel : undefined}
          />
        </div>

        {/* Delete button appears in this utility row when active */}
        <AnimatePresence>
          {selectedCount > 0 && permissions.canDelete && (
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

      {/* MOBILE ROW 3: Primary Create Button (Full width on mobile) */}
      {permissions.canCreate && (
        <div className="w-full lg:w-auto">
          <Button
            onClick={handleCreate}
            className="h-11 lg:h-10 w-full lg:w-auto px-6  tracking-wider flex items-center justify-center gap-2 shadow-sm"
          >
            <span>Create Expense</span>
          </Button>
        </div>
      )}

    </div>
  </div>
);