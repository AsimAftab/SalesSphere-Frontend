import { z } from 'zod';

export const blogEditorSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(200, 'Slug too long')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase with hyphens only'),
  excerpt: z.string().min(1, 'Excerpt is required').max(500, 'Excerpt too long'),
  content: z.string().min(1, 'Content is required'),
  tags: z.string().optional(),
  status: z.enum(['draft', 'published']),
});

export type BlogEditorFormData = z.infer<typeof blogEditorSchema>;

export const DEFAULT_FORM_VALUES: BlogEditorFormData = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  tags: '',
  status: 'draft',
};
