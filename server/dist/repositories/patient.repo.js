"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.patientRepo = exports.PatientRepository = void 0;
const prisma_1 = require("../utils/prisma");
class PatientRepository {
    async findAll(params) {
        const { page, limit, search, gender, createdBy } = params;
        const skip = (page - 1) * limit;
        const where = { createdBy };
        if (search) {
            const term = search.trim();
            where.OR = [
                { fullName: { contains: term, mode: 'insensitive' } },
                { mobile: { contains: term, mode: 'insensitive' } },
                { id: { contains: term, mode: 'insensitive' } },
            ];
        }
        if (gender) {
            where.gender = gender;
        }
        const [data, total] = await Promise.all([
            prisma_1.prisma.patient.findMany({
                where,
                skip,
                take: limit,
                include: {
                    _count: { select: { operations: true } },
                },
                orderBy: { createdAt: 'desc' },
            }),
            prisma_1.prisma.patient.count({ where }),
        ]);
        return { data, total };
    }
    async findById(id, createdBy) {
        return prisma_1.prisma.patient.findFirst({
            where: { id, createdBy },
            include: {
                operations: {
                    include: {
                        hospital: true,
                        specialty: true,
                    },
                    orderBy: { operationDate: 'desc' },
                },
            },
        });
    }
    async create(data) {
        return prisma_1.prisma.patient.create({ data });
    }
    async update(id, createdBy, data) {
        return prisma_1.prisma.patient.update({
            where: { id, createdBy },
            data,
        });
    }
    async delete(id, createdBy) {
        return prisma_1.prisma.patient.delete({
            where: { id, createdBy },
        });
    }
    async findRecent(createdBy, limit = 5) {
        return prisma_1.prisma.patient.findMany({
            where: { createdBy },
            take: limit,
            orderBy: { createdAt: 'desc' },
        });
    }
    async count(createdBy) {
        return prisma_1.prisma.patient.count({ where: { createdBy } });
    }
}
exports.PatientRepository = PatientRepository;
exports.patientRepo = new PatientRepository();
//# sourceMappingURL=patient.repo.js.map