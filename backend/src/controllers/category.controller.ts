// src/controllers/category.controller.ts
import { Request, Response, NextFunction } from 'express';
import { CategoryService } from '../services/category.service';
import { z } from 'zod';

const categoryService = new CategoryService();

const categorySchema = z.object({
  name: z.string().min(1),
  iconName: z.string().min(1),
  colorHex: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Must be a valid hex color'),
});

const updateCategorySchema = categorySchema.partial();

export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await categoryService.findAll();
    res.json({ success: true, data: categories });
  } catch (err) { next(err); }
};

export const getCategoryById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const category = await categoryService.findById(Number(id));
    res.json({ success: true, data: category });
  } catch (err: any) {
    if (err.message === 'Category not found') {
      return res.status(404).json({ success: false, message: err.message });
    }
    next(err);
  }
};

export const getCategoryBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;
    const category = await categoryService.findBySlug(String(slug));
    res.json({ success: true, data: category });
  } catch (err: any) {
    if (err.message === 'Category not found') {
      return res.status(404).json({ success: false, message: err.message });
    }
    next(err);
  }
};

export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validated = categorySchema.parse(req.body);
    const category = await categoryService.create(validated);
    res.status(201).json({ success: true, data: category });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: err.issues.map(e => ({
          path: e.path.join('.'),
          message: e.message,
        })),
      });
    }
    if (err instanceof Error && err.message.includes('not found')) {
      return res.status(404).json({ success: false, message: err.message });
    }
    next(err);
  }
};

export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const validated = updateCategorySchema.parse(req.body);
    const category = await categoryService.update(Number(id), validated);
    res.json({ success: true, data: category });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: err.issues.map(e => ({
          path: e.path.join('.'),
          message: e.message,
        })),
      });
    }
    if (err instanceof Error && err.message === 'Category not found') {
      return res.status(404).json({ success: false, message: err.message });
    }
    next(err);
  }
};

export const updateCategoryBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;
    const validated = updateCategorySchema.parse(req.body);
    const category = await categoryService.updateBySlug(String(slug), validated);
    res.json({ success: true, data: category });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: err.issues.map(e => ({
          path: e.path.join('.'),
          message: e.message,
        })),
      });
    }
    if (err instanceof Error && err.message === 'Category not found') {
      return res.status(404).json({ success: false, message: err.message });
    }
    next(err);
  }
};

export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await categoryService.delete(Number(id));
    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (err: any) {
    if (err.message === 'Category not found') {
      return res.status(404).json({ success: false, message: err.message });
    }
    next(err);
  }
};

export const deleteCategoryBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;
    await categoryService.deleteBySlug(String(slug));
    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (err: any) {
    if (err.message === 'Category not found') {
      return res.status(404).json({ success: false, message: err.message });
    }
    next(err);
  }
};

export const getLinksByCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;
    const links = await categoryService.getLinksByCategorySlug(String(slug));
    res.json({ success: true, data: links });
  } catch (err: any) {
    if (err.message === 'Category not found') {
      return res.status(404).json({ success: false, message: err.message });
    }
    next(err);
  }
};