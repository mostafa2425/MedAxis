import { operationRepo } from '../repositories/operation.repo';
import { NotFoundError } from '../utils/errors';
import { OperationStatus, FileType, TimelineAction } from '@prisma/client';
import fs from 'fs';
import path from 'path';

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
    return operationRepo.findAll(params);
  }

  async getById(id: string, createdBy: string) {
    const operation = await operationRepo.findById(id, createdBy);
    if (!operation) throw new NotFoundError('Operation');
    return operation;
  }

  async create(
    data: {
      name: string;
      diagnosis: string;
      hospitalId: string;
      operationDate: string;
      operationTime: string;
      operationRoom?: string;
      duration?: number;
      status?: OperationStatus;
      notes?: string;
      patientId: string;
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
    },
    createdBy: string,
  ) {
    const operation = await operationRepo.create({
      ...data,
      operationDate: new Date(data.operationDate),
      status: data.status || 'COMPLETED',
      createdBy,
    });

    await operationRepo.addTimeline(operation.id, {
      action: 'OPERATION_CREATED',
      description: `Operation "${data.name}" created`,
      userId: createdBy,
    });

    return operation;
  }

  async update(
    id: string,
    createdBy: string,
    data: {
      name?: string;
      diagnosis?: string;
      hospitalId?: string;
      operationDate?: string;
      operationTime?: string;
      operationRoom?: string;
      duration?: number;
      notes?: string;
      patientId?: string;
      specialtyId?: string;
    },
  ) {
    await this.getById(id, createdBy);
    const operation = await operationRepo.update(id, createdBy, {
      ...data,
      ...(data.operationDate && { operationDate: new Date(data.operationDate) }),
    } as any);

    await operationRepo.addTimeline(id, {
      action: 'OPERATION_UPDATED',
      description: 'Operation details updated',
      userId: createdBy,
    });

    return operation;
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

    // Delete associated files from disk
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
    const cost = await operationRepo.upsertCost(id, data);

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
      const operationFile = await operationRepo.addFile(id, {
        fileType: fileType as any,
        fileName: file.originalname,
        filePath: file.path.replace(process.cwd(), ''),
        fileSize: file.size,
        mimeType: file.mimetype,
        uploadedBy: createdBy,
      });
      uploadedFiles.push(operationFile);
    }

    await operationRepo.addTimeline(id, {
      action: 'FILES_UPLOADED',
      description: `${files.length} file(s) uploaded as ${fileType}`,
      userId: createdBy,
    });

    return uploadedFiles;
  }

  async deleteFile(operationId: string, fileId: string, createdBy: string) {
    const file = await operationRepo.deleteFile(fileId, createdBy);
    if (!file) throw new NotFoundError('File');

    // Delete from disk
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
