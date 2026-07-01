// src/routes/category.routes.ts
import { Router } from 'express';
import {
  getCategories,
  getCategoryById,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  updateCategoryBySlug,
  deleteCategory,
  deleteCategoryBySlug,
  getLinksByCategory,
} from '../controllers/category.controller';

const router = Router();

// GET routes
router.get('/', getCategories);
router.get('/slug/:slug', getCategoryBySlug);
router.get('/:id', getCategoryById);
router.get('/:slug/links', getLinksByCategory);

// POST routes
router.post('/', createCategory);

// PUT routes
router.put('/:id', updateCategory);
router.put('/slug/:slug', updateCategoryBySlug);

// DELETE routes
router.delete('/:id', deleteCategory);
router.delete('/slug/:slug', deleteCategoryBySlug);

export default router;