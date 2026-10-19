import type { Request, Response, NextFunction } from 'express';
import { businessService } from '../services/businessService.ts';

export class ExperimentController {
  public static async getExperiments(_req: Request, res: Response, next: NextFunction) {
    try {
      const experiments = await businessService.getExperiments();
      res.json({ success: true, count: experiments.length, data: experiments });
    } catch (err) {
      next(err);
    }
  }

  public static async createExperiment(req: Request, res: Response, next: NextFunction) {
    try {
      const newExp = await businessService.createExperiment(req.body);
      res.status(201).json({ success: true, data: newExp });
    } catch (err) {
      next(err);
    }
  }

  public static async updateExperimentResult(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await businessService.updateExperimentResult(req.params.id, req.body);
      res.json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  }
}
