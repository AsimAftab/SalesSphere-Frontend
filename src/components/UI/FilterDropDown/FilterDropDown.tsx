import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface FilterDropdownProps {
  label: string;
  options: string[];
  selected: string[];
  onChange: (values: string[]) => void;
  align?: 'left' | 'right';
  // New Prop to enable the "None" checkbox
  showNoneOption?: boolean; 
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({ 
  label, 
  options, 
  selected, 
  onChange, 
  align = 'left',
  showNoneOption = false 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => { 
        if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false); 
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // 1. Create the final list of options to display
  // We prepend 'None' to the array if showNoneOption is true
  const displayOptions = showNoneOption ? [...options,'None'] : options;

  const toggleOption = (opt: string) => {
    const newSelected = selected.includes(opt) 
        ? selected.filter(i => i !== opt) 
        : [...selected, opt];
    onChange(newSelected);
  };

  return (
    <div className="relative" ref={ref}>
      <div className="flex flex-col cursor-pointer group" onClick={() => setIsOpen(!isOpen)}>
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 group-hover:text-secondary transition-colors">
          <span className="whitespace-nowrap">
            {selected.length === 0 ? label : `${selected.length} Selected`}
          </span>
          <ChevronDownIcon className={`h-3 w-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: 10 }} 
            className={`absolute ${align === 'left' ? 'left-0' : 'right-0'} mt-3 w-52 sm:w-56 bg-white rounded-lg shadow-2xl py-2 z-[100] border border-gray-100 overflow-hidden`}
          >
            <div className="max-h-60 overflow-y-auto custom-scrollbar">
              {displayOptions.length === 0 ? (
                <div className="px-4 py-2 text-xs text-gray-400 italic">No options available</div>
              ) : (
                displayOptions.map(opt => (
                  <label key={opt} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 cursor-pointer transition-colors group">
                    <input 
                        type="checkbox" 
                        checked={selected.includes(opt)} 
                        onChange={() => toggleOption(opt)} 
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" 
                    />
                    {/* 2. Visual styling for the 'None' option to distinguish it */}
                    <span className={`capitalize group-hover:text-secondary truncate ${opt === 'None' ? 'italic font-medium text-gray-700' : ''}`}>
                      {opt}
                    </span>
                  </label>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FilterDropdown;