import { z } from 'zod';

export const createLinkSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().optional(),  
  url: z.string().url('Must be a valid URL'),
  desc: z.string().optional().default(''),
  icon: z.string().min(1, 'Icon is required'),
  status: z.enum(['online', 'offline', 'maintenance']).default('online'),
  categoryId: z.number().int().positive('Category ID must be a positive integer'),
  permit: z.enum(['internal', 'external']).default('external'),
});

export const updateLinkSchema = z.object({
  name: z.string().min(1).optional(),
  url: z.string().url().optional(),
  desc: z.string().optional(),
  icon: z.string().optional(),
  status: z.enum(['online', 'offline', 'maintenance']).optional(),
  categoryId: z.number().int().positive().optional(),
  permit: z.enum(['internal', 'external']).default('external'),
});

export const createCategorySchema = z.object({
  slug: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  icon: z.string().min(1, 'Icon is required'),
  colorHex: z.string()
    .regex(/^#([0-9a-f]{3}){1,2}$/i, 'Must be a valid hex color (e.g., #ea580c)')
    .default('#ea580c'),
});

export const updateCategorySchema = z.object({
  name: z.string().min(1).optional(),
  icon: z.string().optional(),
  colorHex: z.string().regex(/^#([0-9a-f]{3}){1,2}$/i).optional(),
});

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const loginSchema = registerSchema;