import { Request, Response, NextFunction } from 'express';
import { nurseService } from '../services/nurse.service';
import { sendSuccess, sendPaginated } from '../utils/response';
import { createNurseSchema, updateNurseSchema, nurseQuerySchema } from '../validators/nurse.validator';
import { AppError } from '../utils/errors';

function userId(req: Request): string {
  return (req as { user?: { userId: string } }).user?.userId as string;
}

export class NurseController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = nurseQuerySchema.safeParse(req.query);
      const params = parsed.success ? parsed.data : { page: 1, limit: 20 };
      const { data, total } = await nurseService.getAll({ ...params, userId: userId(req) });
      return sendPaginated(res, data, params.page, params.limit, total);
    } catch (err) {
      next(err);
    }
  }

  async getActive(req: Request, res: Response, next: NextFunction) {
    try {
      const nurses = await nurseService.getActive(userId(req));
      return sendSuccess(res, nurses);
    } catch (err) {
      next(err);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const nurse = await nurseService.getById(req.params.id as string, userId(req));
      return sendSuccess(res, nurse);
    } catch (err) {
      next(err);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = createNurseSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new AppError(parsed.error.issues[0]?.message || 'Validation error', 400, parsed.error.issues);
      }
      const nurse = await nurseService.create(parsed.data, userId(req));
      return sendSuccess(res, nurse, 'Nurse created', 201);
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = updateNurseSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new AppError(parsed.error.issues[0]?.message || 'Validation error', 400, parsed.error.issues);
      }
      const nurse = await nurseService.update(req.params.id as string, userId(req), parsed.data);
      return sendSuccess(res, nurse, 'Nurse updated');
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await nurseService.delete(req.params.id as string, userId(req));
      return sendSuccess(res, null, 'Nurse deleted');
    } catch (err) {
      next(err);
    }
  }
}

export const nurseController = new NurseController();
