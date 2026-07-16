import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { prisma } from './config/database';
import authRoutes from './routes/auth.routes';
import categoryRoutes from './routes/category.routes';
import linkRoutes from './routes/link.routes';
import iconRoutes from './routes/icon.routes';
import { errorHandler } from './middlewares/errorHandler';
import caseDetailRoutes from './routes/caseDetail.routes';
import primaryCourtRoutes from './routes/primaryCourt.routes';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/links', linkRoutes);
app.use('/api/icons', iconRoutes);
app.use('/api/cases', caseDetailRoutes);
app.use('/api/primary-courts', primaryCourtRoutes);

// Health check (also tests DB connectivity)
app.get('/api/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'OK', database: 'connected' });
  } catch {
    res.status(503).json({ status: 'ERROR', database: 'disconnected' });
  }
});

// Error handling
app.use(errorHandler);

export default app;