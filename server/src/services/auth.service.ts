import path from 'path';
import { prisma } from '../utils/prisma';
import { userRepo } from '../repositories/user.repo';
import { doctorRepo, type DoctorWithSpecialties } from '../repositories/doctor.repo';
import { specialtyService } from './specialty.service';
import { emailVerificationService } from './emailVerification.service';
import { hashPassword, comparePassword, generateToken, type JwtPayload } from '../utils/auth';
import { AppError, UnauthorizedError, ConflictError } from '../utils/errors';
import { createPublicFileUrl, deleteStoredFile, uploadOperationFile } from '../utils/supabaseStorage';
import type { UpdateProfileInput } from '../validators/auth.validator';

function toSpecialtyRef(link: { specialty: { id: string; name: string; nameAr: string | null } }) {
  return { id: link.specialty.id, name: link.specialty.name, nameAr: link.specialty.nameAr };
}

function toAuthUser(user: { id: string; email: string; name: string; phone: string | null; avatarUrl: string | null; role: string; isActive: boolean; createdAt?: Date; updatedAt?: Date }, doctor: DoctorWithSpecialties | null) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    phone: user.phone ?? doctor?.phone ?? null,
    avatarUrl: user.avatarUrl ?? null,
    role: user.role,
    isActive: user.isActive,
    doctorId: doctor?.id ?? null,
    specialties: doctor ? doctor.specialties.map(toSpecialtyRef) : [],
    subspecialties: doctor ? doctor.subspecialties.map(toSpecialtyRef) : [],
    ...(user.createdAt ? { createdAt: user.createdAt } : {}),
    ...(user.updatedAt ? { updatedAt: user.updatedAt } : {}),
  };
}

async function resolveSpecialtyLinks(specialtyIds: string[], subspecialtyIds?: string[]) {
  const validSpecialtyIds = await specialtyService.assertTopLevelSpecialtyIds(specialtyIds);
  const validSubspecialtyIds = await specialtyService.assertSubspecialtyIds(subspecialtyIds, validSpecialtyIds);
  return { validSpecialtyIds, validSubspecialtyIds };
}

async function isEmailVerified(userId: string) {
  const rows = await prisma.$queryRaw<Array<{ emailVerifiedAt: Date | null }>>`
    SELECT "emailVerifiedAt" FROM "users" WHERE "id" = ${userId} LIMIT 1
  `;
  return Boolean(rows[0]?.emailVerifiedAt);
}

