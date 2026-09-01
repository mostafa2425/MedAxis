import { Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { adminService } from '../services/admin.service';
import { sendSuccess } from '../utils/response';

export const adminController = {
  async overview(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const data = await adminService.getOverview();
      return sendSuccess(res, data, 'Admin overview loaded');
    } catch (error) {
      return next(error);
    }
  },
};
