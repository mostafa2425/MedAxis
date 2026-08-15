import { prisma } from '../utils/prisma';
import { Prisma } from '@prisma/client';

export class SpecialtyRepository {
  async findAll() {
    return prisma.specialty.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
      include: { _count: { select: { doctors: true } } },
    });
  }

  async findById(id: string) {
    return prisma.specialty.findUnique({
      where: { id },
      include: { _count: { select: { doctors: true } } },
    });
  }

  async findByIds(ids: string[]) {
    if (ids.length === 0) return [];
    return prisma.specialty.findMany({
      where: { id: { in: ids }, isActive: true },
    });
  }

  async findByName(name: string) {
    return prisma.specialty.findUnique({ where: { name } });
  }

  async create(data: { name: string; nameAr?: string; icon?: string; parentId?: string }) {
    return prisma.specialty.create({ data });
  }

  async update(id: string, data: Prisma.SpecialtyUpdateInput) {
    return prisma.specialty.update({ where: { id }, data });
  }

  async delete(id: string) {
    return prisma.specialty.update({ where: { id }, data: { isActive: false } });
  }

  async findWithOperationsCount() {
    return prisma.specialty.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: {
            doctors: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });
  }
}

export const specialtyRepo = new SpecialtyRepository();
