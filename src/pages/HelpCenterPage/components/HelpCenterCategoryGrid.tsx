import React from 'react';
import { motion } from 'framer-motion';
import type { FAQCategory } from '../HelpCenterPage.types';
import { containerVariants } from '../HelpCenterPage.animations';
import HelpCenterCategoryCard from './HelpCenterCategoryCard';

interface HelpCenterCategoryGridProps {
  categories: FAQCategory[];
  matchCounts: Record<string, number> | null;
  onSelectCategory: (categoryId: string) => void;
}

const HelpCenterCategoryGrid: React.FC<HelpCenterCategoryGridProps> = ({
  categories,
  matchCounts,
  onSelectCategory,
}) => (
  <motion.div
    variants={containerVariants}
    initial="hidden"
    animate="visible"
    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
  >
    {categories.map((cat) => (
      <HelpCenterCategoryCard
        key={cat.id}
        category={cat}
        matchCount={matchCounts ? (matchCounts[cat.id] ?? 0) : null}
        onClick={() => onSelectCategory(cat.id)}
      />
    ))}
  </motion.div>
);

export default HelpCenterCategoryGrid;
