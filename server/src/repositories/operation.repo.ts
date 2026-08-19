import { prisma } from '../utils/prisma';
import { Prisma, OperationStatus } from '../prisma';
import { operationDetailInclude, operationListInclude } from './operationInclude';

type CostData = {
  totalCost: number;
  paidAmount?: number;
  remainingAmount?: number;
  hospitalCost?: number;
  nursingCost?: number;
  assistantDoctorsCost?: number;
  equipmentCost?: number;
  otherCost?: number;
  paymentMethod?: string;
  paymentStatus?: string;
  paymentNotes?: string;
};

export class OperationRepository {
  async findAll(params: { page: number; limit: number; search?: string; status?: OperationStatus; specialtyId?: string; hospitalId?: string; dateFrom?: string; dateTo?: string; sortBy?: string; sortOrder?: 'asc' | 'desc'; createdBy: string }) {
    const { page, limit, search, status, specialtyId, hospitalId, dateFrom, dateTo, sortBy = 'operationDate', sortOrder = 'desc', createdBy } = params;
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
      prisma.operation.findMany({ where, skip, take: limit, include: operationListInclude, orderBy }),
      prisma.operation.count({ where }),
    ]);
    return { data, total };
  }

  async findById(id: string, createdBy: string) {
    return prisma.operation.findFirst({ where: { id, createdBy }, include: operationDetailInclude });
  }

  async create(data: { name: string; diagnosis?: string | null; hospitalId: string; operationDate: Date; operationTime: string; operationRoom?: string; duration?: number; status?: OperationStatus; notes?: string; patientId: string; createdBy: string; specialtyId?: string | null; catalogId?: string | null; procedures?: Array<{ catalogId?: string | null; name: string; nameAr?: string | null; specialtyId?: string | null; sortOrder: number }>; teamMembers?: Array<{ doctorId?: string | null; nurseId?: string | null; sortOrder: number }>; medicalTeam?: { primarySurgeonId?: string; assistantSurgeonId?: string; anesthesiologistId?: string; assistantAnesthesiaId?: string; nurse?: string; notes?: string }; cost?: CostData }) {
    const { medicalTeam, cost, procedures, teamMembers, ...operationData } = data;
    return prisma.operation.create({
      data: {
        ...operationData,
        diagnosis: operationData.diagnosis ?? null,
        ...(procedures?.length
          ? {
              procedures: {
                create: procedures.map((procedure) => ({
                  catalogId: procedure.catalogId ?? null,
                  name: procedure.name,
                  nameAr: procedure.nameAr ?? null,
                  specialtyId: procedure.specialtyId ?? null,
                  sortOrder: procedure.sortOrder,
                })),
              },
            }
          : {}),
        ...(teamMembers?.length
          ? {
              teamMembers: {
                create: teamMembers.map((member) => ({
                  doctorId: member.doctorId ?? null,
                  nurseId: member.nurseId ?? null,
                  sortOrder: member.sortOrder,
                })),
              },
            }
          : {}),
        ...(medicalTeam ? { medicalTeam: { create: medicalTeam } } : {}),
        ...(cost
          ? {
              cost: {
                create: {
                  totalCost: cost.totalCost,
                  paidAmount: cost.paidAmount ?? 0,
                  remainingAmount: cost.remainingAmount ?? (cost.totalCost - (cost.paidAmount ?? 0)),
                  hospitalCost: cost.hospitalCost ?? 0,
                  nursingCost: cost.nursingCost ?? 0,
                  assistantDoctorsCost: cost.assistantDoctorsCost ?? 0,
                  equipmentCost: cost.equipmentCost ?? 0,
                  otherCost: cost.otherCost ?? 0,
                  paymentMethod: cost.paymentMethod as any,
                  paymentStatus: cost.paymentStatus as any,
                  paymentNotes: cost.paymentNotes,
                },
              },
            }
          : {}),
      },
      include: operationListInclude,
    });
  }

  async replaceProcedures(operationId: string, procedures: Array<{ catalogId?: string | null; name: string; nameAr?: string | null; specialtyId?: string | null; sortOrder: number }>) {
    await prisma.$transaction([
      prisma.operationProcedure.deleteMany({ where: { operationId } }),
      prisma.operationProcedure.createMany({
        data: procedures.map((procedure) => ({
          operationId,
          catalogId: procedure.catalogId ?? null,
          name: procedure.name,
          nameAr: procedure.nameAr ?? null,
          specialtyId: procedure.specialtyId ?? null,
          sortOrder: procedure.sortOrder,
        })),
      }),
    ]);
  }

  async replaceTeam(operationId: string, teamMembers: Array<{ doctorId?: string | null; nurseId?: string | null; sortOrder: number }>) {
    await prisma.$transaction([
      prisma.operationTeamMember.deleteMany({ where: { operationId } }),
      prisma.operationTeamMember.createMany({
        data: teamMembers.map((member) => ({
          operationId,
          doctorId: member.doctorId ?? null,
          nurseId: member.nurseId ?? null,
          sortOrder: member.sortOrder,
        })),
      }),
    ]);
  }

  async update(id: string, createdBy: string, data: Prisma.OperationUpdateInput) {
    return prisma.operation.update({ where: { id, createdBy }, data });
  }

  async delete(id: string, createdBy: string) {
    return prisma.operation.delete({ where: { id, createdBy } });
  }

  async upsertCost(operationId: string, data: CostData) {
    return prisma.operationCost.upsert({
      where: { operationId },
      update: data as any,
      create: {
        operationId,
        totalCost: data.totalCost,
        paidAmount: data.paidAmount ?? 0,
        remainingAmount: data.remainingAmount ?? (data.totalCost - (data.paidAmount ?? 0)),
        hospitalCost: data.hospitalCost ?? 0,
        nursingCost: data.nursingCost ?? 0,
        assistantDoctorsCost: data.assistantDoctorsCost ?? 0,
        equipmentCost: data.equipmentCost ?? 0,
        otherCost: data.otherCost ?? 0,
        paymentMethod: data.paymentMethod as any,
        paymentStatus: data.paymentStatus as any,
        paymentNotes: data.paymentNotes,
      },
    });
  }

  async addFile(operationId: string, data: { fileType: string; fileName: string; filePath: string; fileSize?: number; mimeType?: string; uploadedBy: string }) {
    // The established database has a required storagePath column while the
    // application contract exposes filePath. Keep both values synchronized
    // without forcing a destructive Prisma schema re-introspection.
    const rows = await prisma.$queryRaw<Array<Record<string, unknown>>>(Prisma.sql`
      INSERT INTO "operation_files"
        ("id", "operationId", "fileType", "fileName", "filePath", "storagePath", "fileSize", "mimeType", "uploadedBy", "createdAt")
      VALUES
        (gen_random_uuid(), ${operationId}, ${data.fileType}::"FileType", ${data.fileName}, ${data.filePath}, ${data.filePath}, ${data.fileSize ?? null}, ${data.mimeType ?? null}, ${data.uploadedBy}, now())
      RETURNING *
    `);
    return rows[0];
  }

  async deleteFile(fileId: string, uploadedBy: string) {
    const file = await prisma.operationFile.findFirst({ where: { id: fileId, operation: { createdBy: uploadedBy } } });
    if (!file) return null;
    return prisma.operationFile.delete({ where: { id: fileId } });
  }

  async addTimeline(operationId: string, data: { action: string; description?: string; userId: string; status?: string }) {
    const status = data.status ?? data.action;
    const rows = await prisma.$queryRaw<Array<Record<string, unknown>>>(Prisma.sql`
      INSERT INTO "operation_timeline" ("id", "operationId", "action", "status", "description", "userId", "createdAt", "occurredAt")
      VALUES (gen_random_uuid(), ${operationId}, ${data.action}::"TimelineAction", ${status}, ${data.description ?? null}, ${data.userId}, now(), now())
      RETURNING *
    `);
    return rows[0];
  }

  async getTimeline(operationId: string) {
    return prisma.operationTimeline.findMany({
      where: { operationId },
      include: { user: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getRecent(createdBy: string, limit = 5) {
    return prisma.operation.findMany({
      where: { createdBy },
      take: limit,
      include: { patient: true, hospital: true, specialty: true, cost: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async countThisMonth(createdBy: string) {
    const start = new Date();
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
    return prisma.operation.count({ where: { createdBy, operationDate: { gte: start } } });
  }

  async countByStatus(createdBy: string) {
    const result = await prisma.operation.groupBy({ by: ['status'], where: { createdBy }, _count: { status: true } });
    return result.reduce((acc, item) => {
      acc[item.status] = item._count.status;
      return acc;
    }, {} as Record<string, number>);
  }

  async countBySpecialty(createdBy: string) {
    const result = await prisma.operation.groupBy({ by: ['specialtyId'], where: { createdBy, specialtyId: { not: null } }, _count: { specialtyId: true } });
    const specialties = await prisma.specialty.findMany({
      where: { id: { in: result.map((r) => r.specialtyId!) } },
      select: { id: true, name: true },
    });
    const specialtyMap = new Map(specialties.map((s) => [s.id, s.name]));
    return result.map((r) => ({ specialtyId: r.specialtyId!, specialtyName: specialtyMap.get(r.specialtyId!) || 'Unknown', count: r._count.specialtyId }));
  }

  async monthlyTrends(createdBy: string, months = 12) {
    const start = new Date();
    start.setMonth(start.getMonth() - (months - 1), 1);
    start.setHours(0, 0, 0, 0);
    const operations = await prisma.operation.findMany({ where: { createdBy, operationDate: { gte: start } }, select: { operationDate: true, status: true } });
    const result: Array<{ month: string; total: number; completed: number }> = [];
    for (let i = 0; i < months; i++) {
      const date = new Date(start);
      date.setMonth(start.getMonth() + i);
      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthOps = operations.filter((op) => `${op.operationDate.getFullYear()}-${String(op.operationDate.getMonth() + 1).padStart(2, '0')}` === month);
      result.push({ month, total: monthOps.length, completed: monthOps.filter((op) => op.status === 'COMPLETED').length });
    }
    return result;
  }

  async revenue(createdBy: string) {
    const result = await prisma.operationCost.aggregate({ where: { operation: { createdBy } }, _sum: { totalCost: true, paidAmount: true, remainingAmount: true } });
    return { totalCost: result._sum.totalCost || 0, totalPaid: result._sum.paidAmount || 0, totalRemaining: result._sum.remainingAmount || 0 };
  }
}

export const operationRepo = new OperationRepository();
