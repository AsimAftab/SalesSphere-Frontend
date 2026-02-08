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
}

// --- 2. Backend API Interface (Raw Shape) ---

interface ApiBlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: BlogCoverImage;
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
      coverImage: apiBlog.coverImage,
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

  static toFormData(data: CreateBlogFormData | UpdateBlogFormData): FormData {
    const formData = new FormData();
    if (data.title) formData.append('title', data.title);
    if (data.slug) formData.append('slug', data.slug);
    if (data.excerpt) formData.append('excerpt', data.excerpt);
    if (data.content) formData.append('content', data.content);
    if (data.status) formData.append('status', data.status);
    if (data.tags) formData.append('tags', JSON.stringify(data.tags));
    if (data.coverImage) formData.append('coverImage', data.coverImage);
    return formData;
  }
}

// --- 4. Repository ---

class BlogRepositoryClass {
  async getPublishedPosts(): Promise<BlogPost[]> {
    try {
      const response = await api.get(API_ENDPOINTS.blogs.BASE);
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
      const response = await api.get(API_ENDPOINTS.blogs.ADMIN);
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
      const response = await api.get(API_ENDPOINTS.blogs.DETAIL(id));
      const item = response.data.data || response.data;
      return BlogMapper.toFrontend(item);
    } catch (error: unknown) {
      throw handleApiError(error, 'Failed to fetch blog post');
    }
  }

  async createPost(data: CreateBlogFormData): Promise<BlogPost> {
    try {
      const formData = BlogMapper.toFormData(data);
      const response = await api.post(API_ENDPOINTS.blogs.BASE, formData);
      const item = response.data.data || response.data;
      return BlogMapper.toFrontend(item);
    } catch (error: unknown) {
      throw handleApiError(error, 'Failed to create blog post');
    }
  }

  async updatePost(id: string, data: UpdateBlogFormData): Promise<BlogPost> {
    try {
      const formData = BlogMapper.toFormData(data);
      const response = await api.put(API_ENDPOINTS.blogs.DETAIL(id), formData);
      const item = response.data.data || response.data;
      return BlogMapper.toFrontend(item);
    } catch (error: unknown) {
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
