// src/routes/icon.routes.ts
import { Router } from 'express';
import {
  getIcons,
  getIconById,
  getIconByName,
  createIcon,
  createManyIcons,
  updateIcon,
  deleteIcon,
  deleteIconByName,
  seedDefaultIcons,
} from '../controllers/icon.controller';

const router = Router();

// GET routes
router.get('/', getIcons);
router.get('/name/:name', getIconByName);
router.get('/:id', getIconById);

// POST routes
router.post('/', createIcon);
router.post('/many', createManyIcons);
router.post('/seed', seedDefaultIcons);

// PUT routes
router.put('/:id', updateIcon);

// DELETE routes
router.delete('/:id', deleteIcon);
router.delete('/name/:name', deleteIconByName);

export default router;