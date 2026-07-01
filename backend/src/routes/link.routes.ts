// src/routes/link.routes.ts
import { Router } from 'express';
import {
  getLinks,
  getLinksByCategory,
  getLinkBySlug,
  getLinksByPermit,
  getInternalLinks,
  getExternalLinks,
  createLink,
  updateLink,
  updateLinkBySlug,
  deleteLink,
  deleteLinkBySlug,
} from '../controllers/link.controller';

const router = Router();

// GET routes
router.get('/', getLinks);
router.get('/category/:slug', getLinksByCategory);
router.get('/slug/:slug', getLinkBySlug);
router.get('/permit/:permit', getLinksByPermit);
router.get('/internal', getInternalLinks);
router.get('/external', getExternalLinks);

// POST routes
router.post('/', createLink);

// PUT routes
router.put('/:id', updateLink);
router.put('/slug/:slug', updateLinkBySlug);

// DELETE routes
router.delete('/:id', deleteLink);
router.delete('/slug/:slug', deleteLinkBySlug);

export default router;