// src/controllers/icon.controller.ts
import { Request, Response, NextFunction } from 'express';
import { IconService } from '../services/icon.service';
import { z, ZodError } from 'zod';

const iconService = new IconService();

const iconSchema = z.object({
  name: z.string().min(1),
  label: z.string().optional(),
});

const updateIconSchema = iconSchema.partial();

const handleZodError = (err: ZodError) => {
  return err.issues.map((issue) => ({
    path: issue.path.join('.'),
    message: issue.message,
  }));
};

export const getIcons = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const icons = await iconService.findAll();
    res.json({ success: true, data: icons });
  } catch (err) { next(err); }
};

export const getIconById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const icon = await iconService.findById(Number(id));
    res.json({ success: true, data: icon });
  } catch (err: any) {
    if (err.message === 'Icon not found') {
      return res.status(404).json({ success: false, message: err.message });
    }
    next(err);
  }
};

export const getIconByName = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name } = req.params;
    // ✅ Ensure name is a string
    const icon = await iconService.findByName(String(name));
    res.json({ success: true, data: icon });
  } catch (err: any) {
    if (err.message === 'Icon not found') {
      return res.status(404).json({ success: false, message: err.message });
    }
    next(err);
  }
};

export const createIcon = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validated = iconSchema.parse(req.body);
    const icon = await iconService.create(validated);
    res.status(201).json({ success: true, data: icon });
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: handleZodError(err),
      });
    }
    if (err instanceof Error && err.message.includes('already exists')) {
      return res.status(400).json({ success: false, message: err.message });
    }
    next(err);
  }
};

export const createManyIcons = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validated = z.array(iconSchema).parse(req.body);
    const result = await iconService.createMany(validated);
    res.status(201).json({
      success: true,
      message: `Created ${result.count} icons`,
      data: result,
    });
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: handleZodError(err),
      });
    }
    next(err);
  }
};

export const updateIcon = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const validated = updateIconSchema.parse(req.body);
    const icon = await iconService.update(Number(id), validated);
    res.json({ success: true, data: icon });
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: handleZodError(err),
      });
    }
    if (err instanceof Error && err.message === 'Icon not found') {
      return res.status(404).json({ success: false, message: err.message });
    }
    if (err instanceof Error && err.message.includes('already exists')) {
      return res.status(400).json({ success: false, message: err.message });
    }
    next(err);
  }
};

export const deleteIcon = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await iconService.delete(Number(id));
    res.json({ success: true, message: 'Icon deleted successfully' });
  } catch (err: any) {
    if (err.message === 'Icon not found') {
      return res.status(404).json({ success: false, message: err.message });
    }
    next(err);
  }
};

export const deleteIconByName = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name } = req.params;
    // ✅ Ensure name is a string
    await iconService.deleteByName(String(name));
    res.json({ success: true, message: 'Icon deleted successfully' });
  } catch (err: any) {
    if (err.message === 'Icon not found') {
      return res.status(404).json({ success: false, message: err.message });
    }
    next(err);
  }
};

export const seedDefaultIcons = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await iconService.seedDefaultIcons();
    res.json({
      success: true,
      message: `Seeded ${result.count} default icons`,
      data: result,
    });
  } catch (err) { next(err); }
};