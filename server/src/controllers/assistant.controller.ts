import { Request, Response, NextFunction } from 'express';
import { assistantService, type AssistantBriefType } from '../services/assistant.service';
import { notificationService } from '../services/notification.service';
import { sendSuccess } from '../utils/response';

export class AssistantController {
  async getBrief(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.userId as string | undefined;
      if (!userId) throw new Error('Authenticated user is required');
      const type = req.query.type === 'weekly' ? 'weekly' : 'daily';
      const data = await assistantService.getBrief(userId, type as AssistantBriefType, typeof req.query.start === 'string' ? req.query.start : undefined, typeof req.query.end === 'string' ? req.query.end : undefined);
      return sendSuccess(res, data);
    } catch (err) { next(err); }
  }

  async listNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.userId as string | undefined;
      if (!userId) throw new Error('Authenticated user is required');
      const data = await notificationService.list(userId, Number(req.query.limit) || 30);
      return sendSuccess(res, data);
    } catch (err) { next(err); }
  }

  async markNotificationRead(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.userId as string | undefined;
      if (!userId) throw new Error('Authenticated user is required');
      await notificationService.markRead(userId, req.params.id);
      return sendSuccess(res, null, 'Notification marked as read');
    } catch (err) { next(err); }
  }

  async testNotification(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.userId as string | undefined;
      if (!userId) throw new Error('Authenticated user is required');
      const data = await notificationService.createTest(userId);
      return sendSuccess(res, data, 'Test notification created and push attempted');
    } catch (err) { next(err); }
  }

  async cronDaily(req: Request, res: Response, next: NextFunction) {
    try {
      if (!this.authorizeCron(req)) return res.status(401).json({ success: false, message: 'Unauthorized' });
      return sendSuccess(res, await notificationService.processDaily(), 'Daily assistant briefs processed');
    } catch (err) { next(err); }
  }

  async cronWeekly(req: Request, res: Response, next: NextFunction) {
    try {
      if (!this.authorizeCron(req)) return res.status(401).json({ success: false, message: 'Unauthorized' });
      return sendSuccess(res, await notificationService.processWeekly(), 'Weekly assistant briefs processed');
    } catch (err) { next(err); }
  }

  private authorizeCron(req: Request) {
    const secret = process.env.CRON_SECRET;
    return Boolean(secret && req.headers.authorization === `Bearer ${secret}`);
  }
}

export const assistantController = new AssistantController();
