import { prisma } from '../utils/prisma';

export type FollowUpStatus = 'UPCOMING' | 'COMPLETED' | 'OVERDUE' | 'CANCELLED';

function withDerivedStatus<T extends { status: string; scheduledAt: Date; completedAt: Date | null }>(item: T) {
  if (item.status === 'UPCOMING' && item.scheduledAt.getTime() < Date.now()) {
    return { ...item, status: 'OVERDUE' as FollowUpStatus };
  }
  return item;
}

export class OperationFollowUpRepository {
  async findAll(operationId: string) {
    const items = await prisma.operationFollowUp.findMany({
      where: { operationId },
      orderBy: [{ status: 'asc' }, { scheduledAt: 'asc' }],
    });
    return items.map(withDerivedStatus);
  }

  async create(operationId: string, data: { title: string; scheduledAt: Date; notes?: string | null }) {
    const item = await prisma.operationFollowUp.create({
      data: { operationId, title: data.title, scheduledAt: data.scheduledAt, notes: data.notes ?? null },
    });
    return withDerivedStatus(item);
  }

  async update(id: string, operationId: string, data: { title?: string; scheduledAt?: Date; notes?: string | null; status?: FollowUpStatus }) {
    const nextStatus = data.status;
    const completedAt = nextStatus === 'COMPLETED' ? new Date() : nextStatus === 'UPCOMING' || nextStatus === 'CANCELLED' ? null : undefined;
    const item = await prisma.operationFollowUp.update({
      where: { id, operationId },
      data: { ...data, ...(completedAt !== undefined ? { completedAt } : {}) },
    });
    return withDerivedStatus(item);
  }

  async delete(id: string, operationId: string) {
    return prisma.operationFollowUp.delete({ where: { id, operationId } });
  }
}

export const operationFollowUpRepo = new OperationFollowUpRepository();
