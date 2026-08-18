import { NotFoundError, BadRequestError } from '../utils/errors';
import { operationRepo } from '../repositories/operation.repo';
import { operationFollowUpRepo, FollowUpStatus } from '../repositories/operationFollowUp.repo';

const ALLOWED_STATUSES: FollowUpStatus[] = ['UPCOMING', 'COMPLETED', 'OVERDUE', 'CANCELLED'];

function assertStatus(status?: string): FollowUpStatus | undefined {
  if (status === undefined) return undefined;
  if (!ALLOWED_STATUSES.includes(status as FollowUpStatus)) throw new BadRequestError('Invalid follow-up status');
  return status as FollowUpStatus;
}

export class OperationFollowUpService {
  async assertOperation(operationId: string, createdBy: string) {
    const operation = await operationRepo.findById(operationId, createdBy);
    if (!operation) throw new NotFoundError('Operation');
    return operation;
  }

  async list(operationId: string, createdBy: string) {
    await this.assertOperation(operationId, createdBy);
    return operationFollowUpRepo.findAll(operationId);
  }

  async create(operationId: string, createdBy: string, input: { title: string; scheduledAt: string; notes?: string }) {
    await this.assertOperation(operationId, createdBy);
    const title = input.title?.trim();
    if (!title) throw new BadRequestError('Follow-up title is required');
    const scheduledAt = new Date(input.scheduledAt);
    if (Number.isNaN(scheduledAt.getTime())) throw new BadRequestError('Invalid follow-up date');
    return operationFollowUpRepo.create(operationId, { title, scheduledAt, notes: input.notes?.trim() || null });
  }

  async update(operationId: string, followUpId: string, createdBy: string, input: { title?: string; scheduledAt?: string; notes?: string | null; status?: string }) {
    await this.assertOperation(operationId, createdBy);
    const data: { title?: string; scheduledAt?: Date; notes?: string | null; status?: FollowUpStatus } = {};
    if (input.title !== undefined) {
      const title = input.title.trim();
      if (!title) throw new BadRequestError('Follow-up title is required');
      data.title = title;
    }
    if (input.scheduledAt !== undefined) {
      const date = new Date(input.scheduledAt);
      if (Number.isNaN(date.getTime())) throw new BadRequestError('Invalid follow-up date');
      data.scheduledAt = date;
    }
    if (input.notes !== undefined) data.notes = input.notes?.trim() || null;
    data.status = assertStatus(input.status);
    if (Object.keys(data).every((key) => (data as any)[key] === undefined)) throw new BadRequestError('No follow-up changes supplied');
    return operationFollowUpRepo.update(followUpId, operationId, data);
  }

  async remove(operationId: string, followUpId: string, createdBy: string) {
    await this.assertOperation(operationId, createdBy);
    return operationFollowUpRepo.delete(followUpId, operationId);
  }
}

export const operationFollowUpService = new OperationFollowUpService();
