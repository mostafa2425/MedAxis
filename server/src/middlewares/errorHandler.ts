import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { sendError } from '../utils/response';
import { Prisma } from '../prisma';
import { ZodError } from 'zod';
import { MulterError } from 'multer';
import { normalizeZodIssues } from '../utils/validationErrors';

const VALIDATION_FAILED = 'Validation failed';

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    return sendError(res, VALIDATION_FAILED, 400, normalizeZodIssues(err.issues) ?? []);
  }
  if (err instanceof AppError) {
    const normalized = normalizeZodIssues(err.details);
    if (normalized) return sendError(res, VALIDATION_FAILED, err.statusCode, normalized);
    return sendError(res, err.message, err.statusCode, err.details);
  }
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      const target = (err.meta?.target as string[])?.join(', ') || 'field';
      return sendError(res, `Duplicate value for: ${target}`, 409);
    }
    if (err.code === 'P2025') return sendError(res, 'Record not found', 404);
    if (err.code === 'P2003') return sendError(res, 'Related record not found', 400);
  }
  if (err instanceof Prisma.PrismaClientValidationError) {
    console.error('Prisma validation error:', err.message);
    return sendError(res, 'Invalid request data', 400, [{ path: [], code: 'custom', message: 'Invalid request data' }]);
  }
  if (err instanceof MulterError) return sendError(res, err.message, 400, [{ path: ['file'], code: 'custom', message: err.message }]);
  if (err instanceof SyntaxError) return sendError(res, 'Invalid JSON in request body', 400);
  console.error('Unhandled error:', err);
  return sendError(res, 'Internal server error', 500);
}
