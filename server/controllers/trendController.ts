import type { Request, Response, NextFunction } from 'express';
import { trendService } from '../services/trendService.ts';

export class TrendController {
  public static async getTrends(req: Request, res: Response, next: NextFunction) {
    try {
      const { category, momentum, search } = req.query as {
        category?: string;
        momentum?: string;
        search?: string;
      };
      const trends = await trendService.getTrends(category, momentum, search);
      res.json({ success: true, count: trends.length, data: trends });
    } catch (err) {
      next(err);
    }
  }

  public static async searchTrends(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await trendService.searchTrends(req.body);
      res.json({
        success: true,
        count: result.trends.length,
        total: result.total,
        limit: result.limit,
        offset: result.offset,
        data: result.trends,
      });
    } catch (err) {
      next(err);
    }
  }

  public static async getTrendById(req: Request, res: Response, next: NextFunction) {
    try {
      const trend = await trendService.getTrendById(req.params.id);
      res.json({ success: true, data: trend });
    } catch (err) {
      next(err);
    }
  }

  public static async toggleSaveTrend(req: Request, res: Response, next: NextFunction) {
    try {
      const isSaved = await trendService.toggleSaveTrend(req.params.id);
      res.json({ success: true, is_saved: isSaved });
    } catch (err) {
      next(err);
    }
  }

  public static async analyzeTrend(req: Request, res: Response, next: NextFunction) {
    try {
      const { trendId, customTrend, businessProfile } = req.body;
      const result = await trendService.analyzeTrend({
        trendId,
        customTrend,
        businessProfileOverride: businessProfile,
      });

      res.json({
        success: true,
        trend: result.trend,
        business: result.business,
        analysis: result.analysis,
        isMockAi: result.isMockAi,
      });
    } catch (err) {
      next(err);
    }
  }

  public static async getAlerts(_req: Request, res: Response, next: NextFunction) {
    try {
      const alerts = await trendService.getAlerts();
      res.json({ success: true, count: alerts.length, data: alerts });
    } catch (err) {
      next(err);
    }
  }
}
