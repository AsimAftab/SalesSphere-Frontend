import api from './api';
import { API_ENDPOINTS } from './endpoints';
import { handleApiError } from './errors';

// --- 1. Interfaces ---

export interface BlogCoverImage {
  url: string;
  public_id: string;
}

export interface BlogAuthor {
  name: string;
  profileImage?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: BlogCoverImage;
  tags: string[];
  status: 'draft' | 'published';
  author: BlogAuthor;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBlogFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  tags: string[];
  status: 'draft' | 'published';
  coverImage?: File;
}

export interface UpdateBlogFormData {
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  tags?: string[];
  status?: 'draft' | 'published';
  coverImage?: File;
  removeCoverImage?: boolean;
}

// --- 2. Backend API Interface (Raw Shape) ---

interface ApiBlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: BlogCoverImage; // Backend field name
  coverImage?: BlogCoverImage;    // Legacy/Frontend field name
  tags: string[];
  status: 'draft' | 'published';
  author: {
    _id?: string;
    name: string;
    profileImage?: string;
  } | string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// --- 3. Mapper ---

export class BlogMapper {
  static toFrontend(apiBlog: ApiBlogPost): BlogPost {
    return {
      id: apiBlog._id,
      title: apiBlog.title,
      slug: apiBlog.slug,
      excerpt: apiBlog.excerpt,
      content: apiBlog.content,
      // Map backend 'featuredImage' to frontend 'coverImage'
      coverImage: apiBlog.featuredImage || apiBlog.coverImage,
      tags: apiBlog.tags || [],
      status: apiBlog.status,
      author:
        typeof apiBlog.author === 'object'
          ? { name: apiBlog.author.name, profileImage: apiBlog.author.profileImage }
          : { name: apiBlog.author },
      publishedAt: apiBlog.publishedAt,
      createdAt: apiBlog.createdAt,
      updatedAt: apiBlog.updatedAt,
    };
  }
}

// --- 4. Repository ---

// --- 4. Repository ---

class BlogRepositoryClass {
  async getPublishedPosts(): Promise<BlogPost[]> {
    try {
      const response = await api.get(`${API_ENDPOINTS.blogs.BASE}?limit=1000`);
      const items = response.data.data || response.data;
      if (Array.isArray(items)) {
        return items.map(BlogMapper.toFrontend);
      }
      return [];
    } catch (error: unknown) {
      throw handleApiError(error, 'Failed to fetch blog posts');
    }
  }

  async getPostBySlug(slug: string): Promise<BlogPost> {
    try {
      const response = await api.get(API_ENDPOINTS.blogs.BY_SLUG(slug));
      const item = response.data.data || response.data;
      return BlogMapper.toFrontend(item);
    } catch (error: unknown) {
      throw handleApiError(error, 'Failed to fetch blog post');
    }
  }

  async getAdminPosts(): Promise<BlogPost[]> {
    try {
      const response = await api.get(`${API_ENDPOINTS.blogs.ADMIN}?limit=1000`);
      const items = response.data.data || response.data;
      if (Array.isArray(items)) {
        return items.map(BlogMapper.toFrontend);
      }
      return [];
    } catch (error: unknown) {
      throw handleApiError(error, 'Failed to fetch admin blog posts');
    }
  }

  async getPostById(id: string): Promise<BlogPost> {
    try {
      const response = await api.get(API_ENDPOINTS.blogs.ADMIN_DETAIL(id));
      const item = response.data.data || response.data;
      return BlogMapper.toFrontend(item);
    } catch (error: unknown) {
      throw handleApiError(error, 'Failed to fetch blog post');
    }
  }

  async uploadImage(id: string, file: File): Promise<void> {
    try {
      if (!id) {
        throw new Error('Blog ID is missing for image upload');
      }
      const formData = new FormData();
      formData.append('image', file);
      console.log(`[BlogService] Uploading image for blog ID: ${id}`);
      await api.post(API_ENDPOINTS.blogs.UPLOAD_IMAGE(id), formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch (error: unknown) {
      console.error('[BlogService] Image upload failed:', error);
      throw handleApiError(error, 'Failed to upload blog image');
    }
  }

  async createPost(data: CreateBlogFormData): Promise<BlogPost> {
    try {
      const { coverImage, ...blogData } = data;
      console.log('[BlogService] Creating post with data:', blogData);
      const response = await api.post(API_ENDPOINTS.blogs.BASE, blogData);

      // Handle potential response structures
      const responseData = response.data;
      const item = responseData.data || responseData;

      console.log('[BlogService] Create response item:', item);
      const blogId = item._id || item.id;

      if (!blogId) {
        console.error('[BlogService] Failed to extract blog ID from response:', item);
        throw new Error('Failed to retrieve blog ID after creation');
      }

      if (coverImage) {
        console.log('[BlogService] Uploading cover image...');
        await this.uploadImage(blogId, coverImage);
        // Refetch to get the updated image url
        const updatedPost = await this.getPostById(blogId);
        return updatedPost;
      }

      return BlogMapper.toFrontend(item);
    } catch (error: unknown) {
      console.error('[BlogService] Create post failed:', error);
      throw handleApiError(error, 'Failed to create blog post');
    }
  }

  async updatePost(id: string, data: UpdateBlogFormData & { removeCoverImage?: boolean }): Promise<BlogPost> {
    try {
      const { coverImage, removeCoverImage, ...blogData } = data;
      // Pass removeCoverImage flag in the request body
      const response = await api.put(API_ENDPOINTS.blogs.DETAIL(id), { ...blogData, removeCoverImage });
      const item = response.data.data || response.data;

      if (coverImage) {
        console.log('[BlogService] Uploading new cover image...');
        await this.uploadImage(id, coverImage);
        // Refetch to get the updated image url
        const updatedPost = await this.getPostById(id);
        return updatedPost;
      }

      return BlogMapper.toFrontend(item);
    } catch (error: unknown) {
      console.error('[BlogService] Update post failed:', error);
      throw handleApiError(error, 'Failed to update blog post');
    }
  }

  async deletePost(id: string): Promise<boolean> {
    try {
      const response = await api.delete(API_ENDPOINTS.blogs.DETAIL(id));
      return response.data?.success ?? true;
    } catch (error: unknown) {
      throw handleApiError(error, 'Failed to delete blog post');
    }
  }
}

// Singleton instance
const blogRepositoryInstance = new BlogRepositoryClass();

// --- 5. Public API ---

export const BlogRepository = {
  getPublishedPosts: () => blogRepositoryInstance.getPublishedPosts(),
  getPostBySlug: (slug: string) => blogRepositoryInstance.getPostBySlug(slug),
  getAdminPosts: () => blogRepositoryInstance.getAdminPosts(),
  getPostById: (id: string) => blogRepositoryInstance.getPostById(id),
  createPost: (data: CreateBlogFormData) => blogRepositoryInstance.createPost(data),
  updatePost: (id: string, data: UpdateBlogFormData) => blogRepositoryInstance.updatePost(id, data),
  deletePost: (id: string) => blogRepositoryInstance.deletePost(id),
};

export const {
  getPublishedPosts,
  getPostBySlug,
  getAdminPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} = BlogRepository;
