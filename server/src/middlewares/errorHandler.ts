import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { sendError } from '../utils/response';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  if (err instanceof AppError) {
    return sendError(res, err.message, err.statusCode, err.details);
  }

  if (err instanceof ZodError) {
    return sendError(
      res,
      err.issues[0]?.message || 'Validation error',
      400,
      err.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      })),
    );
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      const target = (err.meta?.target as string[])?.join(', ') || 'field';
      return sendError(res, `Duplicate value for: ${target}`, 409);
    }
    if (err.code === 'P2025') {
      return sendError(res, 'Record not found', 404);
    }
    if (err.code === 'P2003') {
      return sendError(res, 'Related record not found', 400);
    }
  }

  if (err instanceof SyntaxError) {
    return sendError(res, 'Invalid JSON in request body', 400);
  }

  console.error('Unhandled error:', err);
  return sendError(res, 'Internal server error', 500);
}
