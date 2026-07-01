// src/controllers/link.controller.ts
import { Request, Response, NextFunction } from 'express';
import { LinkService } from '../services/link.service';
import { z, ZodError } from 'zod';

const linkService = new LinkService();

// Validation Schemas
const linkSchema = z.object({
  name: z.string().min(1),
  url: z.string().url(),
  desc: z.string().optional().default(''),
  iconName: z.string().min(1),
  categoryId: z.number(),
  status: z.enum(['online', 'degraded']).default('online'),
  permit: z.enum(['internal', 'external']).default('external'),
});

const updateLinkSchema = linkSchema.partial();

// Helper function for Zod errors
const handleZodError = (err: ZodError) => {
  return err.issues.map((issue) => ({
    path: issue.path.join('.'),
    message: issue.message,
  }));
};

// ============= GET ALL LINKS =============
export const getLinks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { categoryId, permit, search } = req.query;
    const links = await linkService.findAll({
      categoryId: categoryId ? Number(categoryId) : undefined,
      permit: permit as any,
      search: search as string,
    });
    res.json({ success: true, data: links });
  } catch (err) { next(err); }
};

// ============= GET LINKS BY CATEGORY SLUG =============
export const getLinksByCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;
    // ✅ Ensure slug is a string
    const links = await linkService.findAllByCategorySlug(String(slug));
    res.json({ success: true, data: links });
  } catch (err: any) {
    if (err.message === 'Category not found') {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }
    next(err);
  }
};

// ============= GET LINK BY SLUG =============
export const getLinkBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;
    // ✅ Ensure slug is a string
    const link = await linkService.findBySlug(String(slug));
    res.json({ success: true, data: link });
  } catch (err: any) {
    if (err.message === 'Link not found') {
      return res.status(404).json({
        success: false,
        message: 'Link not found',
      });
    }
    next(err);
  }
};

// ============= GET LINKS BY PERMIT =============
export const getLinksByPermit = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { permit } = req.params;
    // ✅ Ensure permit is a string
    const permitValue = String(permit);
    if (!['internal', 'external'].includes(permitValue)) {
      return res.status(400).json({
        success: false,
        message: 'Permit must be "internal" or "external"',
      });
    }
    const links = await linkService.findAllByPermit(permitValue as any);
    res.json({ success: true, data: links });
  } catch (err) { next(err); }
};

// ============= GET INTERNAL LINKS =============
export const getInternalLinks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const links = await linkService.findAllInternal();
    res.json({ success: true, data: links });
  } catch (err) { next(err); }
};

// ============= GET EXTERNAL LINKS =============
export const getExternalLinks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const links = await linkService.findAllExternal();
    res.json({ success: true, data: links });
  } catch (err) { next(err); }
};

// ============= CREATE LINK =============
export const createLink = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validated = linkSchema.parse(req.body);
    const link = await linkService.create(validated);
    res.status(201).json({ success: true, data: link });
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: handleZodError(err),
      });
    }
    if (err instanceof Error && err.message.includes('not found')) {
      return res.status(404).json({ success: false, message: err.message });
    }
    next(err);
  }
};

// ============= UPDATE LINK BY ID =============
export const updateLink = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const validated = updateLinkSchema.parse(req.body);
    const link = await linkService.update(Number(id), validated);
    res.json({ success: true, data: link });
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: handleZodError(err),
      });
    }
    if (err instanceof Error && err.message === 'Link not found') {
      return res.status(404).json({
        success: false,
        message: 'Link not found',
      });
    }
    next(err);
  }
};

// ============= UPDATE LINK BY SLUG =============
export const updateLinkBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;
    // ✅ Ensure slug is a string
    const validated = updateLinkSchema.parse(req.body);
    const link = await linkService.updateBySlug(String(slug), validated);
    res.json({ success: true, data: link });
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: handleZodError(err),
      });
    }
    if (err instanceof Error && err.message === 'Link not found') {
      return res.status(404).json({
        success: false,
        message: 'Link not found',
      });
    }
    next(err);
  }
};

// ============= DELETE LINK BY ID =============
export const deleteLink = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await linkService.delete(Number(id));
    res.json({ success: true, message: 'Link deleted successfully' });
  } catch (err: any) {
    if (err.message === 'Link not found') {
      return res.status(404).json({
        success: false,
        message: 'Link not found',
      });
    }
    next(err);
  }
};

// ============= DELETE LINK BY SLUG =============
export const deleteLinkBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;
    // ✅ Ensure slug is a string
    await linkService.deleteBySlug(String(slug));
    res.json({ success: true, message: 'Link deleted successfully' });
  } catch (err: any) {
    if (err.message === 'Link not found') {
      return res.status(404).json({
        success: false,
        message: 'Link not found',
      });
    }
    next(err);
  }
};