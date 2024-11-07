import api from './api';

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  publishedAt: string;
  readTime: number;
  slug: string;
  coverImage: string;
  categories: string[];
}

export interface Category {
  id: string;
  name: string;
  count: number;
}

export const blogService = {
  async getPosts(params?: { 
    search?: string;
    categories?: string[];
    page?: number;
    limit?: number;
  }) {
    const { data } = await api.get<BlogPost[]>('/api/posts', { params });
    return data;
  },

  async getPost(slug: string) {
    const { data } = await api.get<BlogPost>(`/api/posts/${slug}`);
    return data;
  },

  async getCategories() {
    const { data } = await api.get<Category[]>('/api/categories');
    return data;
  }
};