import { Request, Response, NextFunction } from 'express';
import { patientService } from '../services/patient.service';
import { sendSuccess, sendPaginated } from '../utils/response';
import { createPatientSchema, updatePatientSchema, patientQuerySchema } from '../validators/patient.validator';
import { AppError } from '../utils/errors';

export class PatientController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = patientQuerySchema.safeParse(req.query);
      const params = parsed.success ? parsed.data : { page: 1, limit: 20 };
      const userId = (req as any).user?.userId;
      const { data, total } = await patientService.getAll({
        ...params,
        createdBy: userId,
      });
      return sendPaginated(res, data, params.page, params.limit, total);
    } catch (err) {
      next(err);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.userId;
      const patient = await patientService.getById(req.params.id as string, userId);
      return sendSuccess(res, patient);
    } catch (err) {
      next(err);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = createPatientSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new AppError(parsed.error.issues[0]?.message || 'Validation error', 400, parsed.error.issues);
      }
      const userId = (req as any).user?.userId;
      const patient = await patientService.create(parsed.data, userId);
      return sendSuccess(res, patient, 'Patient created', 201);
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = updatePatientSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new AppError(parsed.error.issues[0]?.message || 'Validation error', 400, parsed.error.issues);
      }
      const userId = (req as any).user?.userId;
      const patient = await patientService.update(req.params.id as string, userId, parsed.data);
      return sendSuccess(res, patient, 'Patient updated');
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.userId;
      await patientService.delete(req.params.id as string, userId);
      return sendSuccess(res, null, 'Patient deleted');
    } catch (err) {
      next(err);
    }
  }
}

export const patientController = new PatientController();
