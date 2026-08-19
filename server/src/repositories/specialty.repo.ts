import { prisma } from '../utils/prisma';
import { Prisma } from '../prisma';

export class SpecialtyRepository {
  async findAll(params?: {
    parentIds?: string[];
    rootsOnly?: boolean;
    search?: string;
    skip?: number;
    take?: number;
  }) {
    const where: Prisma.SpecialtyWhereInput = {};

    if (params?.parentIds && params.parentIds.length > 0) {
      where.parentId = { in: params.parentIds };
    } else if (params?.rootsOnly) {
      where.parentId = null;
    }

    if (params?.search) {
      where.OR = [
        { name: { contains: params.search, mode: 'insensitive' } },
        { nameAr: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      prisma.specialty.findMany({
        where,
        orderBy: { name: 'asc' },
        include: { _count: { select: { doctors: true } } },
        ...(params?.skip != null ? { skip: params.skip } : {}),
        ...(params?.take != null ? { take: params.take } : {}),
      }),
      prisma.specialty.count({ where }),
    ]);

    return { data, total };
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
      where: { id: { in: ids } },
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
    return prisma.specialty.delete({ where: { id } });
  }

  async findWithOperationsCount() {
    return prisma.specialty.findMany({
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
