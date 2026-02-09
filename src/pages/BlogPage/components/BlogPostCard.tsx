import React from 'react';
import { Link } from 'react-router-dom';
import type { BlogPostCard as BlogPostCardType } from '../BlogListPage.types';
import { formatLongDate } from '@/utils/dateUtils';
import { getSafeImageUrl } from '@/utils/security';

interface BlogPostCardProps {
  post: BlogPostCardType;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post }) => {
  const formattedDate = formatLongDate(post.publishedAt || post.createdAt);

  const coverUrl = getSafeImageUrl(post.coverImage?.url ?? null);

  return (
    <div className="h-full">
      <Link
        to={`/blog/${post.slug}`}
        className="group flex flex-col h-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300"
      >
        {/* Cover Image Container */}
        <div className="relative w-full aspect-[16/9] bg-gray-100 overflow-hidden group-hover:opacity-90 transition-opacity">
          {coverUrl ? (
            <img
              src={coverUrl}
              alt={post.title}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-secondary">
              <span className="text-6xl font-bold text-white">
                {post.title.charAt(0)}
              </span>
            </div>
          )}

          {/* Tag Overlay (First tag only) */}
          {post.tags.length > 0 && (
            <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm z-10">
              <span className="text-xs font-semibold text-secondary tracking-wide uppercase">
                {post.tags[0]}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-grow">
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h3>

          <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-4 text-justify">
            {post.excerpt}
          </p>

          {/* Footer: Author & Date */}
          <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
            <span className="text-secondary font-semibold text-xs uppercase tracking-wider">
              {post.author.name}
            </span>
            <span className="text-gray-400 text-xs font-medium">
              {formattedDate}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default BlogPostCard;
