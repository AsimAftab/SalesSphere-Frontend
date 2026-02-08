import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { BlogHero, BlogPostCard, BlogEmptyState } from './components';
import { containerVariants } from './BlogListPage.animations';
import { getPublishedPosts } from '@/api/blogService';
import type { BlogPost } from '@/api/blogService';
import { usePagination } from '@/hooks/usePagination';

const BLOG_POSTS_QUERY_KEY = 'blogPosts';

const BlogListPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: posts = [], isLoading } = useQuery<BlogPost[]>({
    queryKey: [BLOG_POSTS_QUERY_KEY],
    queryFn: getPublishedPosts,
  });

  const query = searchQuery.trim().toLowerCase();

  const filteredPosts = useMemo(() => {
    if (!query) return posts;
    return posts.filter(
      (post) =>
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.tags.some((tag) => tag.toLowerCase().includes(query)),
    );
  }, [posts, query]);

  const {
    paginate,
    currentPage,
    totalPages,
    setCurrentPage,
    hasNextPage,
    hasPrevPage,
    nextPage,
    prevPage,
  } = usePagination<BlogPost>(filteredPosts.length, { initialPageSize: 9 });

  const paginatedPosts = paginate(filteredPosts);

  return (
    <div className="bg-gray-100 min-h-screen pt-20">
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <BlogHero searchQuery={searchQuery} onSearchChange={setSearchQuery} />

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : paginatedPosts.length > 0 ? (
          <>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {paginatedPosts.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </motion.div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  onClick={prevPage}
                  disabled={!hasPrevPage}
                  className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 text-sm font-medium rounded-lg transition-colors ${page === currentPage
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={nextPage}
                  disabled={!hasNextPage}
                  className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <BlogEmptyState hasSearch={!!query} />
        )}
      </div>
    </div>
  );
};

export default BlogListPage;
