import { prisma } from '../utils/prisma';
import { Prisma } from '../prisma';

export class PatientRepository {
  async findAll(params: {
    page: number;
    limit: number;
    search?: string;
    gender?: 'MALE' | 'FEMALE';
    surgicalProcedureId?: string;
    createdBy: string;
  }) {
    const { page, limit, search, gender, surgicalProcedureId, createdBy } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.PatientWhereInput = { createdBy };
    if (search) {
      const term = search.trim();
      where.OR = [
        { fullName: { contains: term, mode: 'insensitive' } },
        { mobile: { contains: term, mode: 'insensitive' } },
        { id: { contains: term, mode: 'insensitive' } },
      ];
    }
    if (gender) where.gender = gender;
    if (surgicalProcedureId) {
      where.operations = {
        some: {
          createdBy,
          OR: [
            { catalogId: surgicalProcedureId },
            { procedures: { some: { catalogId: surgicalProcedureId } } },
          ],
        },
      };
    }

    const [data, total] = await Promise.all([
      prisma.patient.findMany({
        where,
        skip,
        take: limit,
        include: { _count: { select: { operations: true } } },
        orderBy: { updatedAt: 'desc' },
      }),
      prisma.patient.count({ where }),
    ]);

    if (data.length === 0) return { data: [], total };

    const patientIds = data.map((patient) => patient.id);
    const operations = await prisma.operation.findMany({
      where: { patientId: { in: patientIds }, createdBy },
      select: {
        id: true,
        patientId: true,
        name: true,
        operationDate: true,
        status: true,
        followUps: {
          select: { status: true, scheduledAt: true },
          orderBy: { scheduledAt: 'asc' },
        },
        _count: { select: { files: true } },
      },
      orderBy: { operationDate: 'desc' },
    });

    const operationsByPatient = new Map<string, typeof operations>();
    for (const operation of operations) {
      const current = operationsByPatient.get(operation.patientId) ?? [];
      current.push(operation);
      operationsByPatient.set(operation.patientId, current);
    }

    const enriched = data.map((patient) => {
      const patientOperations = operationsByPatient.get(patient.id) ?? [];
      const upcomingFollowUps = patientOperations.reduce(
        (count, operation) =>
          count + operation.followUps.filter(
            (followUp) => followUp.status === 'UPCOMING' || followUp.status === 'OVERDUE',
          ).length,
        0,
      );

      return {
        ...patient,
        management: {
          totalOperations: patientOperations.length,
          completedOperations: patientOperations.filter((item) => item.status === 'COMPLETED').length,
          activeOperations: patientOperations.filter(
            (item) => item.status === 'SCHEDULED' || item.status === 'IN_PROGRESS',
          ).length,
          cancelledOperations: patientOperations.filter((item) => item.status === 'CANCELLED').length,
          upcomingFollowUps,
          clinicalFiles: patientOperations.reduce((count, item) => count + item._count.files, 0),
          lastOperation: patientOperations[0]
            ? {
                id: patientOperations[0].id,
                name: patientOperations[0].name,
                operationDate: patientOperations[0].operationDate,
                status: patientOperations[0].status,
              }
            : null,
        },
      };
    });

    return { data: enriched, total };
  }

  async findById(id: string, createdBy: string) {
    return prisma.patient.findFirst({
      where: { id, createdBy },
      include: {
        _count: { select: { operations: true } },
        operations: {
          where: { createdBy },
          include: {
            hospital: true,
            specialty: true,
            cost: true,
            files: { orderBy: { createdAt: 'desc' } },
            followUps: { orderBy: { scheduledAt: 'asc' } },
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
    return prisma.patient.update({ where: { id, createdBy }, data });
  }

  async delete(id: string, createdBy: string) {
    return prisma.patient.delete({ where: { id, createdBy } });
  }

  async findRecent(createdBy: string, limit = 5) {
    return prisma.patient.findMany({
      where: { createdBy },
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  }

  async count(createdBy: string) {
    return prisma.patient.count({ where: { createdBy } });
  }
}

export const patientRepo = new PatientRepository();
