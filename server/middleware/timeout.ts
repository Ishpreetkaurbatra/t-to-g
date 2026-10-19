import type { Request, Response, NextFunction } from 'express';
import { config } from '../config.ts';

export function requestTimeout(timeoutMs: number = config.REQUEST_TIMEOUT_MS) {
  return (req: Request, res: Response, next: NextFunction) => {
    let timedOut = false;

    const timer = setTimeout(() => {
      timedOut = true;
      if (!res.headersSent) {
        res.status(504).json({
          success: false,
          error: 'Gateway Timeout: Request processing exceeded time limit',
          code: 'REQUEST_TIMEOUT',
          details: { timeoutMs },
        });
      }
    }, timeoutMs);

    // Clear timeout when response finishes
    res.on('finish', () => clearTimeout(timer));
    res.on('close', () => clearTimeout(timer));

    // Intercept next to ensure timed-out requests do not proceed further
    const originalNext = next;
    const guardedNext: NextFunction = ((err?: any) => {
      if (timedOut) return;
      originalNext(err);
    }) as NextFunction;

    guardedNext();
  };
}
