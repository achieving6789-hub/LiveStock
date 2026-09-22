import express, { type Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/auth.routes.js';
import canaryRoutes from './routes/canary.routes.js';
import healthRoutes from './routes/health.routes.js';
import { errorHandler } from './middleware/errorHandler.js';

export const createApp = (): Express => {
  const app = express();

  // Security & Utility Middlewares
  app.use(helmet());
  app.use(
    cors({
      origin: '*', // Allow frontend development origin
      credentials: true,
    })
  );
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Root Healthcheck
  app.get('/health', (_req, res) => {
    res.json({
      status: 'UP',
      service: 'Livestock Surveillance Backend API',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    });
  });

  // Mount API Modules
  app.use('/api/auth', authRoutes);
  app.use('/api/canary', canaryRoutes);
  app.use('/api', healthRoutes);

  // Catch-all 404 for unhandled API routes
  app.use('*', (req, res) => {
    res.status(404).json({
      success: false,
      message: `API route ${req.method} ${req.originalUrl} not found`,
      code: 'NOT_FOUND',
    });
  });

  // Centralized Error Handling Middleware
  app.use(errorHandler);

  return app;
};
