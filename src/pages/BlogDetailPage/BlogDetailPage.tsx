import React, { useMemo } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { BlogDetailHero, BlogDetailContent, BlogRelatedPosts } from './components';
import { getPostBySlug, getPublishedPosts } from '@/api/blogService';

const BlogDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: post, isLoading, isError } = useQuery({
    queryKey: ['blogPost', slug],
    queryFn: () => getPostBySlug(slug!),
    enabled: !!slug,
  });

  const { data: allPosts = [] } = useQuery({
    queryKey: ['blogPosts'],
    queryFn: getPublishedPosts,
  });

  const latestPosts = useMemo(() => {
    if (!post || allPosts.length === 0) return [];
    return allPosts
      .filter((p) => p.id !== post.id)
      .sort((a, b) => {
        const dateA = new Date(a.publishedAt || a.createdAt).getTime();
        const dateB = new Date(b.publishedAt || b.createdAt).getTime();
        return dateB - dateA;
      })
      .slice(0, 3);
  }, [post, allPosts]);

  if (isLoading) {
    return (
      <div className="bg-gray-100 min-h-screen pt-20">
        <div className="flex justify-center py-32">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  if (isError || !post) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <div className="bg-gray-100 min-h-screen pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Main Content Card */}
        <div className="bg-white rounded-xl shadow-sm p-8 md:p-12">
          <BlogDetailHero post={post} />

          {/* Excerpt / Lead Paragraph */}
          {post.excerpt && (
            <div className="mt-8 mb-10">
              <p className="text-lg text-gray-800 leading-relaxed font-medium">
                {post.excerpt}
              </p>
            </div>
          )}

          <div className="mt-8">
            <BlogDetailContent content={post.content} />
          </div>
        </div>

        {/* Latest Posts Section (Outside Card) */}
        <div className="mt-16 max-w-5xl mx-auto">
          {/* Heading is handled inside BlogRelatedPosts now, or I should update it there. 
             Wait, BlogDetailPage had:
             <h2 ...>Related Posts</h2>
             <BlogRelatedPosts ... />
             
             Let me check BlogDetailPage lines 61-66 again from my previous read.
             Ah, the previous read showed:
             <div className="mt-16 ...">
               <h2 ...>Related Posts</h2>
               <BlogRelatedPosts posts={relatedPosts} />
             </div>
             
             So I need to update the H2 here as well.
          */}
          <BlogRelatedPosts posts={latestPosts} />
        </div>

      </div>
    </div>
  );
};

export default BlogDetailPage;
