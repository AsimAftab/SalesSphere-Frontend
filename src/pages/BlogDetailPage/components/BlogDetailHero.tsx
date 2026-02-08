import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { BlogPost } from '@/api/blogService';
import { getSafeImageUrl } from '@/utils/security';

interface BlogDetailHeroProps {
  post: BlogPost;
}

const heroVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

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
    <motion.div variants={heroVariants} initial="hidden" animate="visible">
      {/* Back link */}
      <Link
        to="/blog"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Blog
      </Link>

      {/* Tags */}
      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue-50 text-blue-600"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Title */}
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight mb-4">
        {post.title}
      </h1>

      {/* Meta */}
      <div className="flex items-center gap-4 text-sm text-gray-500 mb-8">
        <div className="flex items-center gap-1.5">
          <User className="h-4 w-4" />
          <span>{post.author.name}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Calendar className="h-4 w-4" />
          <span>{formattedDate}</span>
        </div>
      </div>

      {/* Cover Image */}
      {coverUrl && (
        <div className="rounded-xl overflow-hidden mb-8">
          <img
            src={coverUrl}
            alt={post.title}
            className="w-full h-auto max-h-[480px] object-cover"
          />
        </div>
      )}
    </motion.div>
  );
};

export default BlogDetailHero;
