import { prisma } from '../utils/prisma';
import { Prisma } from '@prisma/client';

export class DoctorRepository {
  async findAll(params: { page: number; limit: number; search?: string; specialtyId?: string }) {
    const { page, limit, search, specialtyId } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.DoctorWhereInput = { isActive: true };
    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }
    if (specialtyId) {
      where.specialties = { some: { specialtyId } };
    }

    const [data, total] = await Promise.all([
      prisma.doctor.findMany({
        where,
        skip,
        take: limit,
        include: {
          specialties: {
            include: { specialty: true },
          },
        },
        orderBy: { name: 'asc' },
      }),
      prisma.doctor.count({ where }),
    ]);

    return { data, total };
  }

  async findActive() {
    return prisma.doctor.findMany({
      where: { isActive: true },
      include: {
        specialties: { include: { specialty: true } },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findById(id: string) {
    return prisma.doctor.findUnique({
      where: { id },
      include: {
        specialties: { include: { specialty: true } },
      },
    });
  }

  async create(data: { name: string; phone?: string; email?: string }, specialtyIds?: string[]) {
    return prisma.doctor.create({
      data: {
        ...data,
        ...(specialtyIds && specialtyIds.length > 0
          ? {
              specialties: {
                create: specialtyIds.map((sid) => ({ specialtyId: sid })),
              },
            }
          : {}),
      },
      include: { specialties: { include: { specialty: true } } },
    });
  }

  async update(id: string, data: Prisma.DoctorUpdateInput) {
    return prisma.doctor.update({ where: { id }, data });
  }

  async delete(id: string) {
    return prisma.doctor.update({ where: { id }, data: { isActive: false } });
  }

  async setSpecialties(doctorId: string, specialtyIds: string[]) {
    await prisma.doctorSpecialty.deleteMany({ where: { doctorId } });
    if (specialtyIds.length > 0) {
      await prisma.doctorSpecialty.createMany({
        data: specialtyIds.map((specialtyId) => ({ doctorId, specialtyId })),
      });
    }
    return this.findById(doctorId);
  }
}

export const doctorRepo = new DoctorRepository();
