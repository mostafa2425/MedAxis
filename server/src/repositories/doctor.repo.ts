import { prisma } from '../utils/prisma';
import { Prisma } from '../prisma';

const doctorInclude = {
  user: { select: { id: true, avatarUrl: true } },
  specialties: { include: { specialty: true }, orderBy: { specialty: { name: 'asc' as const } } },
  subspecialties: { include: { specialty: true }, orderBy: { specialty: { name: 'asc' as const } } },
} satisfies Prisma.DoctorInclude;
export type DoctorWithSpecialties = Prisma.DoctorGetPayload<{ include: typeof doctorInclude }>;

export function accessibleDoctorWhere(userId: string): Prisma.DoctorWhereInput {
  return { OR: [
    { createdBy: userId }, { userId },
    { teamMembers: { some: { operation: { createdBy: userId } } } },
    { primarySurgeon: { some: { operation: { createdBy: userId } } } },
    { assistant: { some: { operation: { createdBy: userId } } } },
    { anesthesiologist: { some: { operation: { createdBy: userId } } } },
    { assistantAnesthesia: { some: { operation: { createdBy: userId } } } },
  ] };
}

export class DoctorRepository {
  async findAll(params: { page: number; limit: number; search?: string; specialtyId?: string; userId: string }) {
    const { page, limit, search, specialtyId, userId } = params;
    const skip = (page - 1) * limit;
    const where: Prisma.DoctorWhereInput = { isActive: true, AND: [accessibleDoctorWhere(userId)] };
    if (search) {
      const term = search.trim();
      where.AND = [accessibleDoctorWhere(userId), { OR: [
        { name: { contains: term, mode: 'insensitive' } },
        { phone: { contains: term, mode: 'insensitive' } },
        { email: { contains: term, mode: 'insensitive' } },
      ] }];
    }
    if (specialtyId) where.AND = [...(Array.isArray(where.AND) ? where.AND : []), { OR: [{ specialties: { some: { specialtyId } } }, { subspecialties: { some: { specialtyId } } }] }];
    const [data, total] = await Promise.all([
      prisma.doctor.findMany({ where, skip, take: limit, include: doctorInclude, orderBy: { name: 'asc' } }),
      prisma.doctor.count({ where }),
    ]);
    return { data, total };
  }
  async findActive(userId: string) { return prisma.doctor.findMany({ where: { isActive: true, AND: [accessibleDoctorWhere(userId)] }, include: doctorInclude, orderBy: { name: 'asc' } }); }
  async findById(id: string, userId?: string) { return prisma.doctor.findFirst({ where: userId ? { id, AND: [accessibleDoctorWhere(userId)] } : { id }, include: doctorInclude }); }
  async findOwned(id: string, userId: string) { return prisma.doctor.findFirst({ where: { id, OR: [{ createdBy: userId }, { userId }] }, include: doctorInclude }); }
  async findByUserId(userId: string) { return prisma.doctor.findUnique({ where: { userId }, include: doctorInclude }); }
  async findDuplicate(userId: string, email?: string | null, name?: string, excludeId?: string) {
    if (email) return prisma.doctor.findFirst({ where: { createdBy: userId, email: { equals: email, mode: 'insensitive' }, ...(excludeId ? { id: { not: excludeId } } : {}) }, include: doctorInclude });
    if (name) return prisma.doctor.findFirst({ where: { createdBy: userId, name: { equals: name, mode: 'insensitive' }, ...(excludeId ? { id: { not: excludeId } } : {}) }, include: doctorInclude });
    return null;
  }
  async countForUser(userId: string) { return prisma.doctor.count({ where: { isActive: true, AND: [accessibleDoctorWhere(userId)] } }); }
  async create(data: { name: string; phone?: string | null; email?: string | null; userId?: string | null; createdBy?: string | null }, specialtyIds?: string[], subspecialtyIds?: string[]) {
    const uniqueSpecialtyIds = [...new Set(specialtyIds ?? [])];
    const uniqueSubspecialtyIds = [...new Set(subspecialtyIds ?? [])];
    return prisma.doctor.create({ data: { name: data.name, phone: data.phone ?? null, email: data.email ?? null, userId: data.userId ?? null, createdBy: data.createdBy ?? data.userId ?? null, ...(uniqueSpecialtyIds.length ? { specialties: { create: uniqueSpecialtyIds.map((specialtyId) => ({ specialtyId })) } } : {}), ...(uniqueSubspecialtyIds.length ? { subspecialties: { create: uniqueSubspecialtyIds.map((specialtyId) => ({ specialtyId })) } } : {}) }, include: doctorInclude });
  }
  async update(id: string, data: { name?: string; phone?: string | null; email?: string | null }) { return prisma.doctor.update({ where: { id }, data, include: doctorInclude }); }
  async delete(id: string) { return prisma.doctor.update({ where: { id }, data: { isActive: false } }); }
  async setSpecialtyLinks(doctorId: string, specialtyIds: string[], subspecialtyIds: string[]) {
    const uniqueSpecialtyIds = [...new Set(specialtyIds)]; const uniqueSubspecialtyIds = [...new Set(subspecialtyIds)];
    await prisma.$transaction(async (tx) => {
      await tx.doctorSpecialty.deleteMany({ where: { doctorId } }); await tx.doctorSubspecialty.deleteMany({ where: { doctorId } });
      if (uniqueSpecialtyIds.length) await tx.doctorSpecialty.createMany({ data: uniqueSpecialtyIds.map((specialtyId) => ({ doctorId, specialtyId })) });
      if (uniqueSubspecialtyIds.length) await tx.doctorSubspecialty.createMany({ data: uniqueSubspecialtyIds.map((specialtyId) => ({ doctorId, specialtyId })) });
    });
    return this.findById(doctorId);
  }
}
export const doctorRepo = new DoctorRepository();
