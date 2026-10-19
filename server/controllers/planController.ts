import type { Request, Response, NextFunction } from 'express';
import { businessService } from '../services/businessService.ts';

export class PlanController {
  public static async getActionPlans(req: Request, res: Response, next: NextFunction) {
    try {
      const { status } = req.query as { status?: string };
      const plans = await businessService.getActionPlans(status);
      res.json({ success: true, count: plans.length, data: plans });
    } catch (err) {
      next(err);
    }
  }

  public static async getActionPlanById(req: Request, res: Response, next: NextFunction) {
    try {
      const plan = await businessService.getActionPlanById(req.params.id);
      res.json({ success: true, data: plan });
    } catch (err) {
      next(err);
    }
  }

  public static async createActionPlan(req: Request, res: Response, next: NextFunction) {
    try {
      const plan = await businessService.createPlan(req.body);
      res.status(201).json({ success: true, data: plan });
    } catch (err) {
      next(err);
    }
  }

  public static async getPendingReviews(_req: Request, res: Response, next: NextFunction) {
    try {
      const pending = await businessService.getActionPlans('PENDING EXPERT REVIEW');
      res.json({ success: true, count: pending.length, data: pending });
    } catch (err) {
      next(err);
    }
  }

  public static async submitExpertReview(req: Request, res: Response, next: NextFunction) {
    try {
      const { planId, ...reviewData } = req.body;
      const updated = await businessService.submitExpertReview(planId, reviewData);
      res.json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  }
}
