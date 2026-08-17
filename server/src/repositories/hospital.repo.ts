import { prisma } from '../utils/prisma';
import { Prisma } from '../prisma';

function accessibleWhere(userId: string): Prisma.HospitalWhereInput {
  return { OR: [{ createdBy: userId }, { operations: { some: { createdBy: userId } } }] };
}

const include = {
  governorate: true,
  _count: { select: { operations: true } },
};

export class HospitalRepository {
  async findAll(params: { page: number; limit: number; search?: string; governorateId?: string; userId: string }) {
    const { page, limit, search, governorateId, userId } = params;
    const skip = (page - 1) * limit;
    const where: Prisma.HospitalWhereInput = { isActive: true, AND: [accessibleWhere(userId)] };
    if (search) where.name = { contains: search, mode: 'insensitive' };
    if (governorateId) where.governorateId = governorateId;
    const [data, total] = await Promise.all([
      prisma.hospital.findMany({ where, skip, take: limit, include, orderBy: { name: 'asc' } }),
      prisma.hospital.count({ where }),
    ]);
    return { data, total };
  }
  async findById(id: string, userId: string) {
    return prisma.hospital.findFirst({ where: { id, AND: [accessibleWhere(userId)] }, include });
  }
  async findOwned(id: string, userId: string) { return prisma.hospital.findFirst({ where: { id, createdBy: userId } }); }
  async findActive(userId: string) {
    return prisma.hospital.findMany({ where: { isActive: true, AND: [accessibleWhere(userId)] }, include: { governorate: true }, orderBy: { name: 'asc' } });
  }
  async countForUser(userId: string) { return prisma.hospital.count({ where: { isActive: true, AND: [accessibleWhere(userId)] } }); }
  async create(data: { name: string; nameAr?: string; address?: string; city?: string; governorateId?: string; phone?: string; notes?: string; createdBy: string }) {
    return prisma.hospital.create({ data, include });
  }
  async update(id: string, data: Prisma.HospitalUpdateInput) { return prisma.hospital.update({ where: { id }, data, include }); }
  async delete(id: string) { return prisma.hospital.update({ where: { id }, data: { isActive: false }, include }); }
}

export const hospitalRepo = new HospitalRepository();
