import { Request, Response, NextFunction } from 'express';
import { assistantService, type AssistantBriefType } from '../services/assistant.service';
import { sendSuccess } from '../utils/response';

export class AssistantController {
  async getBrief(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.userId as string | undefined;
      if (!userId) throw new Error('Authenticated user is required');

      const type = req.query.type === 'weekly' ? 'weekly' : 'daily';
      const data = await assistantService.getBrief(
        userId,
        type as AssistantBriefType,
        typeof req.query.start === 'string' ? req.query.start : undefined,
        typeof req.query.end === 'string' ? req.query.end : undefined,
      );

      return sendSuccess(res, data);
    } catch (err) {
      next(err);
    }
  }
}

export const assistantController = new AssistantController();
