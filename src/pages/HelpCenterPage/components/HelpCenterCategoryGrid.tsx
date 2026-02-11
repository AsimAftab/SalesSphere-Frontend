import React from 'react';
import { motion } from 'framer-motion';
import type { FAQCategory } from '../HelpCenterPage.types';
import { containerVariants } from '../HelpCenterPage.animations';
import HelpCenterCategoryCard from './HelpCenterCategoryCard';

interface HelpCenterCategoryGridProps {
  categories: FAQCategory[];
  matchCounts: Record<string, number> | null;
  onSelectCategory: (categoryId: string) => void;
  onClearSearch: () => void;
}

const HelpCenterCategoryGrid: React.FC<HelpCenterCategoryGridProps> = ({
  categories,
  matchCounts,
  onSelectCategory,
  onClearSearch,
}) => {
  const visibleCategories = React.useMemo(() => {
    if (!matchCounts) return categories;
    return categories.filter((cat) => (matchCounts[cat.id] ?? 0) > 0);
  }, [categories, matchCounts]);

  if (visibleCategories.length === 0 && matchCounts) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-20"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No matching help topics found</h3>
        <p className="text-gray-500 max-w-md mx-auto">
          Try adjusting your search or browse the categories below.
        </p>
        <button
          onClick={onClearSearch}
          className="mt-6 text-blue-600 font-medium hover:text-blue-800 hover:underline"
        >
          Clear search
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
    >
      {visibleCategories.map((cat) => (
        <HelpCenterCategoryCard
          key={cat.id}
          category={cat}
          matchCount={matchCounts ? (matchCounts[cat.id] ?? 0) : null}
          onClick={() => onSelectCategory(cat.id)}
        />
      ))}
    </motion.div>
  );
};

export default HelpCenterCategoryGrid;
