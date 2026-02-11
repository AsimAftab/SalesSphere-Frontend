import React from 'react';
import { motion } from 'framer-motion';
import type { LegalSection } from '../LegalPageLayout.types';
import { sidebarItemVariants } from '../LegalPageLayout.animations';

interface Props {
  sections: LegalSection[];
  activeId: string;
}

const LegalSidebar: React.FC<Props> = ({ sections, activeId }) => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 100;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  return (
    <div className="hidden lg:block lg:col-span-1">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm sticky top-24 overflow-hidden">
        <div className="px-5 pt-5 pb-3">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Table of Contents
          </h2>
        </div>

        <nav className="px-3 pb-4 space-y-0.5">
          {sections.map((s, i) => {
            const isActive = activeId === s.id;
            return (
              <motion.button
                key={s.id}
                custom={i}
                variants={sidebarItemVariants}
                initial="hidden"
                animate="visible"
                onClick={() => scrollTo(s.id)}
                className={`relative flex items-center text-[13px] w-full text-left pl-4 pr-3 py-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-secondary/10 text-secondary font-semibold'
                    : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-secondary rounded-full" />
                )}
                <span className="mr-2.5 text-[11px] font-bold tabular-nums opacity-60 min-w-[18px]">
                  {String(s.number).padStart(2, '0')}
                </span>
                <span className="truncate">{s.navTitle}</span>
              </motion.button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default LegalSidebar;
