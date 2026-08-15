import { doctorRepo, type DoctorWithSpecialties } from '../repositories/doctor.repo';
import { specialtyService } from './specialty.service';
import { NotFoundError, ForbiddenError } from '../utils/errors';
import type { CreateDoctorInput, UpdateDoctorInput } from '../validators/doctor.validator';

function toSpecialtyRef(link: { specialty: { id: string; name: string; nameAr: string | null } }) {
  return {
    id: link.specialty.id,
    name: link.specialty.name,
    nameAr: link.specialty.nameAr,
  };
}

function toDoctorResponse(doctor: DoctorWithSpecialties) {
  return {
    id: doctor.id,
    name: doctor.name,
    phone: doctor.phone,
    email: doctor.email,
    isActive: doctor.isActive,
    createdAt: doctor.createdAt,
    updatedAt: doctor.updatedAt,
    specialties: doctor.specialties.map(toSpecialtyRef),
    subspecialties: doctor.subspecialties.map(toSpecialtyRef),
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

class DoctorService {
  async getAll(params: {
    page: number;
    limit: number;
    search?: string;
    specialtyId?: string;
    userId: string;
  }) {
    const { data, total } = await doctorRepo.findAll(params);
    return { data: data.map(toDoctorResponse), total };
  }

  async getActive(userId: string) {
    const doctors = await doctorRepo.findActive(userId);
    return doctors.map(toDoctorResponse);
  }

  async getById(id: string, userId: string) {
    const doctor = await doctorRepo.findById(id, userId);
    if (!doctor) throw new NotFoundError('Doctor');
    return toDoctorResponse(doctor);
  }

  async assertAccessible(id: string, userId: string) {
    await this.getById(id, userId);
  }

  async create(input: CreateDoctorInput, userId: string) {
    const { specialtyIds, subspecialtyIds, ...data } = input;
    const duplicate = await doctorRepo.findDuplicate(userId, data.email, data.name);
    if (duplicate) {
      return toDoctorResponse(duplicate);
    }
    const { validSpecialtyIds, validSubspecialtyIds } = await resolveSpecialtyLinks(
      specialtyIds,
      subspecialtyIds,
    );
    const doctor = await doctorRepo.create(
      {
        name: data.name,
        phone: data.phone ?? null,
        email: data.email ?? null,
        createdBy: userId,
      },
      validSpecialtyIds,
      validSubspecialtyIds,
    );
    return toDoctorResponse(doctor);
  }

  async update(id: string, userId: string, input: UpdateDoctorInput) {
    const owned = await doctorRepo.findOwned(id, userId);
    if (!owned) throw new NotFoundError('Doctor');
    const { specialtyIds, subspecialtyIds, ...data } = input;

    if (Object.keys(data).length > 0) {
      await doctorRepo.update(id, data);
    }

    if (specialtyIds !== undefined || subspecialtyIds !== undefined) {
      const current = await doctorRepo.findById(id, userId);
      const nextSpecialtyIds =
        specialtyIds ?? current?.specialties.map((link) => link.specialtyId) ?? [];
      const nextSubspecialtyIds =
        subspecialtyIds ?? current?.subspecialties.map((link) => link.specialtyId) ?? [];
      const { validSpecialtyIds, validSubspecialtyIds } = await resolveSpecialtyLinks(
        nextSpecialtyIds,
        nextSubspecialtyIds,
      );
      const doctor = await doctorRepo.setSpecialtyLinks(id, validSpecialtyIds, validSubspecialtyIds);
      if (!doctor) throw new NotFoundError('Doctor');
      return toDoctorResponse(doctor);
    }

    return this.getById(id, userId);
  }

  async delete(id: string, userId: string) {
    const owned = await doctorRepo.findOwned(id, userId);
    if (!owned) throw new NotFoundError('Doctor');
    if (owned.userId === userId) {
      throw new ForbiddenError('Cannot remove your own doctor profile');
    }
    return doctorRepo.delete(id);
  }
}

export const doctorService = new DoctorService();
