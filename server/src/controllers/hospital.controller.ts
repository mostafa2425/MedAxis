import { Request, Response, NextFunction } from 'express';
import { hospitalService } from '../services/hospital.service';
import { sendSuccess, sendPaginated } from '../utils/response';
import { createHospitalSchema, updateHospitalSchema, hospitalQuerySchema } from '../validators/hospital.validator';
import { AppError } from '../utils/errors';

function userId(req: Request): string {
  return (req as { user?: { userId: string } }).user?.userId as string;
}

export class HospitalController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = hospitalQuerySchema.safeParse(req.query);
      const params = parsed.success ? parsed.data : { page: 1, limit: 20 };
      const { data, total } = await hospitalService.getAll({ ...params, userId: userId(req) });
      return sendPaginated(res, data, params.page, params.limit, total);
    } catch (err) { next(err); }
  }
  async getActive(req: Request, res: Response, next: NextFunction) {
    try { return sendSuccess(res, await hospitalService.getActive(userId(req))); } catch (err) { next(err); }
  }
  async getById(req: Request, res: Response, next: NextFunction) {
    try { return sendSuccess(res, await hospitalService.getById(req.params.id as string, userId(req))); } catch (err) { next(err); }
  }
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = createHospitalSchema.safeParse(req.body);
      if (!parsed.success) throw new AppError(parsed.error.issues[0]?.message || 'Validation error', 400, parsed.error.issues);
      return sendSuccess(res, await hospitalService.create(parsed.data, userId(req)), 'Hospital created', 201);
    } catch (err) { next(err); }
  }
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = updateHospitalSchema.safeParse(req.body);
      if (!parsed.success) throw new AppError(parsed.error.issues[0]?.message || 'Validation error', 400, parsed.error.issues);
      return sendSuccess(res, await hospitalService.update(req.params.id as string, userId(req), parsed.data), 'Hospital updated');
    } catch (err) { next(err); }
  }
  async delete(req: Request, res: Response, next: NextFunction) {
    try { return sendSuccess(res, await hospitalService.delete(req.params.id as string, userId(req)), 'Hospital deleted'); } catch (err) { next(err); }
  }
}

export const hospitalController = new HospitalController();
