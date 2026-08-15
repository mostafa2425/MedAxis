import { Request, Response, NextFunction } from 'express';
import { operationCatalogService } from '../services/operationCatalog.service';
import { sendSuccess } from '../utils/response';
import { createCatalogItemSchema } from '../validators/operationCatalog.validator';
import { AppError } from '../utils/errors';

export class OperationCatalogController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.userId;
      const items = await operationCatalogService.listForUser(userId);
      return sendSuccess(res, items);
    } catch (err) {
      next(err);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = createCatalogItemSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new AppError(parsed.error.issues[0]?.message || 'Validation error', 400, parsed.error.issues);
      }
      const userId = (req as any).user?.userId;
      const item = await operationCatalogService.createCustom(userId, parsed.data.name);
      return sendSuccess(res, item, 'Custom operation created', 201);
    } catch (err) {
      next(err);
    }
  }
}

export const operationCatalogController = new OperationCatalogController();
