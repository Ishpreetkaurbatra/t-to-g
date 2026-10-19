import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: any;

  constructor(message: string, statusCode: number = 400, code: string = 'BAD_REQUEST', details?: any) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({
    success: false,
    error: `Endpoint not found: ${req.method} ${req.originalUrl || req.url}`,
    code: 'NOT_FOUND',
  });
}

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  // If headers were already sent (e.g. timeout fired), pass error along
  if (res.headersSent) {
    return;
  }

  // 1. Operational AppErrors
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: err.message,
      code: err.code,
      details: err.details,
    });
    return;
  }

  // 2. Zod Validation Errors
  if (err instanceof ZodError) {
    const issues = err.issues || [];
    const formattedErrors = issues.map((e: any) => ({
      field: e.path.join('.'),
      message: e.message,
      code: e.code,
    }));

    res.status(400).json({
      success: false,
      error: 'Validation failed: Invalid request parameters',
      code: 'VALIDATION_ERROR',
      details: formattedErrors,
    });
    return;
  }

  // 3. Malformed JSON Body
  if (err instanceof SyntaxError && 'status' in err && (err as any).status === 400 && 'body' in err) {
    res.status(400).json({
      success: false,
      error: 'Invalid JSON payload in request body',
      code: 'INVALID_JSON',
    });
    return;
  }

  // 4. CORS Errors
  if (err.message && err.message.includes('not allowed by CORS')) {
    res.status(403).json({
      success: false,
      error: err.message,
      code: 'CORS_ERROR',
    });
    return;
  }

  // 5. Unhandled Server Errors
  const isDev = process.env.NODE_ENV !== 'production';
  if (isDev && process.env.NODE_ENV !== 'test') {
    console.error('Unhandled server error:', err);
  }

  res.status(500).json({
    success: false,
    error: err.message || 'Internal Server Error',
    code: 'INTERNAL_SERVER_ERROR',
    ...(isDev && { stack: err.stack }),
  });
}
