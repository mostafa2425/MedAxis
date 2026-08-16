import { userRepo } from '../repositories/user.repo';
import { doctorRepo, type DoctorWithSpecialties } from '../repositories/doctor.repo';
import { specialtyService } from './specialty.service';
import { hashPassword, comparePassword, generateToken, type JwtPayload } from '../utils/auth';
import { UnauthorizedError, ConflictError } from '../utils/errors';
import type { UpdateProfileInput } from '../validators/auth.validator';

function toSpecialtyRef(link: { specialty: { id: string; name: string; nameAr: string | null } }) {
  return {
    id: link.specialty.id,
    name: link.specialty.name,
    nameAr: link.specialty.nameAr,
  };
}

function toAuthUser(
  user: {
    id: string;
    email: string;
    name: string;
    phone: string | null;
    role: string;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  },
  doctor: DoctorWithSpecialties | null,
) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    phone: user.phone ?? doctor?.phone ?? null,
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
  const validSubspecialtyIds = await specialtyService.assertSubspecialtyIds(
    subspecialtyIds,
    validSpecialtyIds,
  );
  return { validSpecialtyIds, validSubspecialtyIds };
}

class AuthService {
  async login(email: string, password: string) {
    const user = await userRepo.findByEmail(email);
    if (!user) throw new UnauthorizedError('Invalid email or password');
    if (!user.isActive) throw new UnauthorizedError('Account is deactivated');

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) throw new UnauthorizedError('Invalid email or password');

    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const token = generateToken(payload);
    const doctor = await doctorRepo.findByUserId(user.id);

    return {
      token,
      user: toAuthUser(user, doctor),
    };
  }

  async register(
    email: string,
    password: string,
    name: string,
    specialtyIds: string[],
    phone?: string,
    subspecialtyIds?: string[],
  ) {
    const existingUser = await userRepo.findByEmail(email);
    if (existingUser) throw new ConflictError('User with this email');

    const { validSpecialtyIds, validSubspecialtyIds } = await resolveSpecialtyLinks(
      specialtyIds,
      subspecialtyIds,
    );
    const hashedPassword = await hashPassword(password);
    const user = await userRepo.create({
      email,
      password: hashedPassword,
      name,
      phone,
    });

    const doctor = await doctorRepo.create(
      {
        name: user.name,
        phone: user.phone,
        email: user.email,
        userId: user.id,
        createdBy: user.id,
      },
      validSpecialtyIds,
      validSubspecialtyIds,
    );

    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const token = generateToken(payload);

    return {
      token,
      user: toAuthUser(user, doctor),
    };
  }

  async getMe(userId: string) {
    const user = await userRepo.findById(userId);
    if (!user) throw new UnauthorizedError('User not found');
    const doctor = await doctorRepo.findByUserId(userId);
    return toAuthUser(user, doctor);
  }

  async updateProfile(userId: string, input: UpdateProfileInput) {
    const user = await userRepo.findById(userId);
    if (!user) throw new UnauthorizedError('User not found');

    const userUpdate: { name?: string; phone?: string | null } = {};
    if (input.name !== undefined) userUpdate.name = input.name.trim();
    if (input.phone !== undefined) {
      const trimmed = input.phone?.trim();
      userUpdate.phone = trimmed ? trimmed : null;
    }

    if (Object.keys(userUpdate).length > 0) {
      await userRepo.update(userId, userUpdate);
    }

    let doctor = await doctorRepo.findByUserId(userId);
    const nextName = userUpdate.name ?? user.name;
    const nextPhone =
      userUpdate.phone !== undefined ? userUpdate.phone : (user.phone ?? doctor?.phone ?? null);

    if (!doctor && input.specialtyIds) {
      const { validSpecialtyIds, validSubspecialtyIds } = await resolveSpecialtyLinks(
        input.specialtyIds,
        input.subspecialtyIds,
      );
      doctor = await doctorRepo.create(
        {
          name: nextName,
          phone: nextPhone,
          email: user.email,
          userId,
        },
        validSpecialtyIds,
        validSubspecialtyIds,
      );
    } else if (doctor) {
      const doctorUpdate: { name?: string; phone?: string | null } = {};
      if (userUpdate.name !== undefined) doctorUpdate.name = userUpdate.name;
      if (userUpdate.phone !== undefined) doctorUpdate.phone = userUpdate.phone;
      if (Object.keys(doctorUpdate).length > 0) {
        await doctorRepo.update(doctor.id, doctorUpdate);
      }
      if (input.specialtyIds) {
        const validSpecialtyIds = await specialtyService.assertTopLevelSpecialtyIds(input.specialtyIds);
        const validSubspecialtyIds =
          input.subspecialtyIds !== undefined
            ? await specialtyService.assertSubspecialtyIds(input.subspecialtyIds, validSpecialtyIds)
            : await specialtyService.filterSubspecialtyIds(
                doctor.subspecialties.map((link) => link.specialtyId),
                validSpecialtyIds,
              );
        doctor = await doctorRepo.setSpecialtyLinks(
          doctor.id,
          validSpecialtyIds,
          validSubspecialtyIds,
        );
      } else {
        doctor = await doctorRepo.findByUserId(userId);
      }
    }

    const updatedUser = await userRepo.findById(userId);
    if (!updatedUser) throw new UnauthorizedError('User not found');
    return toAuthUser(updatedUser, doctor);
  }
}

export const authService = new AuthService();
