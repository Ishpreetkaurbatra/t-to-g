import express from 'express';
import path from 'path';
import fs from 'fs';
import { corsMiddleware } from './middleware/cors.ts';
import { requestLogger } from './middleware/logging.ts';
import { requestTimeout } from './middleware/timeout.ts';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.ts';
import { apiRouter } from './apiRouter.ts';
import { config } from './config.ts';

export function createApp() {
  const app = express();

  // 1. Trust proxy in production
  app.set('trust proxy', 1);

  // 2. Global CORS Middleware
  app.use(corsMiddleware);

  // 3. Safe Request Logger
  app.use(requestLogger());

  // 4. Request Timeout Enforcement
  app.use(requestTimeout(config.REQUEST_TIMEOUT_MS));

  // 5. Body Parsers with limits
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));

  // 6. API Routes
  app.use('/api', apiRouter);

  // 7. Production Static Asset Serving (if Vite build dist exists)
  const distPath = path.resolve(process.cwd(), 'dist');
  if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api')) {
        return next();
      }
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // 8. 404 Not Found Handler (for API or unhandled routes)
  app.use(notFoundHandler);

  // 9. Centralized Error Handler
  app.use(errorHandler);

  return app;
}

export const app = createApp();
export default app;
