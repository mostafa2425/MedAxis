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
    } catch (err) {
      next(err);
    }
  }

  async getActive(req: Request, res: Response, next: NextFunction) {
    try {
      const hospitals = await hospitalService.getActive(userId(req));
      return sendSuccess(res, hospitals);
    } catch (err) {
      next(err);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const hospital = await hospitalService.getById(req.params.id as string, userId(req));
      return sendSuccess(res, hospital);
    } catch (err) {
      next(err);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = createHospitalSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new AppError(parsed.error.issues[0]?.message || 'Validation error', 400, parsed.error.issues);
      }
      const hospital = await hospitalService.create(parsed.data, userId(req));
      return sendSuccess(res, hospital, 'Hospital created', 201);
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = updateHospitalSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new AppError(parsed.error.issues[0]?.message || 'Validation error', 400, parsed.error.issues);
      }
      const hospital = await hospitalService.update(req.params.id as string, userId(req), parsed.data);
      return sendSuccess(res, hospital, 'Hospital updated');
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await hospitalService.delete(req.params.id as string, userId(req));
      return sendSuccess(res, null, 'Hospital deleted');
    } catch (err) {
      next(err);
    }
  }
}

export const hospitalController = new HospitalController();
