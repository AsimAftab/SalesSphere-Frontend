import React from 'react';
import { motion } from 'framer-motion';
import type { BlogPost } from '@/api/blogService';
import BlogPostCard from '../../BlogPage/components/BlogPostCard';

interface BlogRelatedPostsProps {
  posts: BlogPost[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
};



const BlogRelatedPosts: React.FC<BlogRelatedPostsProps> = ({ posts }) => {
  if (posts.length === 0) return null;

  return (
    <div className="mt-16 pt-10 border-t border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-8 border-l-4 border-secondary pl-4">Latest Posts</h2>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {posts.slice(0, 3).map((post) => (
          <BlogPostCard key={post.id} post={post} />
        ))}
      </motion.div>
    </div>
  );
};

export default BlogRelatedPosts;
