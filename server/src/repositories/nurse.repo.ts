import { prisma } from '../utils/prisma';
import { Prisma } from '../prisma';

export class NurseRepository {
  async findAll(params: { page: number; limit: number; search?: string; userId: string }) {
    const { page, limit, search, userId } = params;
    const skip = (page - 1) * limit;
    const where: Prisma.NurseWhereInput = { createdBy: userId, isActive: true };
    if (search) {
      const term = search.trim();
      where.OR = [
        { name: { contains: term, mode: 'insensitive' } },
        { phone: { contains: term, mode: 'insensitive' } },
        { email: { contains: term, mode: 'insensitive' } },
      ];
    }
    const [data, total] = await Promise.all([
      prisma.nurse.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: 'asc' },
      }),
      prisma.nurse.count({ where }),
    ]);
    return { data, total };
  }

  async findActive(userId: string) {
    return prisma.nurse.findMany({
      where: { createdBy: userId, isActive: true },
      orderBy: { name: 'asc' },
    });
  }

  async findById(id: string, userId: string) {
    return prisma.nurse.findFirst({ where: { id, createdBy: userId } });
  }

  async findDuplicate(userId: string, name: string, email?: string | null, excludeId?: string) {
    if (email) {
      const byEmail = await prisma.nurse.findFirst({
        where: {
          createdBy: userId,
          email: { equals: email, mode: 'insensitive' },
          ...(excludeId ? { id: { not: excludeId } } : {}),
        },
      });
      if (byEmail) return byEmail;
    }
    return prisma.nurse.findFirst({
      where: {
        createdBy: userId,
        name: { equals: name, mode: 'insensitive' },
        ...(excludeId ? { id: { not: excludeId } } : {}),
      },
    });
  }

  async countForUser(userId: string) {
    return prisma.nurse.count({ where: { createdBy: userId, isActive: true } });
  }

  async create(data: {
    name: string;
    phone?: string | null;
    email?: string | null;
    createdBy: string;
  }) {
    return prisma.nurse.create({ data });
  }

  async update(id: string, data: Prisma.NurseUpdateInput) {
    return prisma.nurse.update({ where: { id }, data });
  }

  async delete(id: string) {
    return prisma.nurse.update({ where: { id }, data: { isActive: false } });
  }
}

export const nurseRepo = new NurseRepository();
