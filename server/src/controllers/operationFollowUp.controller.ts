import { Request, Response, NextFunction } from 'express';
import { operationFollowUpService } from '../services/operationFollowUp.service';
import { sendSuccess } from '../utils/response';
import { AppError } from '../utils/errors';

export class OperationFollowUpController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await operationFollowUpService.list(req.params.id as string, (req as any).user?.userId);
      return sendSuccess(res, data);
    } catch (err) { next(err); }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { title, scheduledAt, notes } = req.body ?? {};
      if (typeof title !== 'string' || typeof scheduledAt !== 'string') throw new AppError('Title and scheduledAt are required', 400);
      const data = await operationFollowUpService.create(req.params.id as string, (req as any).user?.userId, { title, scheduledAt, notes });
      return sendSuccess(res, data, 'Follow-up created', 201);
    } catch (err) { next(err); }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await operationFollowUpService.update(req.params.id as string, req.params.followUpId as string, (req as any).user?.userId, req.body ?? {});
      return sendSuccess(res, data, 'Follow-up updated');
    } catch (err) { next(err); }
  }

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      await operationFollowUpService.remove(req.params.id as string, req.params.followUpId as string, (req as any).user?.userId);
      return sendSuccess(res, null, 'Follow-up deleted');
    } catch (err) { next(err); }
  }
}

export const operationFollowUpController = new OperationFollowUpController();
