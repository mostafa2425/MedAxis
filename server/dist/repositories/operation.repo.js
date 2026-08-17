"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.operationRepo = exports.OperationRepository = void 0;
const prisma_1 = require("../utils/prisma");
const operationInclude_1 = require("./operationInclude");
class OperationRepository {
    async findAll(params) {
        const { page, limit, search, status, specialtyId, hospitalId, dateFrom, dateTo, sortBy = 'operationDate', sortOrder = 'desc', createdBy } = params;
        const skip = (page - 1) * limit;
        const where = { createdBy };
        if (search)
            where.OR = [{ name: { contains: search, mode: 'insensitive' } }, { diagnosis: { contains: search, mode: 'insensitive' } }, { patient: { fullName: { contains: search, mode: 'insensitive' } } }];
        if (status)
            where.status = status;
        if (specialtyId)
            where.specialtyId = specialtyId;
        if (hospitalId)
            where.hospitalId = hospitalId;
        if (dateFrom || dateTo) {
            where.operationDate = {};
            if (dateFrom)
                where.operationDate.gte = new Date(dateFrom);
            if (dateTo)
                where.operationDate.lte = new Date(dateTo);
        }
        const orderBy = {};
        if (sortBy === 'name')
            orderBy.name = sortOrder;
        else if (sortBy === 'duration')
            orderBy.duration = sortOrder;
        else if (sortBy === 'createdAt')
            orderBy.createdAt = sortOrder;
        else
            orderBy.operationDate = sortOrder;
        const [data, total] = await Promise.all([prisma_1.prisma.operation.findMany({ where, skip, take: limit, include: operationInclude_1.operationListInclude, orderBy }), prisma_1.prisma.operation.count({ where })]);
        return { data, total };
    }
    async findById(id, createdBy) { return prisma_1.prisma.operation.findFirst({ where: { id, createdBy }, include: operationInclude_1.operationDetailInclude }); }
    async create(data) {
        const { medicalTeam, cost, procedures, teamMembers, ...operationData } = data;
        return prisma_1.prisma.operation.create({
            data: {
                ...operationData,
                diagnosis: operationData.diagnosis ?? null,
                ...(procedures?.length ? { procedures: { create: procedures.map((procedure) => ({ catalogId: procedure.catalogId ?? null, name: procedure.name, nameAr: procedure.nameAr ?? null, specialtyId: procedure.specialtyId ?? null, sortOrder: procedure.sortOrder })) } } : {}),
                ...(teamMembers?.length ? { teamMembers: { create: teamMembers.map((member) => ({ doctorId: member.doctorId ?? null, nurseId: member.nurseId ?? null, sortOrder: member.sortOrder })) } } : {}),
                ...(medicalTeam ? { medicalTeam: { create: medicalTeam } } : {}),
                ...(cost ? { cost: { create: { totalCost: cost.totalCost, paidAmount: cost.paidAmount ?? 0, remainingAmount: cost.remainingAmount ?? (cost.totalCost - (cost.paidAmount ?? 0)), hospitalCost: cost.hospitalCost ?? 0, nursingCost: cost.nursingCost ?? 0, assistantDoctorsCost: cost.assistantDoctorsCost ?? 0, equipmentCost: cost.equipmentCost ?? 0, otherCost: cost.otherCost ?? 0, paymentMethod: cost.paymentMethod, paymentStatus: cost.paymentStatus, paymentNotes: cost.paymentNotes } } } : {}),
            },
            include: operationInclude_1.operationListInclude,
        });
    }
    async replaceProcedures(operationId, procedures) { await prisma_1.prisma.$transaction([prisma_1.prisma.operationProcedure.deleteMany({ where: { operationId } }), prisma_1.prisma.operationProcedure.createMany({ data: procedures.map((procedure) => ({ operationId, catalogId: procedure.catalogId ?? null, name: procedure.name, nameAr: procedure.nameAr ?? null, specialtyId: procedure.specialtyId ?? null, sortOrder: procedure.sortOrder })) })]); }
    async replaceTeamMembers(operationId, members) { await prisma_1.prisma.$transaction([prisma_1.prisma.operationTeamMember.deleteMany({ where: { operationId } }), ...(members.length ? [prisma_1.prisma.operationTeamMember.createMany({ data: members.map((member) => ({ operationId, doctorId: member.doctorId ?? null, nurseId: member.nurseId ?? null, sortOrder: member.sortOrder })) })] : [])]); }
    async update(id, createdBy, data) { return prisma_1.prisma.operation.update({ where: { id, createdBy }, data, include: operationInclude_1.operationListInclude }); }
    async updateStatus(id, createdBy, status) { return prisma_1.prisma.operation.update({ where: { id, createdBy }, data: { status } }); }
    async delete(id, createdBy) { return prisma_1.prisma.operation.delete({ where: { id, createdBy } }); }
    async upsertCost(operationId, data) { return prisma_1.prisma.operationCost.upsert({ where: { operationId }, update: data, create: { operationId, totalCost: data.totalCost, paidAmount: data.paidAmount ?? 0, remainingAmount: data.remainingAmount ?? (data.totalCost - (data.paidAmount ?? 0)), hospitalCost: data.hospitalCost ?? 0, nursingCost: data.nursingCost ?? 0, assistantDoctorsCost: data.assistantDoctorsCost ?? 0, equipmentCost: data.equipmentCost ?? 0, otherCost: data.otherCost ?? 0, paymentMethod: data.paymentMethod, paymentStatus: data.paymentStatus, paymentNotes: data.paymentNotes } }); }
    async addFile(operationId, data) { return prisma_1.prisma.operationFile.create({ data: { operationId, ...data } }); }
    async deleteFile(fileId, uploadedBy) { const file = await prisma_1.prisma.operationFile.findFirst({ where: { id: fileId, operation: { createdBy: uploadedBy } } }); if (!file)
        return null; return prisma_1.prisma.operationFile.delete({ where: { id: fileId } }); }
    async addTimeline(operationId, data) { return prisma_1.prisma.operationTimeline.create({ data: { operationId, ...data } }); }
    async getTimeline(operationId) { return prisma_1.prisma.operationTimeline.findMany({ where: { operationId }, include: { user: { select: { id: true, name: true } } }, orderBy: { createdAt: 'desc' } }); }
    async getRecent(createdBy, limit = 5) { return prisma_1.prisma.operation.findMany({ where: { createdBy }, take: limit, include: { patient: true, hospital: true, specialty: true, cost: true }, orderBy: { createdAt: 'desc' } }); }
    async countThisMonth(createdBy) { const start = new Date(); start.setDate(1); start.setHours(0, 0, 0, 0); return prisma_1.prisma.operation.count({ where: { createdBy, operationDate: { gte: start } } }); }
    async countByStatus(createdBy) { const result = await prisma_1.prisma.operation.groupBy({ by: ['status'], where: { createdBy }, _count: { status: true } }); return result.reduce((acc, item) => { acc[item.status] = item._count.status; return acc; }, {}); }
    async countBySpecialty(createdBy) { const result = await prisma_1.prisma.operation.groupBy({ by: ['specialtyId'], where: { createdBy, specialtyId: { not: null } }, _count: { specialtyId: true } }); const specialties = await prisma_1.prisma.specialty.findMany({ where: { id: { in: result.map((r) => r.specialtyId) } }, select: { id: true, name: true } }); const specialtyMap = new Map(specialties.map((s) => [s.id, s.name])); return result.map((r) => ({ specialtyId: r.specialtyId, specialtyName: specialtyMap.get(r.specialtyId) || 'Unknown', count: r._count.specialtyId })); }
    async getMonthlyTrends(createdBy, months = 12) { const startDate = new Date(); startDate.setMonth(startDate.getMonth() - months); startDate.setDate(1); const operations = await prisma_1.prisma.operation.findMany({ where: { createdBy, operationDate: { gte: startDate } }, select: { operationDate: true, status: true }, orderBy: { operationDate: 'asc' } }); const monthlyData = {}; for (const op of operations) {
        const key = `${op.operationDate.getFullYear()}-${String(op.operationDate.getMonth() + 1).padStart(2, '0')}`;
        if (!monthlyData[key])
            monthlyData[key] = { month: op.operationDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short' }), total: 0, completed: 0 };
        monthlyData[key].total++;
        if (op.status === 'COMPLETED')
            monthlyData[key].completed++;
    } return Object.entries(monthlyData).sort(([a], [b]) => a.localeCompare(b)).map(([, val]) => val); }
    async getTotalRevenue(createdBy) { const costs = await prisma_1.prisma.operationCost.findMany({ where: { operation: { createdBy } }, select: { totalCost: true, paidAmount: true, remainingAmount: true } }); return { totalCost: costs.reduce((sum, c) => sum + Number(c.totalCost), 0), totalPaid: costs.reduce((sum, c) => sum + Number(c.paidAmount), 0), totalRemaining: costs.reduce((sum, c) => sum + Number(c.remainingAmount), 0) }; }
    async exportData(params) { const { status, specialtyId, hospitalId, dateFrom, dateTo, createdBy } = params; const where = { createdBy }; if (status)
        where.status = status; if (specialtyId)
        where.specialtyId = specialtyId; if (hospitalId)
        where.hospitalId = hospitalId; if (dateFrom || dateTo) {
        where.operationDate = {};
        if (dateFrom)
            where.operationDate.gte = new Date(dateFrom);
        if (dateTo)
            where.operationDate.lte = new Date(dateTo);
    } return prisma_1.prisma.operation.findMany({ where, include: { patient: { select: { fullName: true, age: true, gender: true, mobile: true } }, hospital: { select: { name: true } }, specialty: { select: { name: true } }, cost: true, medicalTeam: { include: { primarySurgeon: { select: { name: true } }, assistantSurgeon: { select: { name: true } }, anesthesiologist: { select: { name: true } } } } }, orderBy: { operationDate: 'desc' } }); }
}
exports.OperationRepository = OperationRepository;
exports.operationRepo = new OperationRepository();
//# sourceMappingURL=operation.repo.js.map