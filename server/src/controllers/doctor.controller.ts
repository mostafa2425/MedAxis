import { Request, Response, NextFunction } from 'express';
import { doctorService } from '../services/doctor.service';
import { sendSuccess, sendPaginated } from '../utils/response';
import { createDoctorSchema, updateDoctorSchema, doctorQuerySchema } from '../validators/doctor.validator';
import { AppError } from '../utils/errors';

export class DoctorController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = doctorQuerySchema.safeParse(req.query);
      const params = parsed.success ? parsed.data : { page: 1, limit: 20 };
      const { data, total } = await doctorService.getAll(params);
      return sendPaginated(res, data, params.page, params.limit, total);
    } catch (err) {
      next(err);
    }
  }

  async getActive(req: Request, res: Response, next: NextFunction) {
    try {
      const doctors = await doctorService.getActive();
      return sendSuccess(res, doctors);
    } catch (err) {
      next(err);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const doctor = await doctorService.getById(req.params.id as string);
      return sendSuccess(res, doctor);
    } catch (err) {
      next(err);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = createDoctorSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new AppError(parsed.error.issues[0]?.message || 'Validation error', 400, parsed.error.issues);
      }
      const doctor = await doctorService.create(parsed.data, parsed.data.specialtyIds);
      return sendSuccess(res, doctor, 'Doctor created', 201);
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = updateDoctorSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new AppError(parsed.error.issues[0]?.message || 'Validation error', 400, parsed.error.issues);
      }
      const doctor = await doctorService.update(req.params.id as string, parsed.data, parsed.data.specialtyIds);
      return sendSuccess(res, doctor, 'Doctor updated');
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await doctorService.delete(req.params.id as string);
      return sendSuccess(res, null, 'Doctor deleted');
    } catch (err) {
      next(err);
    }
  }
}

export const doctorController = new DoctorController();
