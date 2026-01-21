import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Check, ChevronDown } from 'lucide-react';

interface SelectOption { id: string; label: string; }

interface Props {
  label: string;
  options: SelectOption[];
  onSelect: (opt: SelectOption) => void;
  placeholder: string;
  selectedId?: string;
  value: string;
}

export const SearchableSelect: React.FC<Props> = ({ label, options, onSelect, placeholder, selectedId, value }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);
  
  // 1. Ref to track the currently highlighted list item for scrolling
  const activeItemRef = useRef<HTMLLIElement>(null);

  const filtered = options.filter(opt => opt.label.toLowerCase().includes(search.toLowerCase()));

  // 2. Logic to scroll the active item into view during keyboard navigation
  useEffect(() => {
    if (activeIndex >= 0 && activeItemRef.current) {
      activeItemRef.current.scrollIntoView({
        block: 'nearest', // Scrolls only if the item is out of view
        behavior: 'smooth'
      });
    }
  }, [activeIndex]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') setIsOpen(true);
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => (prev < filtered.length - 1 ? prev + 1 : prev));
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => (prev > 0 ? prev - 1 : prev));
    }
    if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      onSelect(filtered[activeIndex]);
      setIsOpen(false);
    }
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    setActiveIndex(-1); 
  }, [search]);

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setIsOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative w-full" ref={ref} onKeyDown={handleKeyDown}>
      <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase ml-1 tracking-wider">{label}</label>
      <div 
        role="combobox" aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)} 
        className={`w-full px-4 py-3 border rounded-xl cursor-pointer flex justify-between items-center bg-white shadow-sm transition-all hover:border-secondary ${isOpen ? 'border-secondary ring-2 ring-secondary/10' : ''}`}
      >
        <span className={`text-sm truncate ${value ? 'text-gray-900 font-bold' : 'text-gray-400 font-medium'}`}>
          {value || placeholder}
        </span>
        <ChevronDown size={18} className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute z-[200] w-full mt-2 bg-white border rounded-2xl shadow-2xl overflow-hidden ring-1 ring-black/5">
            <div className="p-3 border-b bg-gray-50/50">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input autoFocus className="w-full pl-10 pr-4 py-2 text-sm border rounded-xl focus:ring-2 focus:ring-secondary outline-none transition-all" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
            </div>
            {/* 3. Ensure overflow-y-auto is present on the list container */}
            <ul role="listbox" className="max-h-60 overflow-y-auto custom-scrollbar">
              {filtered.map((opt, index) => (
                <li 
                  key={opt.id} 
                  // 4. Attach the active ref only to the currently highlighted item
                  ref={index === activeIndex ? activeItemRef : null}
                  role="option" 
                  aria-selected={opt.id === selectedId}
                  onClick={() => { onSelect(opt); setIsOpen(false); }}
                  className={`px-4 py-3 text-sm cursor-pointer flex justify-between items-center border-b last:border-0 transition-colors 
                    ${index === activeIndex ? 'bg-secondary/10' : 'hover:bg-blue-50/50'}
                    ${opt.id === selectedId ? 'bg-secondary/5' : ''}`}
                >
                  <span className={`font-bold ${opt.id === selectedId ? 'text-secondary' : 'text-gray-800'}`}>{opt.label}</span>
                  {opt.id === selectedId && <Check size={16} className="text-secondary" />}
                </li>
              ))}
              {filtered.length === 0 && (
                <div className="p-8 text-center text-gray-400 text-xs font-bold uppercase tracking-widest">No results found</div>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};