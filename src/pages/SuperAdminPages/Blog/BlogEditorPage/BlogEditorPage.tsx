import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { BlogEditorSkeleton } from './components';
import { getPostById, createPost, updatePost } from '@/api/blogService';
import type { BlogEditorFormData } from './BlogEditorPage.schema';
import { DetailPageHeader } from '@/components/ui';

const BlogEditorForm = React.lazy(() => import('./components/BlogEditorForm'));

const BlogEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditing = !!id;

  const { data: post, isLoading } = useQuery({
    queryKey: ['blogPost', id],
    queryFn: () => getPostById(id!),
    enabled: isEditing,
  });

  const createMutation = useMutation({
    mutationFn: ({ data, coverImage }: { data: BlogEditorFormData; coverImage?: File }) =>
      createPost({
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        tags: data.tags
          ? data.tags.split(',').map((t) => t.trim()).filter(Boolean)
          : [],
        status: data.status,
        coverImage,
      }),
    onSuccess: () => {
      toast.success('Blog post created successfully!');
      queryClient.invalidateQueries({ queryKey: ['adminBlogPosts'] });
      navigate('/system-admin/blog');
    },
    onError: (error: Error & { response?: { data?: { message?: string } } }) => {
      toast.error(error?.response?.data?.message || error.message || 'Failed to create post');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ data, coverImage }: { data: BlogEditorFormData; coverImage?: File }) =>
      updatePost(id!, {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        tags: data.tags
          ? data.tags.split(',').map((t) => t.trim()).filter(Boolean)
          : [],
        status: data.status,
        coverImage,
        removeCoverImage: data.removeCoverImage,
      }),
    onSuccess: () => {
      toast.success('Blog post updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['adminBlogPosts'] });
      queryClient.invalidateQueries({ queryKey: ['blogPost', id] });
      navigate('/system-admin/blog');
    },
    onError: (error: Error & { response?: { data?: { message?: string } } }) => {
      toast.error(error?.response?.data?.message || error.message || 'Failed to update post');
    },
  });

  const handleSubmit = (data: BlogEditorFormData, coverImage?: File) => {
    if (isEditing) {
      updateMutation.mutate({ data, coverImage });
    } else {
      createMutation.mutate({ data, coverImage });
    }
  };

  if (isEditing && isLoading) {
    return (
      <div className="max-w-[1600px] mx-auto p-6">
        <BlogEditorSkeleton />
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto p-6">
      <DetailPageHeader
        title={isEditing ? 'Edit Blog Post' : 'Create New Blog Post'}
        subtitle={
          isEditing
            ? 'Update the blog post details below'
            : 'Fill in the details to create a new blog post'
        }
        backPath="/system-admin/blog"
        backLabel="Back to Blog Management"
      />

      <React.Suspense
        fallback={
          <div className="max-w-[1600px] mx-auto p-6">
            <BlogEditorSkeleton />
          </div>
        }
      >
        <BlogEditorForm
          initialData={isEditing ? post : undefined}
          onSubmit={handleSubmit}
          isSubmitting={createMutation.isPending || updateMutation.isPending}
          onCancel={() => navigate('/system-admin/blog')}
        />
      </React.Suspense>
    </div>
  );
};

export default BlogEditorPage;
