import { prisma } from '../utils/prisma';
import { Prisma, OperationStatus } from '@prisma/client';

export class OperationRepository {
  async findAll(params: {
    page: number;
    limit: number;
    search?: string;
    status?: OperationStatus;
    specialtyId?: string;
    hospitalId?: string;
    dateFrom?: string;
    dateTo?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    createdBy: string;
  }) {
    const {
      page, limit, search, status, specialtyId, hospitalId,
      dateFrom, dateTo, sortBy = 'operationDate', sortOrder = 'desc', createdBy,
    } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.OperationWhereInput = { createdBy };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { diagnosis: { contains: search, mode: 'insensitive' } },
        { patient: { fullName: { contains: search, mode: 'insensitive' } } },
      ];
    }
    if (status) where.status = status;
    if (specialtyId) where.specialtyId = specialtyId;
    if (hospitalId) where.hospitalId = hospitalId;
    if (dateFrom || dateTo) {
      where.operationDate = {};
      if (dateFrom) (where.operationDate as { gte?: Date }).gte = new Date(dateFrom);
      if (dateTo) (where.operationDate as { lte?: Date }).lte = new Date(dateTo);
    }

    const orderBy: Prisma.OperationOrderByWithRelationInput = {};
    if (sortBy === 'name') orderBy.name = sortOrder;
    else if (sortBy === 'duration') orderBy.duration = sortOrder;
    else if (sortBy === 'createdAt') orderBy.createdAt = sortOrder;
    else orderBy.operationDate = sortOrder;

    const [data, total] = await Promise.all([
      prisma.operation.findMany({
        where,
        skip,
        take: limit,
        include: {
          patient: true,
          hospital: true,
          specialty: true,
          medicalTeam: {
            include: {
              primarySurgeon: true,
              assistantSurgeon: true,
              anesthesiologist: true,
              assistantAnesthesia: true,
            },
          },
          cost: true,
          files: {
            select: { id: true, fileType: true, fileName: true, filePath: true, fileSize: true, createdAt: true },
          },
        },
        orderBy,
      }),
      prisma.operation.count({ where }),
    ]);

    return { data, total };
  }

  async findById(id: string, createdBy: string) {
    return prisma.operation.findFirst({
      where: { id, createdBy },
      include: {
        patient: true,
        hospital: true,
        specialty: true,
        creator: {
          select: { id: true, name: true, email: true },
        },
        medicalTeam: {
          include: {
            primarySurgeon: true,
            assistantSurgeon: true,
            anesthesiologist: true,
            assistantAnesthesia: true,
          },
        },
        cost: true,
        files: {
          include: {
            uploader: { select: { id: true, name: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
        timeline: {
          include: {
            user: { select: { id: true, name: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  async create(data: {
    name: string;
    diagnosis: string;
    hospitalId: string;
    operationDate: Date;
    operationTime: string;
    operationRoom?: string;
    duration?: number;
    status?: OperationStatus;
    notes?: string;
    patientId: string;
    createdBy: string;
    specialtyId?: string;
    medicalTeam?: {
      primarySurgeonId?: string;
      assistantSurgeonId?: string;
      anesthesiologistId?: string;
      assistantAnesthesiaId?: string;
      nurse?: string;
      notes?: string;
    };
    cost?: {
      totalCost: number;
      paidAmount?: number;
      remainingAmount?: number;
      paymentMethod?: string;
      paymentStatus?: string;
      paymentNotes?: string;
    };
  }) {
    const {
      medicalTeam, cost, ...operationData
    } = data;

    return prisma.operation.create({
      data: {
        ...operationData,
        ...(medicalTeam && {
          medicalTeam: { create: medicalTeam },
        }),
        ...(cost && {
          cost: {
            create: {
              totalCost: cost.totalCost,
              paidAmount: cost.paidAmount ?? 0,
              remainingAmount: cost.remainingAmount ?? (cost.totalCost - (cost.paidAmount ?? 0)),
              paymentMethod: cost.paymentMethod as any,
              paymentStatus: cost.paymentStatus as any,
              paymentNotes: cost.paymentNotes,
            },
          },
        }),
      },
      include: {
        patient: true,
        hospital: true,
        specialty: true,
        medicalTeam: {
          include: {
            primarySurgeon: true,
            assistantSurgeon: true,
            anesthesiologist: true,
            assistantAnesthesia: true,
          },
        },
        cost: true,
      },
    });
  }

  async update(id: string, createdBy: string, data: Prisma.OperationUpdateInput) {
    return prisma.operation.update({
      where: { id, createdBy },
      data,
      include: {
        patient: true,
        hospital: true,
        specialty: true,
        medicalTeam: {
          include: {
            primarySurgeon: true,
            assistantSurgeon: true,
            anesthesiologist: true,
            assistantAnesthesia: true,
          },
        },
        cost: true,
      },
    });
  }

  async updateStatus(id: string, createdBy: string, status: OperationStatus) {
    return prisma.operation.update({
      where: { id, createdBy },
      data: { status },
    });
  }

  async delete(id: string, createdBy: string) {
    return prisma.operation.delete({
      where: { id, createdBy },
    });
  }

  async upsertCost(operationId: string, data: {
    totalCost: number;
    paidAmount?: number;
    remainingAmount?: number;
    paymentMethod?: string;
    paymentStatus?: string;
    paymentNotes?: string;
  }) {
    return prisma.operationCost.upsert({
      where: { operationId },
      update: data as any,
      create: {
        operationId,
        totalCost: data.totalCost,
        paidAmount: data.paidAmount ?? 0,
        remainingAmount: data.remainingAmount ?? (data.totalCost - (data.paidAmount ?? 0)),
        paymentMethod: data.paymentMethod as any,
        paymentStatus: data.paymentStatus as any,
        paymentNotes: data.paymentNotes,
      },
    });
  }

  async addFile(operationId: string, data: {
    fileType: string;
    fileName: string;
    filePath: string;
    fileSize?: number;
    mimeType?: string;
    uploadedBy: string;
  }) {
    return prisma.operationFile.create({
      data: { operationId, ...data } as any,
    });
  }

  async deleteFile(fileId: string, uploadedBy: string) {
    const file = await prisma.operationFile.findFirst({
      where: { id: fileId, uploadedBy },
    });
    if (!file) return null;
    return prisma.operationFile.delete({ where: { id: fileId } });
  }

  async addTimeline(operationId: string, data: {
    action: string;
    description?: string;
    userId: string;
  }) {
    return prisma.operationTimeline.create({
      data: { operationId, ...data } as any,
    });
  }

  async getTimeline(operationId: string) {
    return prisma.operationTimeline.findMany({
      where: { operationId },
      include: {
        user: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getRecent(createdBy: string, limit = 5) {
    return prisma.operation.findMany({
      where: { createdBy },
      take: limit,
      include: {
        patient: true,
        hospital: true,
        specialty: true,
        cost: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async countByStatus(createdBy: string) {
    const result = await prisma.operation.groupBy({
      by: ['status'],
      where: { createdBy },
      _count: { status: true },
    });
    return result.reduce((acc, item) => {
      acc[item.status] = item._count.status;
      return acc;
    }, {} as Record<string, number>);
  }

  async countBySpecialty(createdBy: string) {
    const result = await prisma.operation.groupBy({
      by: ['specialtyId'],
      where: { createdBy, specialtyId: { not: null } },
      _count: { specialtyId: true },
    });

    const specialties = await prisma.specialty.findMany({
      where: { id: { in: result.map((r) => r.specialtyId!) } },
      select: { id: true, name: true },
    });

    const specialtyMap = new Map(specialties.map((s) => [s.id, s.name]));

    return result.map((r) => ({
      specialtyId: r.specialtyId,
      specialtyName: specialtyMap.get(r.specialtyId!) || 'Unknown',
      count: r._count.specialtyId,
    }));
  }

  async getMonthlyTrends(createdBy: string, months = 12) {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);
    startDate.setDate(1);

    const operations = await prisma.operation.findMany({
      where: {
        createdBy,
        operationDate: { gte: startDate },
      },
      select: { operationDate: true, status: true },
      orderBy: { operationDate: 'asc' },
    });

    const monthlyData: Record<string, { month: string; total: number; completed: number }> = {};

    for (const op of operations) {
      const key = `${op.operationDate.getFullYear()}-${String(op.operationDate.getMonth() + 1).padStart(2, '0')}`;
      if (!monthlyData[key]) {
        monthlyData[key] = {
          month: op.operationDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short' }),
          total: 0,
          completed: 0,
        };
      }
      monthlyData[key].total++;
      if (op.status === 'COMPLETED') monthlyData[key].completed++;
    }

    return Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, val]) => val);
  }

  async getTotalRevenue(createdBy: string) {
    const costs = await prisma.operationCost.findMany({
      where: { operation: { createdBy } },
      select: { totalCost: true, paidAmount: true, remainingAmount: true },
    });
    return {
      totalCost: costs.reduce((sum, c) => sum + Number(c.totalCost), 0),
      totalPaid: costs.reduce((sum, c) => sum + Number(c.paidAmount), 0),
      totalRemaining: costs.reduce((sum, c) => sum + Number(c.remainingAmount), 0),
    };
  }

  async exportData(params: {
    status?: OperationStatus;
    specialtyId?: string;
    hospitalId?: string;
    dateFrom?: string;
    dateTo?: string;
    createdBy: string;
  }) {
    const { status, specialtyId, hospitalId, dateFrom, dateTo, createdBy } = params;

    const where: Prisma.OperationWhereInput = { createdBy };
    if (status) where.status = status;
    if (specialtyId) where.specialtyId = specialtyId;
    if (hospitalId) where.hospitalId = hospitalId;
    if (dateFrom || dateTo) {
      where.operationDate = {};
      if (dateFrom) (where.operationDate as { gte?: Date }).gte = new Date(dateFrom);
      if (dateTo) (where.operationDate as { lte?: Date }).lte = new Date(dateTo);
    }

    return prisma.operation.findMany({
      where,
      include: {
        patient: { select: { fullName: true, age: true, gender: true, mobile: true } },
        hospital: { select: { name: true } },
        specialty: { select: { name: true } },
        cost: true,
        medicalTeam: {
          include: {
            primarySurgeon: { select: { name: true } },
            assistantSurgeon: { select: { name: true } },
            anesthesiologist: { select: { name: true } },
          },
        },
      },
      orderBy: { operationDate: 'desc' },
    });
  }
}

export const operationRepo = new OperationRepository();
