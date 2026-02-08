import React, { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui';
import { blogEditorSchema, DEFAULT_FORM_VALUES } from '../BlogEditorPage.schema';
import type { BlogEditorFormData } from '../BlogEditorPage.schema';
import type { BlogPost } from '@/api/blogService';
import BlogRichTextEditor from './BlogRichTextEditor';
import BlogCoverImageUpload from './BlogCoverImageUpload';

interface BlogEditorFormProps {
  initialData?: BlogPost;
  onSubmit: (data: BlogEditorFormData, coverImage?: File) => void;
  isSubmitting: boolean;
}

const BlogEditorForm: React.FC<BlogEditorFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting,
}) => {
  const [coverImageFile, setCoverImageFile] = useState<File | undefined>();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BlogEditorFormData>({
    resolver: zodResolver(blogEditorSchema),
    defaultValues: initialData
      ? {
          title: initialData.title,
          slug: initialData.slug,
          excerpt: initialData.excerpt,
          content: initialData.content,
          tags: initialData.tags.join(', '),
          status: initialData.status,
        }
      : DEFAULT_FORM_VALUES,
  });

  const contentValue = watch('content');
  const statusValue = watch('status');

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const title = e.target.value;
      setValue('title', title, { shouldValidate: true });
      // Auto-generate slug from title if slug is empty or matches the previous auto-generated slug
      if (!initialData) {
        const slug = title
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '');
        setValue('slug', slug, { shouldValidate: true });
      }
    },
    [setValue, initialData],
  );

  const handleContentChange = useCallback(
    (html: string) => {
      setValue('content', html, { shouldValidate: true });
    },
    [setValue],
  );

  const handleFormSubmit = (data: BlogEditorFormData) => {
    onSubmit(data, coverImageFile);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5">
        {/* Title */}
        <div>
          <label htmlFor="blog-title" className="block text-sm font-semibold text-gray-700 mb-1.5">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            id="blog-title"
            type="text"
            placeholder="Enter blog post title"
            className={`w-full px-4 py-2.5 rounded-lg border bg-white text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow text-sm ${
              errors.title ? 'border-red-300' : 'border-gray-300'
            }`}
            {...register('title')}
            onChange={handleTitleChange}
          />
          {errors.title && (
            <p className="mt-1.5 text-xs font-medium text-red-500">{errors.title.message}</p>
          )}
        </div>

        {/* Slug */}
        <div>
          <label htmlFor="blog-slug" className="block text-sm font-semibold text-gray-700 mb-1.5">
            Slug <span className="text-red-500">*</span>
          </label>
          <input
            id="blog-slug"
            type="text"
            placeholder="blog-post-url-slug"
            className={`w-full px-4 py-2.5 rounded-lg border bg-white text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow text-sm ${
              errors.slug ? 'border-red-300' : 'border-gray-300'
            }`}
            {...register('slug')}
          />
          {errors.slug && (
            <p className="mt-1.5 text-xs font-medium text-red-500">{errors.slug.message}</p>
          )}
        </div>

        {/* Excerpt */}
        <div>
          <label htmlFor="blog-excerpt" className="block text-sm font-semibold text-gray-700 mb-1.5">
            Excerpt <span className="text-red-500">*</span>
          </label>
          <textarea
            id="blog-excerpt"
            placeholder="Brief summary of the blog post"
            rows={3}
            className={`w-full px-4 py-2.5 rounded-lg border bg-white text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow text-sm resize-none ${
              errors.excerpt ? 'border-red-300' : 'border-gray-300'
            }`}
            {...register('excerpt')}
          />
          {errors.excerpt && (
            <p className="mt-1.5 text-xs font-medium text-red-500">{errors.excerpt.message}</p>
          )}
        </div>

        {/* Tags */}
        <div>
          <label htmlFor="blog-tags" className="block text-sm font-semibold text-gray-700 mb-1.5">
            Tags
          </label>
          <input
            id="blog-tags"
            type="text"
            placeholder="sales, tips, product-update (comma separated)"
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow text-sm"
            {...register('tags')}
          />
          <p className="mt-1 text-xs text-gray-400">Separate tags with commas</p>
        </div>

        {/* Cover Image */}
        <BlogCoverImageUpload
          currentImageUrl={initialData?.coverImage?.url}
          selectedFile={coverImageFile}
          onFileSelect={setCoverImageFile}
        />

        {/* Content (Rich Text Editor) */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Content <span className="text-red-500">*</span>
          </label>
          <BlogRichTextEditor
            content={contentValue}
            onChange={handleContentChange}
            error={!!errors.content}
          />
          {errors.content && (
            <p className="mt-1.5 text-xs font-medium text-red-500">{errors.content.message}</p>
          )}
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Status</label>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="draft"
                checked={statusValue === 'draft'}
                onChange={() => setValue('status', 'draft')}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Draft</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="published"
                checked={statusValue === 'published'}
                onChange={() => setValue('status', 'published')}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Published</span>
            </label>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <Button variant="outline" type="button" onClick={() => window.history.back()}>
          Cancel
        </Button>
        <Button variant="secondary" type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? initialData
              ? 'Updating...'
              : 'Creating...'
            : initialData
              ? 'Update Post'
              : 'Create Post'}
        </Button>
      </div>
    </form>
  );
};

export default BlogEditorForm;
