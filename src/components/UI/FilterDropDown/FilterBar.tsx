import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FunnelIcon, ArrowPathIcon, XMarkIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface FilterBarProps {
  isVisible: boolean;
  onClose: () => void;
  onReset: () => void;
  children: React.ReactNode;
}

const FilterBar: React.FC<FilterBarProps> = ({ isVisible, onClose, onReset, children }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="overflow-visible mb-6 px-1 z-[70]"
        >
          <div className="bg-white rounded-xl p-4 sm:p-5 text-gray-900 flex flex-wrap items-center gap-x-6 gap-y-4 shadow-xl relative z-[70]">
            <div className="flex items-center gap-2 text-sm font-semibold border-b sm:border-b-0 sm:border-r border-gray-100 pb-2 sm:pb-0 sm:pr-6 w-full sm:w-auto">
              <FunnelIcon className="h-4 w-4 text-gray-900" />
              <span>Filter By</span>
            </div>

            {/* Injected FilterDropdowns go here */}
            {children}

            <div className="flex items-center justify-between w-full sm:w-auto sm:ml-auto gap-4">
              <button
                onClick={() => {
                  onReset();
                  toast.success("Filters reset successfully");
                }}
                className="flex items-center gap-2 text-orange-500 hover:text-orange-700 transition-colors text-sm font-bold uppercase tracking-wider"
              >
                <ArrowPathIcon className="h-4 w-4" /> Reset
              </button>
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <XMarkIcon className="h-5 w-5 text-gray-900 hover:text-red-600" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FilterBar;