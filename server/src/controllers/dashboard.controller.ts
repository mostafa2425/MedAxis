import { Request, Response, NextFunction } from 'express';
import { dashboardService } from '../services/dashboard.service';
import { sendSuccess } from '../utils/response';

export class DashboardController {
  async getStats(req: Request, res: Response, next: NextFunction) {
    try { return sendSuccess(res, await dashboardService.getStats((req as any).user?.userId)); } catch (err) { next(err); }
  }
  async getOverview(req: Request, res: Response, next: NextFunction) {
    try { return sendSuccess(res, await dashboardService.getOverview((req as any).user?.userId)); } catch (err) { next(err); }
  }
  async getRecentOperations(req: Request, res: Response, next: NextFunction) {
    try { return sendSuccess(res, await dashboardService.getRecentOperations((req as any).user?.userId, parseInt(req.query.limit as string) || 10)); } catch (err) { next(err); }
  }
  async getSpecialtyDistribution(req: Request, res: Response, next: NextFunction) {
    try { return sendSuccess(res, await dashboardService.getSpecialtyDistribution((req as any).user?.userId)); } catch (err) { next(err); }
  }
  async getMonthlyTrends(req: Request, res: Response, next: NextFunction) {
    try { return sendSuccess(res, await dashboardService.getMonthlyTrends((req as any).user?.userId, parseInt(req.query.months as string) || 12)); } catch (err) { next(err); }
  }
  async getRevenue(req: Request, res: Response, next: NextFunction) {
    try { return sendSuccess(res, await dashboardService.getRevenue((req as any).user?.userId)); } catch (err) { next(err); }
  }
}

export const dashboardController = new DashboardController();
