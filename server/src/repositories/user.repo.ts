import { prisma } from '../utils/prisma';
import { Prisma } from '../prisma';

const userSelect = {
  id: true,
  email: true,
  name: true,
  phone: true,
  avatarUrl: true,
  role: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
} as const;

export class UserRepository {
  async findById(id: string) {
    return prisma.user.findUnique({ where: { id }, select: userSelect });
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  async create(data: { email: string; password: string; name: string; phone?: string; role?: string }) {
    return prisma.user.create({ data });
  }

  async update(id: string, data: Prisma.UserUpdateInput) {
    return prisma.user.update({ where: { id }, data });
  }

  async findMany(params: { page: number; limit: number; search?: string }) {
    const { page, limit, search } = params;
    const skip = (page - 1) * limit;
    const where: Prisma.UserWhereInput = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }
    const [data, total] = await Promise.all([
      prisma.user.findMany({ where, skip, take: limit, select: userSelect, orderBy: { createdAt: 'desc' } }),
      prisma.user.count({ where }),
    ]);
    return { data, total };
  }
}

export const userRepo = new UserRepository();
