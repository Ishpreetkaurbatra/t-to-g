import cors from 'cors';
import { config } from '../config.ts';

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    // Allow non-browser requests or any origin if wildcard
    if (!origin || config.CORS_ORIGIN === '*') {
      return callback(null, true);
    }
    if (Array.isArray(config.CORS_ORIGIN)) {
      if (config.CORS_ORIGIN.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
    if (config.CORS_ORIGIN === origin) {
      return callback(null, true);
    }
    return callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
  ],
  exposedHeaders: ['X-Request-Id', 'X-Response-Time'],
  maxAge: 86400,
});
