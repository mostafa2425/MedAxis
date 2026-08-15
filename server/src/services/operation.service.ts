import { operationRepo } from '../repositories/operation.repo';
import { operationCatalogService } from './operationCatalog.service';
import { hospitalService } from './hospital.service';
import { doctorService } from './doctor.service';
import { nurseService } from './nurse.service';
import { nurseRepo } from '../repositories/nurse.repo';
import { NotFoundError, BadRequestError } from '../utils/errors';
import { OperationStatus, FileType } from '@prisma/client';
import { normalizeOperationCost } from '../utils/operationCost';
import { mapOperationFile, toPublicFileUrl } from '../utils/operationFile';
import fs from 'fs';
import path from 'path';

type CatalogItem = {
  id: string;
  name: string;
  nameAr?: string | null;
  specialtyId?: string | null;
};

type TeamInput = {
  doctorIds?: string[];
  nurseIds?: string[];
  primarySurgeonId?: string;
  assistantSurgeonId?: string;
  anesthesiologistId?: string;
  assistantAnesthesiaId?: string;
  nurse?: string;
  notes?: string;
};

function mapOperation<T extends { files?: Array<{ filePath: string }> }>(operation: T) {
  if (!operation.files) return operation;
  return {
    ...operation,
    files: operation.files.map(mapOperationFile),
  };
}

function uniqueIds(ids: Array<string | undefined | null>): string[] {
  return [...new Set(ids.filter((id): id is string => Boolean(id)))];
}

function resolveDoctorIds(team?: TeamInput): string[] {
  if (!team) return [];
  if (team.doctorIds && team.doctorIds.length > 0) return uniqueIds(team.doctorIds);
  return uniqueIds([
    team.primarySurgeonId,
    team.assistantSurgeonId,
    team.anesthesiologistId,
    team.assistantAnesthesiaId,
  ]);
}

async function resolveNurseIds(createdBy: string, team?: TeamInput): Promise<string[]> {
  if (!team) return [];
  if (team.nurseIds && team.nurseIds.length > 0) return uniqueIds(team.nurseIds);
  const name = team.nurse?.trim();
  if (!name) return [];
  const existing = await nurseRepo.findDuplicate(createdBy, name);
  if (existing) return [existing.id];
  const created = await nurseRepo.create({ name, createdBy });
  return [created.id];
}

async function resolveProcedures(createdBy: string, operationIds: string[]) {
  const ids = uniqueIds(operationIds);
  if (ids.length === 0) throw new BadRequestError('At least one operation is required');
  const items: CatalogItem[] = [];
  for (const id of ids) {
    items.push(await operationCatalogService.assertAccessible(createdBy, id));
  }
  return items;
}

