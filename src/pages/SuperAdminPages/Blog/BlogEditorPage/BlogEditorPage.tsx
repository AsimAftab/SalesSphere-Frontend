import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { BlogEditorForm } from './components';
import { getPostById, createPost, updatePost } from '@/api/blogService';
import type { BlogEditorFormData } from './BlogEditorPage.schema';

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
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <button
          onClick={() => navigate('/system-admin/blog')}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Blog Management
        </button>
        <h1 className="text-xl font-bold text-gray-900">
          {isEditing ? 'Edit Blog Post' : 'Create New Blog Post'}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {isEditing
            ? 'Update the blog post details below'
            : 'Fill in the details to create a new blog post'}
        </p>
      </div>

      <BlogEditorForm
        initialData={isEditing ? post : undefined}
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
};

export default BlogEditorPage;
