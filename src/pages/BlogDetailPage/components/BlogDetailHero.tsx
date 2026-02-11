import React from 'react';
import { Link } from 'react-router-dom';
import type { BlogPost } from '@/api/blogService';
import { getSafeImageUrl } from '@/utils/security';

interface BlogDetailHeroProps {
  post: BlogPost;
}

const BlogDetailHero: React.FC<BlogDetailHeroProps> = ({ post }) => {
  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    : new Date(post.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  const coverUrl = getSafeImageUrl(post.coverImage?.url ?? null);

  return (
    <div className="mb-8">
      {/* Title */}
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight mb-4 leading-tight">
        {post.title}
      </h1>

      {/* Meta Row */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500 mb-6">
        <span className="font-bold text-blue-700 text-lg">{post.author.name}</span>
        <span>•</span>
        <span>Posted on {formattedDate}</span>
        {post.updatedAt && post.updatedAt !== post.createdAt && (
          <>
            <span>•</span>
            <span>Updated on {new Date(post.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </>
        )}
      </div>

      {/* Cover Image */}
      <div className="relative aspect-[21/9] rounded-xl overflow-hidden bg-gray-100 mb-6">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-secondary text-white">
            <span className="text-6xl font-bold opacity-30">
              {post.title.charAt(0)}
            </span>
          </div>
        )}
      </div>

      {/* Breadcrumbs / Tags Line */}
      <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-2">
        <Link to="/" className="hover:text-blue-700 transition-colors">Home</Link>
        <span>/</span>
        <Link to="/blog" className="hover:text-blue-700 transition-colors">Blog</Link>
        <span>/</span>
        {post.tags.length > 0 && (
          <>
            <span className="font-medium text-blue-700">{post.tags[0]}</span>
            <span>/</span>
          </>
        )}
        <span className="text-gray-900 truncate max-w-[200px]">{post.title}</span>
      </div>
    </div>
  );
};

export default BlogDetailHero;
