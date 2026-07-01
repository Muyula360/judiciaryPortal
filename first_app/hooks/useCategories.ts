import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Category, Link } from '@/types';

// Fetch all categories with their links
export const useCategories = () => {
  return useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await api.get('/categories');
      return res.data.data;
    },
  });
};

// Create a new category
export const useCreateCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Omit<Category, 'id' | 'createdAt' | 'updatedAt' | 'links'>) => {
      const res = await api.post('/categories', data);
      return res.data.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }),
  });
};

// Update a category
export const useUpdateCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ slug, data }: { slug: string; data: Partial<Category> }) => {
      const res = await api.put(`/categories/${slug}`, data);
      return res.data.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }),
  });
};

// Delete a category
export const useDeleteCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (slug: string) => {
      const res = await api.delete(`/categories/${slug}`);
      return res.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }),
  });
};

// Create a new link
export const useCreateLink = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Omit<Link, 'id' | 'createdAt' | 'updatedAt' | 'category'>) => {
      const res = await api.post('/links', data);
      return res.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['links'] });
      qc.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

// Update a link
export const useUpdateLink = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ slug, data }: { slug: string; data: Partial<Link> }) => {
      const res = await api.put(`/links/${slug}`, data);
      return res.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['links'] });
      qc.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

// Delete a link
export const useDeleteLink = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (slug: string) => {
      const res = await api.delete(`/links/${slug}`);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['links'] });
      qc.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};