import type { Request, Response, NextFunction } from 'express';
import { businessService } from '../services/businessService.ts';

export class BusinessController {
  public static async getProfile(_req: Request, res: Response, next: NextFunction) {
    try {
      const profile = await businessService.getProfile();
      res.json({ success: true, data: profile });
    } catch (err) {
      next(err);
    }
  }

  public static async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await businessService.updateProfile(req.body);
      res.json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  }

  public static async matchOpportunities(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await businessService.matchOpportunities(req.body);
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }

  public static async createPlan(req: Request, res: Response, next: NextFunction) {
    try {
      const plan = await businessService.createPlan(req.body);
      res.status(201).json({ success: true, data: plan });
    } catch (err) {
      next(err);
    }
  }

  public static async getOpportunities(_req: Request, res: Response, next: NextFunction) {
    try {
      const opportunities = await businessService.getOpportunities();
      res.json({ success: true, count: opportunities.length, data: opportunities });
    } catch (err) {
      next(err);
    }
  }
}
