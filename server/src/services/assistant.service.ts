import { prisma } from '../utils/prisma';

export type AssistantBriefType = 'daily' | 'weekly';

function parseRange(start?: string, end?: string) {
  const from = start ? new Date(start) : new Date();
  const to = end ? new Date(end) : new Date(from.getTime() + 24 * 60 * 60 * 1000);
  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime()) || from >= to) throw new Error('Invalid assistant date range');
  return { from, to };
}

export class AssistantService {
  async getBrief(userId: string, type: AssistantBriefType, start?: string, end?: string) {
    const { from, to } = parseRange(start, end);
    const rangeEnd = type === 'weekly' ? new Date(from.getTime() + 7 * 24 * 60 * 60 * 1000) : to;

    const [operations, followUps, upcomingOperations, overdueFollowUps, paymentDue, newPatients] = await Promise.all([
      prisma.operation.findMany({
        where: { createdBy: userId, operationDate: { gte: from, lt: rangeEnd } },
        select: { id: true, name: true, operationDate: true, operationTime: true, operationRoom: true, status: true, patient: { select: { id: true, fullName: true } }, hospital: { select: { id: true, name: true } } },
        orderBy: [{ operationDate: 'asc' }, { operationTime: 'asc' }],
      }),
      prisma.operationFollowUp.findMany({
        where: { operation: { createdBy: userId }, scheduledAt: { gte: from, lt: rangeEnd } },
        select: { id: true, title: true, scheduledAt: true, completedAt: true, status: true, operation: { select: { id: true, name: true, patient: { select: { id: true, fullName: true } } } } },
        orderBy: { scheduledAt: 'asc' },
      }),
      prisma.operation.findMany({
        where: { createdBy: userId, operationDate: { gte: from, lt: rangeEnd }, status: { not: 'CANCELLED' } },
        select: { id: true, name: true, operationDate: true, operationTime: true, operationRoom: true, patient: { select: { fullName: true } }, hospital: { select: { name: true } } },
        orderBy: [{ operationDate: 'asc' }, { operationTime: 'asc' }],
      }),
      prisma.operationFollowUp.findMany({
        where: { operation: { createdBy: userId }, scheduledAt: { lt: from }, status: { notIn: ['COMPLETED', 'CANCELLED'] } },
        select: { id: true, title: true, scheduledAt: true, operation: { select: { id: true, patient: { select: { fullName: true } } } } },
        orderBy: { scheduledAt: 'asc' }, take: 10,
      }),
      prisma.operationCost.findMany({
        where: { operation: { createdBy: userId }, remainingAmount: { gt: 0 }, paymentStatus: { not: 'PAID' } },
        select: { operationId: true, remainingAmount: true, operation: { select: { name: true, patient: { select: { fullName: true } } } } },
        orderBy: { remainingAmount: 'desc' }, take: 10,
      }),
      prisma.patient.count({ where: { createdBy: userId, createdAt: { gte: from, lt: rangeEnd } } }),
    ]);

    const missingInformation = upcomingOperations.filter((operation) => !operation.operationTime?.trim() || !operation.operationRoom?.trim()).map((operation) => ({
      id: operation.id,
      title: !operation.operationTime?.trim() ? 'Operation time is missing' : 'Operation room is missing',
      operationName: operation.name,
      patientName: operation.patient?.fullName ?? '—',
      hospitalName: operation.hospital?.name ?? '—',
    }));
    const operationStatus = operations.reduce<Record<string, number>>((acc, operation) => { acc[operation.status] = (acc[operation.status] ?? 0) + 1; return acc; }, {});
    const followUpStatus = followUps.reduce<Record<string, number>>((acc, followUp) => { acc[followUp.status] = (acc[followUp.status] ?? 0) + 1; return acc; }, {});
    const outstandingAmount = paymentDue.reduce((sum, item) => sum + Number(item.remainingAmount ?? 0), 0);

    return {
      type,
      range: { from: from.toISOString(), to: rangeEnd.toISOString() },
      summary: {
        operations: operations.length,
        operationStatus,
        followUps: followUps.length,
        followUpStatus,
        overdueFollowUps: overdueFollowUps.length,
        paymentDue: paymentDue.length,
        outstandingAmount,
        newPatients,
        attention: missingInformation.length + overdueFollowUps.length + paymentDue.length,
      },
      operations,
      followUps,
      attention: { missingInformation, overdueFollowUps, paymentDue },
    };
  }
}

export const assistantService = new AssistantService();