class AuthService {
  async login(email: string, password: string) {
    const user = await userRepo.findByEmail(email);
    if (!user) throw new UnauthorizedError('Invalid email or password');
    if (!user.isActive) throw new UnauthorizedError('Account is deactivated');
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) throw new UnauthorizedError('Invalid email or password');
    if (!(await isEmailVerified(user.id))) {
      throw new AppError('Please verify your email address before logging in.', 401, {
        code: 'EMAIL_NOT_VERIFIED',
        email: user.email,
      });
    }
    const payload: JwtPayload = { userId: user.id, email: user.email, role: user.role };
    const token = generateToken(payload);
    const doctor = await doctorRepo.findByUserId(user.id);
    return { token, user: toAuthUser(user, doctor) };
  }

  async register(email: string, password: string, name: string, specialtyIds: string[], phone?: string, subspecialtyIds?: string[]) {
    const existingUser = await userRepo.findByEmail(email);
    if (existingUser) {
      if (await isEmailVerified(existingUser.id)) throw new ConflictError('User with this email');
      throw new ConflictError('An account with this email already exists but is not verified. Please use resend verification email.');
    }
    const { validSpecialtyIds, validSubspecialtyIds } = await resolveSpecialtyLinks(specialtyIds, subspecialtyIds);
    const hashedPassword = await hashPassword(password);
    const user = await userRepo.create({ email, password: hashedPassword, name, phone });
    const doctor = await doctorRepo.create({ name: user.name, phone: user.phone, email: user.email, userId: user.id, createdBy: user.id }, validSpecialtyIds, validSubspecialtyIds);

    try {
      await emailVerificationService.issue(user.id, user.email, user.name, false);
    } catch (error) {
      console.error('Registration email verification send failed:', error);
      throw error;
    }

    return {
      requiresEmailVerification: true,
      email: user.email,
      user: toAuthUser(user, doctor),
    };
  }

  async verifyEmail(token: string) {
    return emailVerificationService.verify(token);
  }

  async resendVerification(email: string) {
    await emailVerificationService.resend(email.trim());
    return { sent: true };
  }

  async getMe(userId: string) {
    const user = await userRepo.findById(userId);
    if (!user) throw new UnauthorizedError('User not found');
    return toAuthUser(user, await doctorRepo.findByUserId(userId));
  }

  async updateProfile(userId: string, input: UpdateProfileInput) {
    const user = await userRepo.findById(userId);
    if (!user) throw new UnauthorizedError('User not found');
    const userUpdate: { name?: string; phone?: string | null } = {};
    if (input.name !== undefined) userUpdate.name = input.name.trim();
    if (input.phone !== undefined) userUpdate.phone = input.phone?.trim() || null;
    if (Object.keys(userUpdate).length > 0) await userRepo.update(userId, userUpdate);
    let doctor = await doctorRepo.findByUserId(userId);
    const nextName = userUpdate.name ?? user.name;
    const nextPhone = userUpdate.phone !== undefined ? userUpdate.phone : (user.phone ?? doctor?.phone ?? null);
    if (!doctor && input.specialtyIds) {
      const { validSpecialtyIds, validSubspecialtyIds } = await resolveSpecialtyLinks(input.specialtyIds, input.subspecialtyIds);
      doctor = await doctorRepo.create({ name: nextName, phone: nextPhone, email: user.email, userId }, validSpecialtyIds, validSubspecialtyIds);
    } else if (doctor) {
      const doctorUpdate: { name?: string; phone?: string | null } = {};
      if (userUpdate.name !== undefined) doctorUpdate.name = userUpdate.name;
      if (userUpdate.phone !== undefined) doctorUpdate.phone = userUpdate.phone;
      if (Object.keys(doctorUpdate).length > 0) await doctorRepo.update(doctor.id, doctorUpdate);
      if (input.specialtyIds) {
        const validSpecialtyIds = await specialtyService.assertTopLevelSpecialtyIds(input.specialtyIds);
        const validSubspecialtyIds = input.subspecialtyIds !== undefined
          ? await specialtyService.assertSubspecialtyIds(input.subspecialtyIds, validSpecialtyIds)
          : await specialtyService.filterSubspecialtyIds(doctor.subspecialties.map((link) => link.specialtyId), validSpecialtyIds);
        doctor = await doctorRepo.setSpecialtyLinks(doctor.id, validSpecialtyIds, validSubspecialtyIds);
      } else {
        doctor = await doctorRepo.findByUserId(userId);
      }
    }
    const updatedUser = await userRepo.findById(userId);
    if (!updatedUser) throw new UnauthorizedError('User not found');
    return toAuthUser(updatedUser, doctor);
  }

  async uploadProfileAvatar(userId: string, file?: { buffer: Buffer; mimetype: string; originalname: string; size: number }) {
    if (!file) throw new AppError('Profile image is required', 400);
    const allowed = new Set(['image/jpeg', 'image/png', 'image/webp']);
    if (!allowed.has(file.mimetype)) throw new AppError('Only JPG, PNG or WebP images are supported', 400);
    if (file.size > 2 * 1024 * 1024) throw new AppError('Profile image must be 2MB or smaller', 400);

    const current = await userRepo.findById(userId);
    if (!current) throw new UnauthorizedError('User not found');

    const ext = path.extname(file.originalname).toLowerCase().replace(/[^a-z0-9.]/g, '') || '.jpg';
    const storagePath = `profiles/${userId}/${Date.now()}-${cryptoRandomId()}${ext}`;
    await uploadOperationFile(storagePath, file);
    const avatarUrl = createPublicFileUrl(storagePath);
    await userRepo.update(userId, { avatarUrl });
    if (current.avatarUrl) {
      const marker = '/storage/v1/object/public/';
      const index = current.avatarUrl.indexOf(marker);
      if (index >= 0) {
        const remainder = current.avatarUrl.slice(index + marker.length);
        const slash = remainder.indexOf('/');
        if (slash >= 0) void deleteStoredFile(decodeURIComponent(remainder.slice(slash + 1))).catch(() => undefined);
      }
    }
    const updated = await userRepo.findById(userId);
    if (!updated) throw new UnauthorizedError('User not found');
    return toAuthUser(updated, await doctorRepo.findByUserId(userId));
  }
}

function cryptoRandomId() {
  return Math.random().toString(36).slice(2, 10);
}

export const authService = new AuthService();
