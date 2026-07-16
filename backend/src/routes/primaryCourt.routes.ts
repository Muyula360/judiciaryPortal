// src/routes/primaryCourt.routes.ts
import { Router } from 'express';
import {
  getPrimaryCourtCases,
  getPrimaryCourtCaseById,
  getPrimaryCourtCaseByReference,
  getPrimaryCourtCaseByNumber,
  getPrimaryCourtCasesByCourt,
  getPrimaryCourtCasesByJudge,
  getPrimaryCourtDistinctCourts,
  getPrimaryCourtStats,
  getPrimaryCourtCasesByDateRange,
  getPrimaryCourtCasesByStatus,
  getPrimaryCourtBacklogCases,
} from '../controllers/primaryCourt.controller';

const router = Router();

// GET all cases with filters
router.get('/', getPrimaryCourtCases);

// GET distinct courts list
router.get('/courts', getPrimaryCourtDistinctCourts);

// GET statistics
router.get('/stats', getPrimaryCourtStats);

// GET backlog cases
router.get('/backlog', getPrimaryCourtBacklogCases);

// GET cases by court
router.get('/court/:court', getPrimaryCourtCasesByCourt);

// GET cases by judge
router.get('/judge/:judge', getPrimaryCourtCasesByJudge);

// GET cases by status
router.get('/status/:status', getPrimaryCourtCasesByStatus);

// GET cases by date range
router.get('/date-range/:fromDate/:toDate', getPrimaryCourtCasesByDateRange);

// GET case by reference
router.get('/reference/:reference', getPrimaryCourtCaseByReference);

// GET case by case number
router.get('/number/:number', getPrimaryCourtCaseByNumber);

// GET case by ID
router.get('/:id', getPrimaryCourtCaseById);

export default router;