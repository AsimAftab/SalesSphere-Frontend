import React from 'react';
import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { heroVariants } from '../BlogListPage.animations';

interface BlogHeroProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const BlogHero: React.FC<BlogHeroProps> = ({ searchQuery, onSearchChange }) => (
  <motion.section
    variants={heroVariants}
    initial="hidden"
    animate="visible"
    className="text-center mb-10"
  >
    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
      Blog
    </h1>
    <p className="mt-2 text-sm text-gray-500">
      Product updates, field sales tips, how-to guides, and company news
    </p>

    <div className="relative max-w-lg mx-auto mt-6">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
      <input
        type="text"
        placeholder="Search articles by title, topic, or tag..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full pl-12 pr-10 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow text-sm"
      />
      {searchQuery && (
        <button
          onClick={() => onSearchChange('')}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="h-4 w-4 text-gray-400" />
        </button>
      )}
    </div>
  </motion.section>
);

export default BlogHero;
