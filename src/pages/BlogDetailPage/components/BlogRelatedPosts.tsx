import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import type { BlogPost } from '@/api/blogService';
import { getSafeImageUrl } from '@/utils/security';

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

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

const BlogRelatedPosts: React.FC<BlogRelatedPostsProps> = ({ posts }) => {
  if (posts.length === 0) return null;

  return (
    <div className="mt-16 pt-10 border-t border-gray-200">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Related Articles</h2>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {posts.slice(0, 3).map((post) => {
          const coverUrl = getSafeImageUrl(post.coverImage?.url ?? null);
          const formattedDate = post.publishedAt
            ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })
            : new Date(post.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              });

          return (
            <motion.div key={post.id} variants={cardVariants}>
              <Link
                to={`/blog/${post.slug}`}
                className="group block rounded-xl bg-white border border-gray-200 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
              >
                <div className="aspect-[16/9] bg-gray-100 overflow-hidden">
                  {coverUrl ? (
                    <img
                      src={coverUrl}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                      <span className="text-3xl font-bold text-blue-200">
                        {post.title.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Calendar className="h-3 w-3" />
                    <span>{formattedDate}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default BlogRelatedPosts;