class OperationService {
  async getAll(params: {
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
    const result = await operationRepo.findAll(params);
    return {
      ...result,
      data: result.data.map((operation) => mapOperation(operation)),
    };
  }

  async getById(id: string, createdBy: string) {
    const operation = await operationRepo.findById(id, createdBy);
    if (!operation) throw new NotFoundError('Operation');
    return mapOperation(operation);
  }

  private async assertHospital(hospitalId: string, createdBy: string) {
    await hospitalService.assertAccessible(hospitalId, createdBy);
  }

  private async assertDoctors(doctorIds: string[], createdBy: string) {
    for (const id of doctorIds) {
      await doctorService.assertAccessible(id, createdBy);
    }
  }

  private async assertNurses(nurseIds: string[], createdBy: string) {
    for (const id of nurseIds) {
      await nurseService.assertAccessible(id, createdBy);
    }
  }

  private async buildTeam(createdBy: string, team?: TeamInput) {
    const doctorIds = resolveDoctorIds(team);
    const nurseIds = await resolveNurseIds(createdBy, team);
    await this.assertDoctors(doctorIds, createdBy);
    await this.assertNurses(nurseIds, createdBy);

    const firstNurse = nurseIds[0]
      ? await nurseRepo.findById(nurseIds[0], createdBy)
      : null;

    const teamMembers = [
      ...doctorIds.map((doctorId, index) => ({
        doctorId,
        nurseId: null as string | null,
        sortOrder: index,
      })),
      ...nurseIds.map((nurseId, index) => ({
        doctorId: null as string | null,
        nurseId,
        sortOrder: 100 + index,
      })),
    ];

    return {
      teamMembers,
      medicalTeam: {
        primarySurgeonId: doctorIds[0],
        assistantSurgeonId: doctorIds[1],
        anesthesiologistId: doctorIds[2],
        assistantAnesthesiaId: doctorIds[3],
        nurse: firstNurse?.name,
        notes: team?.notes,
      },
    };
  }

  async create(
    data: {
      operationId?: string;
      operationIds?: string[];
      name?: string;
      diagnosis?: string | null;
      hospitalId: string;
      operationDate: string;
      operationTime: string;
      operationRoom?: string;
      duration?: number;
      status?: OperationStatus;
      notes?: string;
      patientId: string;
      specialtyId?: string;
      medicalTeam?: TeamInput;
      cost?: {
        totalCost: number;
        paidAmount?: number;
        remainingAmount?: number;
        paymentMethod?: string;
        paymentStatus?: string;
        paymentNotes?: string;
      };
    },
    createdBy: string,
  ) {
    const operationIds = uniqueIds([...(data.operationIds ?? []), data.operationId]);
    const catalogItems = await resolveProcedures(createdBy, operationIds);
    await this.assertHospital(data.hospitalId, createdBy);
    const { teamMembers, medicalTeam } = await this.buildTeam(createdBy, data.medicalTeam);
    const first = catalogItems[0];
    const { cost, ...rest } = data;

    const operation = await operationRepo.create({
      name: catalogItems.map((item) => item.name).join(' + '),
      catalogId: first.id,
      specialtyId: first.specialtyId ?? data.specialtyId,
      diagnosis: data.diagnosis ?? null,
      hospitalId: rest.hospitalId,
      operationDate: new Date(data.operationDate),
      operationTime: data.operationTime,
      operationRoom: data.operationRoom,
      duration: data.duration,
      status: data.status || 'COMPLETED',
      notes: data.notes,
      patientId: data.patientId,
      createdBy,
      procedures: catalogItems.map((item, index) => ({
        catalogId: item.id,
        name: item.name,
        nameAr: item.nameAr ?? null,
        specialtyId: item.specialtyId ?? null,
        sortOrder: index,
      })),
      teamMembers,
      medicalTeam,
      cost: cost ? normalizeOperationCost(cost) : undefined,
    });

    await operationRepo.addTimeline(operation.id, {
      action: 'OPERATION_CREATED',
      description: `Operation "${operation.name}" created`,
      userId: createdBy,
    });

    return this.getById(operation.id, createdBy);
  }

  async update(
    id: string,
    createdBy: string,
    data: {
      operationId?: string;
      operationIds?: string[];
      name?: string;
      diagnosis?: string | null;
      hospitalId?: string;
      operationDate?: string;
      operationTime?: string;
      operationRoom?: string;
      duration?: number;
      notes?: string;
      patientId?: string;
      specialtyId?: string;
      status?: OperationStatus;
      medicalTeam?: TeamInput;
    },
  ) {
    await this.getById(id, createdBy);

    const operationIds = uniqueIds([...(data.operationIds ?? []), data.operationId]);
    const updateData: Record<string, unknown> = {
      diagnosis: data.diagnosis,
      hospitalId: data.hospitalId,
      operationTime: data.operationTime,
      operationRoom: data.operationRoom,
      duration: data.duration,
      notes: data.notes,
      patientId: data.patientId,
      specialtyId: data.specialtyId,
      status: data.status,
    };

    if (data.hospitalId) {
      await this.assertHospital(data.hospitalId, createdBy);
    }

    if (operationIds.length > 0) {
      const catalogItems = await resolveProcedures(createdBy, operationIds);
      const first = catalogItems[0];
      updateData.name = catalogItems.map((item) => item.name).join(' + ');
      updateData.catalogId = first.id;
      updateData.specialtyId = first.specialtyId ?? data.specialtyId;
      await operationRepo.replaceProcedures(
        id,
        catalogItems.map((item, index) => ({
          catalogId: item.id,
          name: item.name,
          nameAr: item.nameAr ?? null,
          specialtyId: item.specialtyId ?? null,
          sortOrder: index,
        })),
      );
    }

    if (data.medicalTeam) {
      const { teamMembers, medicalTeam } = await this.buildTeam(createdBy, data.medicalTeam);
      await operationRepo.replaceTeamMembers(id, teamMembers);
      updateData.medicalTeam = {
        deleteMany: {},
        create: medicalTeam,
      };
    }

    await operationRepo.update(id, createdBy, {
      ...Object.fromEntries(Object.entries(updateData).filter(([, value]) => value !== undefined)),
      ...(typeof data.operationDate === 'string'
        ? { operationDate: new Date(data.operationDate) }
        : {}),
    } as any);

    await operationRepo.addTimeline(id, {
      action: 'OPERATION_UPDATED',
      description: 'Operation details updated',
      userId: createdBy,
    });

    return this.getById(id, createdBy);
  }

  async updateStatus(id: string, createdBy: string, status: OperationStatus) {
    await this.getById(id, createdBy);
    const operation = await operationRepo.updateStatus(id, createdBy, status);

    await operationRepo.addTimeline(id, {
      action: 'STATUS_CHANGED',
      description: `Status changed to ${status}`,
      userId: createdBy,
    });

    return operation;
  }

  async delete(id: string, createdBy: string) {
    const operation = await this.getById(id, createdBy);

    if (operation.files && operation.files.length > 0) {
      for (const file of operation.files) {
        const filePath = path.join(process.cwd(), file.filePath);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    }

    return operationRepo.delete(id, createdBy);
  }

  async updateCost(
    id: string,
    createdBy: string,
    data: {
      totalCost: number;
      paidAmount?: number;
      remainingAmount?: number;
      paymentMethod?: string;
      paymentStatus?: string;
      paymentNotes?: string;
    },
  ) {
    await this.getById(id, createdBy);
    const cost = await operationRepo.upsertCost(id, normalizeOperationCost(data));

    await operationRepo.addTimeline(id, {
      action: 'COST_UPDATED',
      description: `Cost updated: ${data.totalCost}`,
      userId: createdBy,
    });

    return cost;
  }

  async uploadFiles(
    id: string,
    createdBy: string,
    files: Express.Multer.File[],
    fileType: FileType,
  ) {
    await this.getById(id, createdBy);

    const uploadedFiles = [];
    for (const file of files) {
      const relativePath = toPublicFileUrl(file.path);
      const operationFile = await operationRepo.addFile(id, {
        fileType,
        fileName: file.originalname,
        filePath: relativePath,
        fileSize: file.size,
        mimeType: file.mimetype,
        uploadedBy: createdBy,
      });
      uploadedFiles.push(mapOperationFile(operationFile));
    }

    await operationRepo.addTimeline(id, {
      action: 'FILES_UPLOADED',
      description: `${files.length} file(s) uploaded as ${fileType}`,
      userId: createdBy,
    });

    return uploadedFiles;
  }

  async deleteFile(operationId: string, fileId: string, createdBy: string) {
    await this.getById(operationId, createdBy);
    const file = await operationRepo.deleteFile(fileId, createdBy);
    if (!file) throw new NotFoundError('File');

    const filePath = path.join(process.cwd(), file.filePath);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return { success: true, message: 'File deleted' };
  }

  async getTimeline(operationId: string, createdBy: string) {
    await this.getById(operationId, createdBy);
    return operationRepo.getTimeline(operationId);
  }

  async getRecent(createdBy: string, limit = 5) {
    return operationRepo.getRecent(createdBy, limit);
  }
}

export const operationService = new OperationService();
