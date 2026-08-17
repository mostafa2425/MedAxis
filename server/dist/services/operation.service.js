"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.operationService = void 0;
const operation_repo_1 = require("../repositories/operation.repo");
const operationCatalog_service_1 = require("./operationCatalog.service");
const hospital_service_1 = require("./hospital.service");
const doctor_service_1 = require("./doctor.service");
const nurse_service_1 = require("./nurse.service");
const nurse_repo_1 = require("../repositories/nurse.repo");
const errors_1 = require("../utils/errors");
const operationCost_1 = require("../utils/operationCost");
const operationFile_1 = require("../utils/operationFile");
const supabaseStorage_1 = require("../utils/supabaseStorage");
function mapOperation(operation) {
    if (!operation.files)
        return operation;
    return {
        ...operation,
        files: operation.files.map(operationFile_1.mapOperationFile),
    };
}
function uniqueIds(ids) {
    return [...new Set(ids.filter((id) => Boolean(id)))];
}
function resolveDoctorIds(team) {
    if (!team)
        return [];
    if (team.doctorIds && team.doctorIds.length > 0)
        return uniqueIds(team.doctorIds);
    return uniqueIds([
        team.primarySurgeonId,
        team.assistantSurgeonId,
        team.anesthesiologistId,
        team.assistantAnesthesiaId,
    ]);
}
async function resolveNurseIds(createdBy, team) {
    if (!team)
        return [];
    if (team.nurseIds && team.nurseIds.length > 0)
        return uniqueIds(team.nurseIds);
    const name = team.nurse?.trim();
    if (!name)
        return [];
    const existing = await nurse_repo_1.nurseRepo.findDuplicate(createdBy, name);
    if (existing)
        return [existing.id];
    const created = await nurse_repo_1.nurseRepo.create({ name, createdBy });
    return [created.id];
}
async function resolveProcedures(createdBy, operationIds) {
    const ids = uniqueIds(operationIds);
    if (ids.length === 0)
        throw new errors_1.BadRequestError('At least one operation is required');
    const items = [];
    for (const id of ids) {
        items.push(await operationCatalog_service_1.operationCatalogService.assertAccessible(createdBy, id));
    }
    return items;
}
class OperationService {
    async getAll(params) {
        const result = await operation_repo_1.operationRepo.findAll(params);
        return {
            ...result,
            data: result.data.map((operation) => mapOperation(operation)),
        };
    }
    async getById(id, createdBy) {
        const operation = await operation_repo_1.operationRepo.findById(id, createdBy);
        if (!operation)
            throw new errors_1.NotFoundError('Operation');
        return mapOperation(operation);
    }
    async assertHospital(hospitalId, createdBy) {
        await hospital_service_1.hospitalService.assertAccessible(hospitalId, createdBy);
    }
    async assertDoctors(doctorIds, createdBy) {
        for (const id of doctorIds) {
            await doctor_service_1.doctorService.assertAccessible(id, createdBy);
        }
    }
    async assertNurses(nurseIds, createdBy) {
        for (const id of nurseIds) {
            await nurse_service_1.nurseService.assertAccessible(id, createdBy);
        }
    }
    async buildTeam(createdBy, team) {
        const doctorIds = resolveDoctorIds(team);
        const nurseIds = await resolveNurseIds(createdBy, team);
        await this.assertDoctors(doctorIds, createdBy);
        await this.assertNurses(nurseIds, createdBy);
        const firstNurse = nurseIds[0]
            ? await nurse_repo_1.nurseRepo.findById(nurseIds[0], createdBy)
            : null;
        const teamMembers = [
            ...doctorIds.map((doctorId, index) => ({
                doctorId,
                nurseId: null,
                sortOrder: index,
            })),
            ...nurseIds.map((nurseId, index) => ({
                doctorId: null,
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
    async create(data, createdBy) {
        const operationIds = uniqueIds([...(data.operationIds ?? []), data.operationId]);
        const catalogItems = await resolveProcedures(createdBy, operationIds);
        await this.assertHospital(data.hospitalId, createdBy);
        const { teamMembers, medicalTeam } = await this.buildTeam(createdBy, data.medicalTeam);
        const first = catalogItems[0];
        const { cost, ...rest } = data;
        const operation = await operation_repo_1.operationRepo.create({
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
            cost: cost ? (0, operationCost_1.normalizeOperationCost)(cost) : undefined,
        });
        await operation_repo_1.operationRepo.addTimeline(operation.id, {
            action: 'OPERATION_CREATED',
            description: `Operation "${operation.name}" created`,
            userId: createdBy,
        });
        return this.getById(operation.id, createdBy);
    }
    async update(id, createdBy, data) {
        await this.getById(id, createdBy);
        const operationIds = uniqueIds([...(data.operationIds ?? []), data.operationId]);
        const updateData = {
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
            await operation_repo_1.operationRepo.replaceProcedures(id, catalogItems.map((item, index) => ({
                catalogId: item.id,
                name: item.name,
                nameAr: item.nameAr ?? null,
                specialtyId: item.specialtyId ?? null,
                sortOrder: index,
            })));
        }
        if (data.medicalTeam) {
            const { teamMembers, medicalTeam } = await this.buildTeam(createdBy, data.medicalTeam);
            await operation_repo_1.operationRepo.replaceTeamMembers(id, teamMembers);
            updateData.medicalTeam = {
                deleteMany: {},
                create: medicalTeam,
            };
        }
        await operation_repo_1.operationRepo.update(id, createdBy, {
            ...Object.fromEntries(Object.entries(updateData).filter(([, value]) => value !== undefined)),
            ...(typeof data.operationDate === 'string'
                ? { operationDate: new Date(data.operationDate) }
                : {}),
        });
        await operation_repo_1.operationRepo.addTimeline(id, {
            action: 'OPERATION_UPDATED',
            description: 'Operation details updated',
            userId: createdBy,
        });
        return this.getById(id, createdBy);
    }
    async updateStatus(id, createdBy, status) {
        await this.getById(id, createdBy);
        const operation = await operation_repo_1.operationRepo.updateStatus(id, createdBy, status);
        await operation_repo_1.operationRepo.addTimeline(id, {
            action: 'STATUS_CHANGED',
            description: `Status changed to ${status}`,
            userId: createdBy,
        });
        return operation;
    }
    async delete(id, createdBy) {
        const operation = await this.getById(id, createdBy);
        if (operation.files && operation.files.length > 0) {
            for (const file of operation.files) {
                await (0, supabaseStorage_1.deleteStoredFile)(file.filePath);
            }
        }
        return operation_repo_1.operationRepo.delete(id, createdBy);
    }
    async updateCost(id, createdBy, data) {
        await this.getById(id, createdBy);
        const cost = await operation_repo_1.operationRepo.upsertCost(id, (0, operationCost_1.normalizeOperationCost)(data));
        await operation_repo_1.operationRepo.addTimeline(id, {
            action: 'COST_UPDATED',
            description: `Cost updated: ${data.totalCost}`,
            userId: createdBy,
        });
        return cost;
    }
    async uploadFiles(id, createdBy, files, fileType) {
        await this.getById(id, createdBy);
        const uploadedFiles = [];
        for (const file of files) {
            const storagePath = (0, supabaseStorage_1.createOperationStoragePath)(id, file.originalname);
            await (0, supabaseStorage_1.uploadOperationFile)(storagePath, file);
            try {
                const operationFile = await operation_repo_1.operationRepo.addFile(id, {
                    fileType,
                    fileName: file.originalname,
                    filePath: storagePath,
                    fileSize: file.size,
                    mimeType: file.mimetype,
                    uploadedBy: createdBy,
                });
                uploadedFiles.push((0, operationFile_1.mapOperationFile)(operationFile));
            }
            catch (error) {
                await (0, supabaseStorage_1.deleteStoredFile)(storagePath).catch(() => undefined);
                throw error;
            }
        }
        await operation_repo_1.operationRepo.addTimeline(id, {
            action: 'FILES_UPLOADED',
            description: `${files.length} file(s) uploaded as ${fileType}`,
            userId: createdBy,
        });
        return uploadedFiles;
    }
    async createFileUploadUrl(id, createdBy, input) {
        await this.getById(id, createdBy);
        (0, supabaseStorage_1.validateFileMetadata)(input.fileName, input.mimeType, input.fileSize);
        const storagePath = (0, supabaseStorage_1.createOperationStoragePath)(id, input.fileName);
        const signedUpload = await (0, supabaseStorage_1.createSignedUploadUrl)(storagePath, input.mimeType, input.fileSize);
        return {
            ...signedUpload,
            fileName: input.fileName,
            mimeType: input.mimeType,
            fileSize: input.fileSize,
            fileType: input.fileType,
        };
    }
    async completeFileUpload(id, createdBy, input) {
        const operation = await this.getById(id, createdBy);
        const expectedPrefix = `operations/${id}/`;
        if (!input.filePath.startsWith(expectedPrefix)) {
            throw new errors_1.BadRequestError('Invalid file path for this operation');
        }
        (0, supabaseStorage_1.validateFileMetadata)(input.fileName, input.mimeType, input.fileSize);
        await (0, supabaseStorage_1.assertStoredFileExists)(input.filePath);
        const existingFile = operation.files?.find((file) => file.filePath === input.filePath);
        if (existingFile)
            return existingFile;
        const operationFile = await operation_repo_1.operationRepo.addFile(id, {
            fileType: input.fileType,
            fileName: input.fileName,
            filePath: input.filePath,
            fileSize: input.fileSize,
            mimeType: input.mimeType,
            uploadedBy: createdBy,
        });
        await operation_repo_1.operationRepo.addTimeline(id, {
            action: 'FILES_UPLOADED',
            description: `File uploaded as ${input.fileType}`,
            userId: createdBy,
        });
        return (0, operationFile_1.mapOperationFile)(operationFile);
    }
    async getFileDownloadUrl(operationId, fileId, createdBy) {
        const operation = await operation_repo_1.operationRepo.findById(operationId, createdBy);
        if (!operation)
            throw new errors_1.NotFoundError('Operation');
        const file = operation.files?.find((item) => item.id === fileId);
        if (!file)
            throw new errors_1.NotFoundError('File');
        return (0, supabaseStorage_1.createSignedDownloadUrl)(file.filePath);
    }
    async deleteFile(operationId, fileId, createdBy) {
        const operation = await this.getById(operationId, createdBy);
        const file = operation.files?.find((item) => item.id === fileId);
        if (!file)
            throw new errors_1.NotFoundError('File');
        await (0, supabaseStorage_1.deleteStoredFile)(file.filePath);
        const deleted = await operation_repo_1.operationRepo.deleteFile(fileId, createdBy);
        if (!deleted)
            throw new errors_1.NotFoundError('File');
        return { success: true, message: 'File deleted' };
    }
    async getTimeline(operationId, createdBy) {
        await this.getById(operationId, createdBy);
        return operation_repo_1.operationRepo.getTimeline(operationId);
    }
    async getRecent(createdBy, limit = 5) {
        return operation_repo_1.operationRepo.getRecent(createdBy, limit);
    }
}
exports.operationService = new OperationService();
//# sourceMappingURL=operation.service.js.map