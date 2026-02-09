import React from 'react';
import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { heroVariants } from '../HelpCenterPage.animations';

interface HelpCenterHeroProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const HelpCenterHero: React.FC<HelpCenterHeroProps> = ({ searchQuery, onSearchChange }) => (
  <motion.section
    variants={heroVariants}
    initial="hidden"
    animate="visible"
    className="text-center mb-16"
  >
    <div className="max-w-3xl mx-auto">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-primary animate-gradient-x">
          How can we help you?
        </span>
      </h1>
      <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
        Explore guides for getting started, administration, field operations, and troubleshooting to master SalesSphere.
      </p>

      <div className="relative max-w-2xl mx-auto group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-secondary/30 to-primary/30 rounded-2xl blur opacity-50 group-hover:opacity-100 transition duration-200"></div>
        <div className="relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400 group-focus-within:text-secondary transition-colors" />
          <input
            type="text"
            placeholder="Ask a question..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-14 pr-12 py-4 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 shadow-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all text-base"
          />
          {searchQuery ? (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          ) : (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1 pointer-events-none">
              <kbd className="hidden sm:inline-flex h-6 items-center gap-1 rounded border border-gray-200 bg-gray-50 px-2 font-mono text-[10px] font-medium text-gray-500 opacity-100">
                <span className="text-xs">⌘</span>K
              </kbd>
            </div>
          )}
        </div>
      </div>
    </div>
  </motion.section>
);

export default HelpCenterHero;
