import express from 'express';
import cors from 'cors';
import { config } from './config/env.js';
import { log } from './shared/logger.js';
import healthRoutes from './features/health/health.routes.js';

function createApp() {
  const app = express();

  app.use(cors({ origin: config.corsOrigin }));

  app.use(express.json({ limit: '1mb' }));

  app.use('/api/health', healthRoutes);

  app.use('/api', (req, res) => {
    res.status(404).json({ error: `Unknown endpoint: ${req.method} ${req.originalUrl}` });
  });

  app.use((error, req, res, next) => {
    log.error('http', `unhandled error on ${req.method} ${req.originalUrl}:`, error);
    if (res.headersSent) return next(error);
    res.status(500).json({ error: config.isProduction ? 'Internal server error' : error.message });
  });

  return app;
}

export { createApp };
