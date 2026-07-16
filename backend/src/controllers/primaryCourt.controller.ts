// src/controllers/primaryCourt.controller.ts
import { Request, Response, NextFunction } from 'express';
import { PrimaryCourtService } from '../services/primaryCourt.service';

const primaryCourtService = new PrimaryCourtService();

// ============= GET ALL CASES =============
export const getPrimaryCourtCases = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { 
      search, 
      mahakama, 
      status, 
      ainaYaShauri, 
      kanda, 
      wilaya,
      fromDate, 
      toDate, 
      limit, 
      page 
    } = req.query;

    const result = await primaryCourtService.findAll({
      search: search as string,
      mahakama: mahakama as string,
      status: status as string,
      ainaYaShauri: ainaYaShauri as string,
      kanda: kanda as string,
      wilaya: wilaya as string,
      fromDate: fromDate as string,
      toDate: toDate as string,
      limit: limit ? Number(limit) : 10,
      page: page ? Number(page) : 1,
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

// ============= GET CASE BY ID =============
export const getPrimaryCourtCaseById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const courtCase = await primaryCourtService.findById(Number(id));
    res.json({ success: true, data: courtCase });
  } catch (err: any) {
    if (err.message === 'Case not found') {
      return res.status(404).json({
        success: false,
        message: 'Case not found',
      });
    }
    next(err);
  }
};

// ============= GET CASE BY REFERENCE =============
export const getPrimaryCourtCaseByReference = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { reference } = req.params;
    const courtCase = await primaryCourtService.findByReference(String(reference));
    res.json({ success: true, data: courtCase });
  } catch (err: any) {
    if (err.message === 'Case not found') {
      return res.status(404).json({
        success: false,
        message: 'Case not found',
      });
    }
    next(err);
  }
};

// ============= GET CASE BY CASE NUMBER =============
export const getPrimaryCourtCaseByNumber = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { number } = req.params;
    const courtCase = await primaryCourtService.findByCaseNumber(String(number));
    res.json({ success: true, data: courtCase });
  } catch (err: any) {
    if (err.message === 'Case not found') {
      return res.status(404).json({
        success: false,
        message: 'Case not found',
      });
    }
    next(err);
  }
};

// ============= GET CASES BY COURT =============
export const getPrimaryCourtCasesByCourt = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { court } = req.params;
    const cases = await primaryCourtService.findByCourt(String(court));
    res.json({ success: true, data: cases });
  } catch (err) { next(err); }
};

// ============= GET CASES BY JUDGE =============
export const getPrimaryCourtCasesByJudge = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { judge } = req.params;
    const cases = await primaryCourtService.findByJudge(String(judge));
    res.json({ success: true, data: cases });
  } catch (err) { next(err); }
};

// ============= GET DISTINCT COURTS =============
export const getPrimaryCourtDistinctCourts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const courts = await primaryCourtService.getDistinctCourts();
    res.json({
      success: true,
      data: courts,
    });
  } catch (err) { 
    next(err); 
  }
};

// ============= GET STATISTICS =============
export const getPrimaryCourtStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await primaryCourtService.getStats();
    res.json({
      success: true,
      data: stats,
    });
  } catch (err) { 
    next(err); 
  }
};

// ============= GET CASES BY DATE RANGE =============
export const getPrimaryCourtCasesByDateRange = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { fromDate, toDate } = req.params;
    // ✅ Ensure both are strings using String()
    const cases = await primaryCourtService.getByDateRange(String(fromDate), String(toDate));
    res.json({ success: true, data: cases });
  } catch (err) { next(err); }
};

// ============= GET CASES BY STATUS =============
export const getPrimaryCourtCasesByStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status } = req.params;
    // ✅ Ensure status is a string using String()
    const cases = await primaryCourtService.getByStatus(String(status));
    res.json({ success: true, data: cases });
  } catch (err) { next(err); }
};

// ============= GET BACKLOG CASES =============
export const getPrimaryCourtBacklogCases = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cases = await primaryCourtService.getBacklogCases();
    res.json({ success: true, data: cases });
  } catch (err) { next(err); }
};