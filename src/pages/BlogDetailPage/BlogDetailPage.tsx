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

  const relatedPosts = useMemo(() => {
    if (!post || allPosts.length === 0) return [];
    return allPosts
      .filter((p) => p.id !== post.id)
      .filter(
        (p) =>
          p.tags.some((tag) => post.tags.includes(tag)) || true,
      )
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
    <div className="bg-gray-100 min-h-screen pt-20">
      <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <BlogDetailHero post={post} />
        <BlogDetailContent content={post.content} />
        <BlogRelatedPosts posts={relatedPosts} />
      </div>
    </div>
  );
};

export default BlogDetailPage;
