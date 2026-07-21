import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      errors: err.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      })),
    });
  }

  if (err.code && err.code === 'P2025') {
    return res.status(404).json({ success: false, message: err.message || 'Record not found' });
  }

  console.error(err);
  res.status(500).json({ success: false, message: err.message || 'Internal Server Error' });
};