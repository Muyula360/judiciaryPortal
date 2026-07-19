
import { Request, Response, NextFunction } from 'express';
import { VisitService } from '../services/visit.service';

const visitService = new VisitService();

export const trackVisitMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Generate or get session ID
    let sessionId = req.cookies?.sessionId || req.headers['x-session-id'] as string;
    
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
      // Set cookie for future requests
      res.cookie('sessionId', sessionId, {
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });
    }

    // Track the visit
    await visitService.trackVisit({
      sessionId,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.headers['user-agent'],
      page: req.originalUrl,
      referer: req.headers['referer'],
    });

    next();
  } catch (error) {
    console.error('Error tracking visit:', error);
    next(); // Don't block the request
  }
};