// src/routes/visit.routes.ts
import { Router } from 'express';
import { trackVisit, getStats } from '../controllers/visit.controller';

const router = Router();

router.post('/track', trackVisit);
router.get('/stats', getStats);

export default router;