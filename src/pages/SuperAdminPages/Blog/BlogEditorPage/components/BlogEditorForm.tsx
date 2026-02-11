import React, { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, FormField, Input } from '@/components/ui';
import { blogEditorSchema, DEFAULT_FORM_VALUES } from '../BlogEditorPage.schema';
import type { BlogEditorFormData } from '../BlogEditorPage.schema';
import type { BlogPost } from '@/api/blogService';
import BlogRichTextEditor from './BlogRichTextEditor';
import BlogCoverImageUpload from './BlogCoverImageUpload';

interface BlogEditorFormProps {
  initialData?: BlogPost;
  onSubmit: (data: BlogEditorFormData, coverImage?: File) => void;
  isSubmitting: boolean;
  onCancel: () => void;
}

const BlogEditorForm: React.FC<BlogEditorFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting,
  onCancel,
}) => {
  const [coverImageFile, setCoverImageFile] = useState<File | undefined>();
  const [isCoverImageRemoved, setIsCoverImageRemoved] = useState(false);

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
    const shouldRemove = isCoverImageRemoved && !coverImageFile;
    onSubmit({ ...data, removeCoverImage: shouldRemove }, coverImageFile);
  };

  const handleImageRemove = () => {
    setIsCoverImageRemoved(true);
  };

  const handleFileSelect = (file: File | undefined) => {
    setCoverImageFile(file);
    if (file) setIsCoverImageRemoved(false);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col xl:flex-row gap-8">
      {/* Main Content Column */}
      <div className="flex-1 space-y-6 min-w-0">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
          <Input
            label="Title"
            required
            error={errors.title?.message}
            placeholder="Enter blog post title"
            {...register('title')}
            onChange={(e) => {
              register('title').onChange(e);
              handleTitleChange(e);
            }}
          />

          <FormField
            label="Content"
            required
            error={errors.content?.message}
          >
            <BlogRichTextEditor
              content={contentValue}
              onChange={handleContentChange}
              error={!!errors.content}
            />
          </FormField>

          <FormField
            label="Excerpt"
            required
            error={errors.excerpt?.message}
            htmlFor="blog-excerpt"
            helpText="Brief summary of the post for lists and SEO."
          >
            <textarea
              id="blog-excerpt"
              placeholder="Brief summary of the blog post"
              rows={3}
              className={`w-full px-4 py-2.5 rounded-lg border bg-white text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow text-sm resize-none ${errors.excerpt ? 'border-red-300' : 'border-gray-300'
                }`}
              {...register('excerpt')}
            />
          </FormField>
        </div>
      </div>

      {/* Sidebar Column */}

      <div className="w-full xl:w-96 space-y-6 shrink-0 xl:sticky xl:top-6 xl:self-start">
        {/* Cover Image Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-5">
          <h3 className="font-bold text-gray-900 text-lg">Cover Image</h3>
          <BlogCoverImageUpload
            currentImageUrl={isCoverImageRemoved ? undefined : initialData?.coverImage?.url}
            selectedFile={coverImageFile}
            onFileSelect={handleFileSelect}
            onRemove={handleImageRemove}
          />
        </div>

        {/* Settings Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-5">
          <h3 className="font-bold text-gray-900 text-lg">Settings</h3>

          <Input
            label="Slug"
            required
            error={errors.slug?.message}
            placeholder="blog-post-url-slug"
            helperText="URL-friendly version of the title."
            {...register('slug')}
          />

          <Input
            label="Tags"
            placeholder="sales, tips, update"
            helperText="Comma separated values."
            {...register('tags')}
          />
        </div>

        {/* Publish Action Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-5">
          <h3 className="font-bold text-gray-900 text-lg">Publishing</h3>

          <FormField label="Status" className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <label className={`
                flex flex-col items-center justify-center gap-2 cursor-pointer p-4 rounded-xl border-2 transition-all
                ${statusValue === 'draft'
                  ? 'bg-yellow-50 border-yellow-400 text-yellow-800'
                  : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50 text-gray-500'}
              `}>
                <input
                  type="radio"
                  value="draft"
                  checked={statusValue === 'draft'}
                  onChange={() => setValue('status', 'draft')}
                  className="hidden"
                />
                <span className={`w-3 h-3 rounded-full ${statusValue === 'draft' ? 'bg-yellow-500' : 'bg-gray-300'}`} />
                <span className="font-semibold text-sm">Draft</span>
              </label>

              <label className={`
                flex flex-col items-center justify-center gap-2 cursor-pointer p-4 rounded-xl border-2 transition-all
                ${statusValue === 'published'
                  ? 'bg-green-50 border-green-500 text-green-800'
                  : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50 text-gray-500'}
              `}>
                <input
                  type="radio"
                  value="published"
                  checked={statusValue === 'published'}
                  onChange={() => setValue('status', 'published')}
                  className="hidden"
                />
                <span className={`w-3 h-3 rounded-full ${statusValue === 'published' ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span className="font-semibold text-sm">Published</span>
              </label>
            </div>
          </FormField>

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              type="button"
              onClick={onCancel}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="secondary"
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? 'Saving...' : 'Save Post'}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default BlogEditorForm;
