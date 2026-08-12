import { prisma } from '../utils/prisma';
import { Prisma } from '@prisma/client';

export class HospitalRepository {
  async findAll(params: { page: number; limit: number; search?: string }) {
    const { page, limit, search } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.HospitalWhereInput = { isActive: true };
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

  async findById(id: string) {
    return prisma.hospital.findUnique({
      where: { id },
      include: { _count: { select: { operations: true } } },
    });
  }

  async findActive() {
    return prisma.hospital.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
  }

  async create(data: { name: string; address?: string; phone?: string }) {
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
