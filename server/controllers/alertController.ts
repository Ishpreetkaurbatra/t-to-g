import type { Request, Response, NextFunction } from 'express';
import { trendService } from '../services/trendService.ts';

export class AlertController {
  public static async getAlerts(_req: Request, res: Response, next: NextFunction) {
    try {
      const alerts = await trendService.getAlerts();
      res.json({ success: true, count: alerts.length, data: alerts });
    } catch (err) {
      next(err);
    }
  }

  public static async dismissAlert(req: Request, res: Response, next: NextFunction) {
    try {
      const dismissed = await trendService.dismissAlert(req.params.id);
      res.json({ success: dismissed });
    } catch (err) {
      next(err);
    }
  }
}
