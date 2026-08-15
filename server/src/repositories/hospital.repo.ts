import { prisma } from '../utils/prisma';
import { Prisma } from '@prisma/client';

function accessibleWhere(userId: string): Prisma.HospitalWhereInput {
  return {
    OR: [
      { createdBy: userId },
      { operations: { some: { createdBy: userId } } },
    ],
  };
}

export class HospitalRepository {
  async findAll(params: {
    page: number;
    limit: number;
    search?: string;
    userId: string;
  }) {
    const { page, limit, search, userId } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.HospitalWhereInput = {
      isActive: true,
      AND: [accessibleWhere(userId)],
    };
    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }

    const [data, total] = await Promise.all([
      prisma.hospital.findMany({
        where,
        skip,
        take: limit,
        include: {
          _count: { select: { operations: true } },
        },
        orderBy: { name: 'asc' },
      }),
      prisma.hospital.count({ where }),
    ]);

    return { data, total };
  }

  async findById(id: string, userId: string) {
    return prisma.hospital.findFirst({
      where: { id, AND: [accessibleWhere(userId)] },
      include: { _count: { select: { operations: true } } },
    });
  }

  async findOwned(id: string, userId: string) {
    return prisma.hospital.findFirst({
      where: { id, createdBy: userId },
    });
  }

  async findActive(userId: string) {
    return prisma.hospital.findMany({
      where: { isActive: true, AND: [accessibleWhere(userId)] },
      orderBy: { name: 'asc' },
    });
  }

  async countForUser(userId: string) {
    return prisma.hospital.count({
      where: { isActive: true, AND: [accessibleWhere(userId)] },
    });
  }

  async create(data: { name: string; address?: string; phone?: string; createdBy: string }) {
    return prisma.hospital.create({ data });
  }

  async update(id: string, data: Prisma.HospitalUpdateInput) {
    return prisma.hospital.update({ where: { id }, data });
  }

  async delete(id: string) {
    return prisma.hospital.update({
      where: { id },
      data: { isActive: false },
    });
  }
}

export const hospitalRepo = new HospitalRepository();
