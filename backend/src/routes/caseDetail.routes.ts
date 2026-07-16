// src/routes/caseDetail.routes.ts
import { Router } from 'express';
import { 
  getCases, 
  getCourtsList, 
  getCasesByCourtAndDateRange  // ✅ Add this import
} from '../controllers/caseDetail.controller';

const router = Router();

// GET all cases with filters
router.get('/', getCases);

// GET cases by court and date range (dedicated for cause list)
router.get('/cause-list', getCasesByCourtAndDateRange);  // ✅ Add this endpoint

// GET distinct courts list
router.get('/courts', getCourtsList);

export default router;