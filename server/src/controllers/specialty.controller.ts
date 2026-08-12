import { Request, Response, NextFunction } from 'express';
import { specialtyService } from '../services/specialty.service';
import { sendSuccess, sendPaginated } from '../utils/response';
import { createSpecialtySchema, updateSpecialtySchema } from '../validators/specialty.validator';
import { AppError } from '../utils/errors';

export class SpecialtyController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const specialties = await specialtyService.getAll();
      return sendSuccess(res, specialties);
    } catch (err) {
      next(err);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const specialty = await specialtyService.getById(req.params.id as string);
      return sendSuccess(res, specialty);
    } catch (err) {
      next(err);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = createSpecialtySchema.safeParse(req.body);
      if (!parsed.success) {
        throw new AppError(parsed.error.issues[0]?.message || 'Validation error', 400, parsed.error.issues);
      }
      const specialty = await specialtyService.create(parsed.data);
      return sendSuccess(res, specialty, 'Specialty created', 201);
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = updateSpecialtySchema.safeParse(req.body);
      if (!parsed.success) {
        throw new AppError(parsed.error.issues[0]?.message || 'Validation error', 400, parsed.error.issues);
      }
      const specialty = await specialtyService.update(req.params.id as string, parsed.data);
      return sendSuccess(res, specialty, 'Specialty updated');
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await specialtyService.delete(req.params.id as string);
      return sendSuccess(res, null, 'Specialty deleted');
    } catch (err) {
      next(err);
    }
  }
}

export const specialtyController = new SpecialtyController();
