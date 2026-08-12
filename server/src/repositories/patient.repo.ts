import { prisma } from '../utils/prisma';
import { Prisma } from '@prisma/client';

export class PatientRepository {
  async findAll(params: {
    page: number;
    limit: number;
    search?: string;
    gender?: 'MALE' | 'FEMALE';
    createdBy: string;
  }) {
    const { page, limit, search, gender, createdBy } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.PatientWhereInput = { createdBy };
    if (search) {
      where.fullName = { contains: search, mode: 'insensitive' };
    }
    if (gender) {
      where.gender = gender;
    }

    const [data, total] = await Promise.all([
      prisma.patient.findMany({
        where,
        skip,
        take: limit,
        include: {
          _count: { select: { operations: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.patient.count({ where }),
    ]);

    return { data, total };
  }

  async findById(id: string, createdBy: string) {
    return prisma.patient.findFirst({
      where: { id, createdBy },
      include: {
        operations: {
          include: {
            hospital: true,
            specialty: true,
          },
          orderBy: { operationDate: 'desc' },
        },
      },
    });
  }

  async create(data: {
    fullName: string;
    age: number;
    gender?: 'MALE' | 'FEMALE';
    mobile?: string;
    notes?: string;
    createdBy: string;
  }) {
    return prisma.patient.create({ data });
  }

  async update(id: string, createdBy: string, data: Prisma.PatientUpdateInput) {
    return prisma.patient.update({
      where: { id, createdBy },
      data,
    });
  }

  async delete(id: string, createdBy: string) {
    return prisma.patient.delete({
      where: { id, createdBy },
    });
  }

  async findRecent(createdBy: string, limit = 5) {
    return prisma.patient.findMany({
      where: { createdBy },
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  }
}

export const patientRepo = new PatientRepository();
