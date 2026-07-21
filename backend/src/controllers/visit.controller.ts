import { Request, Response, NextFunction } from 'express';
import { VisitService } from '../services/visit.service';
import { z, ZodError } from 'zod';

const visitService = new VisitService();

const trackVisitSchema = z.object({
  page: z.string().optional(),
});

// Helper function to extract session ID from various headers
const getSessionId = (req: Request): string | undefined => {
  const sessionId = 
    req.headers['x-session-id'] as string ||
    req.headers['authorization']?.replace('Bearer ', '') ||
    req.headers['x-visitor-id'] as string ||
    req.headers['x-client-id'] as string ||
    req.headers['session-id'] as string ||
    req.cookies?.sessionId ||
    req.body.sessionId;

  return sessionId;
};

// Helper function for Zod errors
const handleZodError = (err: ZodError) => {
  return err.issues.map((issue) => ({
    path: issue.path.join('.'),
    message: issue.message,
  }));
};


export const trackVisit = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sessionId = getSessionId(req);

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: 'Session ID is required. Please provide it in headers (X-Session-ID, Authorization, Cookie) or body.',
      });
    }

    const validated = trackVisitSchema.parse(req.body);

    const visit = await visitService.trackVisit({
      sessionId,
      ipAddress: req.ip || req.socket.remoteAddress,
      userAgent: req.headers['user-agent'],
      page: validated.page || '/home',
      referer: req.headers['referer'],
    });

    res.json({
      success: true,
      data: visit,
      message: 'Visit tracked successfully',
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

export const getStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await visitService.getStats();
    res.json({
      success: true,
      data: {
        daily: stats?.daily || 0,
        weekly: stats?.weekly || 0,
        monthly: stats?.monthly || 0,
        yearly: stats?.yearly || 0,
        total: stats?.total || 0,
        lastUpdated: stats?.updatedAt || new Date(),
      },
    });
  } catch (err) {
    next(err);
  }
};