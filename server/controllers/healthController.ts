import type { Request, Response } from 'express';
import { checkDatabaseHealth } from '../services/database/supabaseClient.ts';
import { getAIEngineStatus } from '../services/ai/index.ts';
import { config } from '../config.ts';
import type { HealthCheckResponse, DependencyStatusResponse } from '../types/index.ts';

export class HealthController {
  public static getHealth(_req: Request, res: Response) {
    const response: HealthCheckResponse = {
      status: 'ok',
      service: 'T→G Backend API',
      uptime: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      environment: config.NODE_ENV,
    };
    res.status(200).json(response);
  }

  public static async getStatus(_req: Request, res: Response) {
    const dbHealth = await checkDatabaseHealth();
    const aiStatus = getAIEngineStatus();

    const mem = process.memoryUsage();
    const memoryUsageMB = Math.round(mem.rss / 1024 / 1024);

    const isHealthy = dbHealth.status !== 'error' && aiStatus.status !== 'error';

    const response: DependencyStatusResponse = {
      status: isHealthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      uptime: Math.round(process.uptime()),
      dependencies: {
        database: {
          provider: dbHealth.provider,
          status: dbHealth.status as any,
          message: dbHealth.message,
        },
        aiEngine: {
          provider: aiStatus.provider,
          status: aiStatus.status,
          isMock: aiStatus.isMock,
          endpoint: aiStatus.endpoint,
          message: aiStatus.message,
        },
      },
      system: {
        nodeVersion: process.version,
        memoryUsageMB,
        platform: process.platform,
      },
    };

    res.status(200).json(response);
  }
}
