import { Request, Response, NextFunction } from 'express';
import { dashboardService } from '../services/dashboard.service';
import { sendSuccess } from '../utils/response';

export class DashboardController {
  async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.userId;
      const stats = await dashboardService.getStats(userId);
      return sendSuccess(res, stats);
    } catch (err) {
      next(err);
    }
  }

  async getRecentOperations(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.userId;
      const limit = parseInt(req.query.limit as string) || 10;
      const operations = await dashboardService.getRecentOperations(userId, limit);
      return sendSuccess(res, operations);
    } catch (err) {
      next(err);
    }
  }

  async getSpecialtyDistribution(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.userId;
      const distribution = await dashboardService.getSpecialtyDistribution(userId);
      return sendSuccess(res, distribution);
    } catch (err) {
      next(err);
    }
  }

  async getMonthlyTrends(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.userId;
      const months = parseInt(req.query.months as string) || 12;
      const trends = await dashboardService.getMonthlyTrends(userId, months);
      return sendSuccess(res, trends);
    } catch (err) {
      next(err);
    }
  }

  async getRevenue(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.userId;
      const revenue = await dashboardService.getRevenue(userId);
      return sendSuccess(res, revenue);
    } catch (err) {
      next(err);
    }
  }
}

export const dashboardController = new DashboardController();
