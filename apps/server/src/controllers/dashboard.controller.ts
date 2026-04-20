import { Request, Response, NextFunction } from 'express';
import { dashboardService } from '../services/dashboard.service';
import { sendSuccess } from '../utils/apiResponse';

export const getDashboardSummary = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const summary = await dashboardService.getSummary();
    sendSuccess(res, summary);
  } catch (err) {
    next(err);
  }
};
