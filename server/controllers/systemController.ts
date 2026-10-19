import type { Request, Response, NextFunction } from 'express';
import { TREND_SOURCES } from '../demoData.ts';
import { businessService } from '../services/businessService.ts';

export class SystemController {
  public static getSources(_req: Request, res: Response) {
    res.json({ success: true, count: TREND_SOURCES.length, data: TREND_SOURCES });
  }

  public static async getAnalytics(_req: Request, res: Response, next: NextFunction) {
    try {
      const analytics = await businessService.getAnalytics();
      res.json({ success: true, data: analytics });
    } catch (err) {
      next(err);
    }
  }

  public static resetDemo(_req: Request, res: Response) {
    businessService.resetDemoData();
    res.json({
      success: true,
      message: 'Demo data successfully reset to initial state',
    });
  }
}
