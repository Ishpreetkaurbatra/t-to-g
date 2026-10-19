import type { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

export interface LoggingOptions {
  silent?: boolean;
}

export function requestLogger(options: LoggingOptions = {}) {
  return (req: Request, res: Response, next: NextFunction) => {
    const requestId = (req.headers['x-request-id'] as string) || crypto.randomUUID();
    req.headers['x-request-id'] = requestId;
    res.setHeader('X-Request-Id', requestId);

    const startTime = process.hrtime();

    const originalWriteHead = res.writeHead;
    res.writeHead = function (...args: any[]) {
      const diff = process.hrtime(startTime);
      const durationMs = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(2);
      if (!res.headersSent) {
        res.setHeader('X-Response-Time', `${durationMs}ms`);
      }
      return (originalWriteHead as any).apply(this, args);
    };

    res.on('finish', () => {
      const diff = process.hrtime(startTime);
      const durationMs = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(2);

      if (options.silent || process.env.NODE_ENV === 'test') {
        return;
      }

      const status = res.statusCode;
      const statusColor =
        status >= 500 ? '\x1b[31m' : status >= 400 ? '\x1b[33m' : status >= 300 ? '\x1b[36m' : '\x1b[32m';
      const resetColor = '\x1b[0m';

      console.log(
        `[${new Date().toISOString()}] [${requestId.slice(0, 8)}] ${req.method} ${req.originalUrl || req.url} ${statusColor}${status}${resetColor} - ${durationMs}ms`
      );
    });

    next();
  };
}
