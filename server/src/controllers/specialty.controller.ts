import { Request, Response, NextFunction } from 'express';
import { specialtyService } from '../services/specialty.service';
import { doctorRepo } from '../repositories/doctor.repo';
import { sendSuccess, sendPaginated } from '../utils/response';
import {
  createSpecialtySchema,
  updateSpecialtySchema,
  listSpecialtyQuerySchema,
} from '../validators/specialty.validator';
import { AppError, UnauthorizedError, BadRequestError } from '../utils/errors';
import { verifyToken } from '../utils/auth';

function resolveUserId(req: Request): string | undefined {
  const existing = (req as Request & { user?: { userId?: string } }).user?.userId;
  if (existing) return existing;
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return undefined;
  try {
    return verifyToken(header.slice(7)).userId;
  } catch {
    return undefined;
  }
}

export class SpecialtyController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = listSpecialtyQuerySchema.safeParse(req.query);
      if (!parsed.success) {
        throw new AppError(parsed.error.issues[0]?.message || 'Validation error', 400, parsed.error.issues);
      }

      const query = parsed.data;
      let parentIds = query.parentIds;

      if (query.mine) {
        const userId = resolveUserId(req);
        if (!userId) throw new UnauthorizedError('Authentication required');
        const doctor = await doctorRepo.findByUserId(userId);
        const doctorSpecialtyIds = doctor
          ? doctor.specialties.map((link) => link.specialtyId)
          : [];
        const allowed = new Set(doctorSpecialtyIds);
        if (parentIds.length > 0) {
          const invalid = parentIds.filter((id) => !allowed.has(id));
          if (invalid.length > 0) {
            throw new BadRequestError(
              'Requested parent specialties are not part of the current doctor profile',
              [
                {
                  path: ['parentIds'],
                  code: 'custom',
                  message: 'Requested parent specialties are not part of the current doctor profile',
                },
              ],
            );
          }
        } else {
          parentIds = doctorSpecialtyIds;
        }
        if (parentIds.length === 0) {
          if (query.page != null && query.limit != null) {
            return sendPaginated(res, [], query.page, query.limit, 0);
          }
          return sendSuccess(res, []);
        }
      }

      const paginate = query.page != null && query.limit != null;
      const result = await specialtyService.getAll({
        parentIds: parentIds.length > 0 ? parentIds : undefined,
        rootsOnly: query.rootsOnly && parentIds.length === 0,
        search: query.search,
        skip: paginate ? (query.page! - 1) * query.limit! : undefined,
        take: paginate ? query.limit : undefined,
      });

      if (paginate) {
        return sendPaginated(res, result.data, query.page!, query.limit!, result.total);
      }
      return sendSuccess(res, result.data);
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
