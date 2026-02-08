import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, List } from 'lucide-react';
import type { LegalSection } from '../LegalPageLayout.types';

interface Props {
  sections: LegalSection[];
  activeId: string;
}

const LegalMobileNav: React.FC<Props> = ({ sections, activeId }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const activeSection = sections.find((s) => s.id === activeId);

  const scrollTo = (id: string) => {
    setOpen(false);
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 100;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} className="lg:hidden sticky top-20 z-30 mb-6">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between bg-white border border-gray-200 shadow-sm rounded-xl px-4 py-3.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
      >
        <span className="flex items-center gap-2.5">
          <List className="w-4 h-4 text-primary/60" />
          <span className="text-[13px]">
            {activeSection
              ? `${String(activeSection.number).padStart(2, '0')}. ${activeSection.navTitle}`
              : 'Navigate sections'}
          </span>
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-gray-200 shadow-lg rounded-xl py-1.5 max-h-72 overflow-y-auto"
          >
            {sections.map((s) => {
              const isActive = activeId === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => scrollTo(s.id)}
                  className={`w-full text-left px-4 py-2.5 text-[13px] transition-colors flex items-center gap-2.5 ${
                    isActive
                      ? 'bg-secondary/10 text-secondary font-semibold'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-[11px] font-bold tabular-nums opacity-50 min-w-[18px]">
                    {String(s.number).padStart(2, '0')}
                  </span>
                  {s.navTitle}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LegalMobileNav;
