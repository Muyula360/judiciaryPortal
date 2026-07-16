// src/controllers/caseDetail.controller.ts
import { Request, Response, NextFunction } from 'express';
import { CaseDetailService } from '../services/caseDetail.service';
import { z, ZodError } from 'zod';

const caseDetailService = new CaseDetailService();

export const getCases = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { 
      search, 
      court, 
      caseStatus, 
      courtLevel, 
      fromDate, 
      toDate, 
      limit, 
      page 
    } = req.query;

    const result = await caseDetailService.findAll({
      search: search as string,
      court: court as string,
      caseStatus: caseStatus as string,
      courtLevel: courtLevel as string,
      fromDate: fromDate as string,
      toDate: toDate as string,
      limit: limit ? Number(limit) : 10,
      page: page ? Number(page) : 1,
      excludeDecided: true, // Exclude cases with status "Decided"
    });

    res.set({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    });
    
    res.json({
      success: true,
      ...result,
    });
  } catch (err) { 
    next(err); 
  }
};

export const getCasesByCourtAndDateRange = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { court, fromDate, toDate } = req.query;

    if (!court) {
      return res.status(400).json({
        success: false,
        message: 'Court name is required',
      });
    }
    if (!fromDate || !toDate) {
      return res.status(400).json({
        success: false,
        message: 'Both from Date and to Date are required',
      });
    }

    const fromDateObj = new Date(fromDate as string);
    const toDateObj = new Date(toDate as string);

    if (isNaN(fromDateObj.getTime()) || isNaN(toDateObj.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format. Use YYYY-MM-DD',
      });
    }

    if (fromDateObj > toDateObj) {
      return res.status(400).json({
        success: false,
        message: 'fromDate must be before or equal to toDate',
      });
    }

    const cases = await caseDetailService.findByCourtAndDateRange(
      court as string,
      fromDate as string,
      toDate as string,
      true // Exclude decided cases
    );

    res.set({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    });

    res.json({
      success: true,
      data: cases,
      count: cases.length,
      filters: {
        court: court as string,
        fromDate: fromDate as string,
        toDate: toDate as string,
      },
    });
  } catch (err) { 
    next(err); 
  }
};

export const getCourtsList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const courts = await caseDetailService.getDistinctCourts();
    res.json({
      success: true,
      data: courts,
    });
  } catch (err) { 
    next(err); 
  }
};