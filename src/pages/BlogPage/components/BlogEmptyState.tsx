import React from 'react';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import { contentVariants } from '../BlogListPage.animations';

interface BlogEmptyStateProps {
  hasSearch: boolean;
}

const BlogEmptyState: React.FC<BlogEmptyStateProps> = ({ hasSearch }) => (
  <motion.div
    variants={contentVariants}
    initial="hidden"
    animate="visible"
    className="text-center py-16"
  >
    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-200 mb-4">
      <FileText className="h-8 w-8 text-gray-400" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-1">
      {hasSearch ? 'No articles found' : 'No articles yet'}
    </h3>
    <p className="text-sm text-gray-500 max-w-sm mx-auto">
      {hasSearch
        ? 'Try adjusting your search terms or clearing the filter.'
        : 'Stay tuned! New articles will be published soon.'}
    </p>
  </motion.div>
);

export default BlogEmptyState;
