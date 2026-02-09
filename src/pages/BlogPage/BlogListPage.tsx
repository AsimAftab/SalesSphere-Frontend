import React, { useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { BlogHero, BlogPostCard, BlogEmptyState } from './components';
import { getPublishedPosts } from '@/api/blogService';
import type { BlogPost } from '@/api/blogService';
import { usePagination } from '@/hooks/usePagination';

const BLOG_POSTS_QUERY_KEY = 'blogPosts';

const BlogListPage: React.FC = () => {
  // const [searchQuery, setSearchQuery] = useState(''); // Removed search functionality as per request

  const { data: posts = [], isLoading } = useQuery<BlogPost[]>({
    queryKey: [BLOG_POSTS_QUERY_KEY],
    queryFn: getPublishedPosts,
  });

  // const query = searchQuery.trim().toLowerCase();

  const filteredPosts = useMemo(() => {
    // if (!query) return posts;
    return posts;
    // return posts.filter(...)
  }, [posts]);

  const {
    paginate,
    currentPage,
    totalPages,
    setCurrentPage,
    hasNextPage,
    hasPrevPage,
    nextPage,
    prevPage,
  } = usePagination<BlogPost>(filteredPosts.length, { initialPageSize: 6 });

  const paginatedPosts = paginate(filteredPosts);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  return (
    <div className="bg-gray-100 min-h-screen pt-20">
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <BlogHero />

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : paginatedPosts.length > 0 ? (
          <>
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6"
            >
              {paginatedPosts.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-end gap-2 mt-10">
                {hasPrevPage && (
                  <button
                    onClick={prevPage}
                    className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Previous
                  </button>
                )}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-center ${page === currentPage
                        ? 'bg-secondary text-white shadow-md transform scale-105'
                        : 'border border-gray-200 bg-white text-gray-600 hover:border-secondary hover:text-secondary'
                      }`}
                  >
                    {page}
                  </button>
                ))}
                {hasNextPage && (
                  <button
                    onClick={nextPage}
                    className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Next
                  </button>
                )}
              </div>
            )}
          </>
        ) : (
          <BlogEmptyState hasSearch={false} />
        )}
      </div>
    </div>
  );
};

export default BlogListPage;
