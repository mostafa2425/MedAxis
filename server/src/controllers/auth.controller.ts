import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { sendSuccess } from '../utils/response';
import { loginSchema, registerSchema, updateProfileSchema } from '../validators/auth.validator';
import { AppError } from '../utils/errors';

export class AuthController {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = loginSchema.safeParse(req.body);
      if (!parsed.success) throw new AppError(parsed.error.issues[0]?.message || 'Validation error', 400, parsed.error.issues);
      return sendSuccess(res, await authService.login(parsed.data.email, parsed.data.password), 'Login successful');
    } catch (err) { next(err); }
  }

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = registerSchema.safeParse(req.body);
      if (!parsed.success) throw new AppError(parsed.error.issues[0]?.message || 'Validation error', 400, parsed.error.issues);
      const result = await authService.register(parsed.data.email, parsed.data.password, parsed.data.name, parsed.data.specialtyIds, parsed.data.phone, parsed.data.subspecialtyIds);
      return sendSuccess(res, result, 'Registration successful. Please verify your email to continue.', 201);
    } catch (err) { next(err); }
  }

  async verifyEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const token = typeof req.query.token === 'string' ? req.query.token : '';
      return sendSuccess(res, await authService.verifyEmail(token), 'Email verified successfully');
    } catch (err) { next(err); }
  }

  async resendVerification(req: Request, res: Response, next: NextFunction) {
    try {
      const email = typeof req.body?.email === 'string' ? req.body.email.trim() : '';
      if (!email) throw new AppError('Email is required', 400);
      return sendSuccess(res, await authService.resendVerification(email), 'If the account exists and is not verified, a new verification email has been sent.');
    } catch (err) { next(err); }
  }

  async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.userId;
      return sendSuccess(res, await authService.getMe(userId));
    } catch (err) { next(err); }
  }

  async updateMe(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = updateProfileSchema.safeParse(req.body);
      if (!parsed.success) throw new AppError(parsed.error.issues[0]?.message || 'Validation error', 400, parsed.error.issues);
      const userId = (req as any).user?.userId;
      return sendSuccess(res, await authService.updateProfile(userId, parsed.data), 'Profile updated');
    } catch (err) { next(err); }
  }

  async uploadAvatar(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.userId;
      const file = (req as any).file as { buffer: Buffer; mimetype: string; originalname: string; size: number } | undefined;
      return sendSuccess(res, await authService.uploadProfileAvatar(userId, file), 'Profile image updated');
    } catch (err) { next(err); }
  }
}

export const authController = new AuthController();
