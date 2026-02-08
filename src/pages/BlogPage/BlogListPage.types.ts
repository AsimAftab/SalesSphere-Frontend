export interface BlogPostCard {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage?: { url: string; public_id: string };
  tags: string[];
  status: 'draft' | 'published';
  author: { name: string; profileImage?: string };
  publishedAt?: string;
  createdAt: string;
}
