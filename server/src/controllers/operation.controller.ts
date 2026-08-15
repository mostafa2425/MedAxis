import { Request, Response, NextFunction } from 'express';
import { operationService } from '../services/operation.service';
import { sendSuccess, sendPaginated } from '../utils/response';
import {
  createOperationSchema,
  updateOperationSchema,
  updateCostSchema,
  updateStatusSchema,
  operationQuerySchema,
} from '../validators/surgery.validator';
import { AppError } from '../utils/errors';
import { FileType } from '@prisma/client';
import { resolveFileType } from '../utils/fileType';

function collectUploadedFiles(req: Request): Express.Multer.File[] {
  const files: Express.Multer.File[] = [];
  if (req.file) files.push(req.file);
  if (Array.isArray(req.files)) {
    files.push(...req.files);
  } else if (req.files && typeof req.files === 'object') {
    for (const value of Object.values(req.files)) {
      if (Array.isArray(value)) files.push(...value);
    }
  }
  return files;
}

export class OperationController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = operationQuerySchema.safeParse(req.query);
      const params = parsed.success ? parsed.data : { page: 1, limit: 20, sortBy: 'operationDate', sortOrder: 'desc' as const };
      const userId = (req as any).user?.userId;
      const { data, total } = await operationService.getAll({
        page: params.page,
        limit: params.limit,
        sortBy: params.sortBy,
        sortOrder: params.sortOrder,
        search: 'search' in params ? params.search : undefined,
        status: 'status' in params ? params.status : undefined,
        specialtyId: 'specialtyId' in params ? params.specialtyId : undefined,
        hospitalId: 'hospitalId' in params ? params.hospitalId : undefined,
        dateFrom: 'dateFrom' in params ? params.dateFrom : undefined,
        dateTo: 'dateTo' in params ? params.dateTo : undefined,
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
      const operation = await operationService.getById(req.params.id as string, userId);
      return sendSuccess(res, operation);
    } catch (err) {
      next(err);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = createOperationSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new AppError(parsed.error.issues[0]?.message || 'Validation error', 400, parsed.error.issues);
      }
      const userId = (req as any).user?.userId;
      const operation = await operationService.create(parsed.data as any, userId);
      return sendSuccess(res, operation, 'Operation created', 201);
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = updateOperationSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new AppError(parsed.error.issues[0]?.message || 'Validation error', 400, parsed.error.issues);
      }
      const userId = (req as any).user?.userId;
      const operation = await operationService.update(req.params.id as string, userId, parsed.data as any);
      return sendSuccess(res, operation, 'Operation updated');
    } catch (err) {
      next(err);
    }
  }

  async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = updateStatusSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new AppError(parsed.error.issues[0]?.message || 'Validation error', 400, parsed.error.issues);
      }
      const userId = (req as any).user?.userId;
      const operation = await operationService.updateStatus(
        req.params.id as string,
        userId,
        parsed.data.status as any,
      );
      return sendSuccess(res, operation, 'Status updated');
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.userId;
      await operationService.delete(req.params.id as string, userId);
      return sendSuccess(res, null, 'Operation deleted');
    } catch (err) {
      next(err);
    }
  }

  async updateCost(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = updateCostSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new AppError(parsed.error.issues[0]?.message || 'Validation error', 400, parsed.error.issues);
      }
      const userId = (req as any).user?.userId;
      const cost = await operationService.updateCost(req.params.id as string, userId, parsed.data as any);
      return sendSuccess(res, cost, 'Cost updated');
    } catch (err) {
      next(err);
    }
  }

  async uploadFiles(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.userId;
      const fileType = resolveFileType(req.body?.fileType);
      const files = collectUploadedFiles(req);
      if (files.length === 0) {
        throw new AppError('No files uploaded', 400, [
          {
            path: ['file'],
            code: 'custom',
            message: 'A file is required',
          },
        ]);
      }
      const uploadedFiles = await operationService.uploadFiles(
        req.params.id as string,
        userId,
        files,
        fileType as FileType,
      );
      return sendSuccess(res, uploadedFiles, 'Files uploaded', 201);
    } catch (err) {
      next(err);
    }
  }

  async deleteFile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.userId;
      const result = await operationService.deleteFile(req.params.operationId as string, req.params.fileId as string, userId);
      return sendSuccess(res, result, 'File deleted');
    } catch (err) {
      next(err);
    }
  }

  async getTimeline(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.userId;
      const timeline = await operationService.getTimeline(req.params.id as string, userId);
      return sendSuccess(res, timeline);
    } catch (err) {
      next(err);
    }
  }
}

export const operationController = new OperationController();
