"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.doctorRepo = exports.DoctorRepository = void 0;
exports.accessibleDoctorWhere = accessibleDoctorWhere;
const prisma_1 = require("../utils/prisma");
const doctorInclude = {
    specialties: {
        include: { specialty: true },
        orderBy: { specialty: { name: 'asc' } },
    },
    subspecialties: {
        include: { specialty: true },
        orderBy: { specialty: { name: 'asc' } },
    },
};
function accessibleDoctorWhere(userId) {
    return {
        OR: [
            { createdBy: userId },
            { userId },
            { teamMembers: { some: { operation: { createdBy: userId } } } },
            { primarySurgeon: { some: { operation: { createdBy: userId } } } },
            { assistant: { some: { operation: { createdBy: userId } } } },
            { anesthesiologist: { some: { operation: { createdBy: userId } } } },
            { assistantAnesthesia: { some: { operation: { createdBy: userId } } } },
        ],
    };
}
class DoctorRepository {
    async findAll(params) {
        const { page, limit, search, specialtyId, userId } = params;
        const skip = (page - 1) * limit;
        const where = {
            isActive: true,
            AND: [accessibleDoctorWhere(userId)],
        };
        if (search) {
            const term = search.trim();
            where.OR = [
                { name: { contains: term, mode: 'insensitive' } },
                { phone: { contains: term, mode: 'insensitive' } },
                { email: { contains: term, mode: 'insensitive' } },
            ];
            where.AND = [
                accessibleDoctorWhere(userId),
                {
                    OR: [
                        { name: { contains: term, mode: 'insensitive' } },
                        { phone: { contains: term, mode: 'insensitive' } },
                        { email: { contains: term, mode: 'insensitive' } },
                    ],
                },
            ];
            delete where.OR;
        }
        if (specialtyId) {
            const specialtyFilter = {
                OR: [
                    { specialties: { some: { specialtyId } } },
                    { subspecialties: { some: { specialtyId } } },
                ],
            };
            where.AND = [...(Array.isArray(where.AND) ? where.AND : where.AND ? [where.AND] : []), specialtyFilter];
        }
        const [data, total] = await Promise.all([
            prisma_1.prisma.doctor.findMany({
                where,
                skip,
                take: limit,
                include: doctorInclude,
                orderBy: { name: 'asc' },
            }),
            prisma_1.prisma.doctor.count({ where }),
        ]);
        return { data, total };
    }
    async findActive(userId) {
        return prisma_1.prisma.doctor.findMany({
            where: { isActive: true, AND: [accessibleDoctorWhere(userId)] },
            include: doctorInclude,
            orderBy: { name: 'asc' },
        });
    }
    async findById(id, userId) {
        return prisma_1.prisma.doctor.findFirst({
            where: userId ? { id, AND: [accessibleDoctorWhere(userId)] } : { id },
            include: doctorInclude,
        });
    }
    async findOwned(id, userId) {
        return prisma_1.prisma.doctor.findFirst({
            where: {
                id,
                OR: [{ createdBy: userId }, { userId }],
            },
            include: doctorInclude,
        });
    }
    async findByUserId(userId) {
        return prisma_1.prisma.doctor.findUnique({
            where: { userId },
            include: doctorInclude,
        });
    }
    async findDuplicate(userId, email, name, excludeId) {
        if (email) {
            return prisma_1.prisma.doctor.findFirst({
                where: {
                    createdBy: userId,
                    email: { equals: email, mode: 'insensitive' },
                    ...(excludeId ? { id: { not: excludeId } } : {}),
                },
                include: doctorInclude,
            });
        }
        if (name) {
            return prisma_1.prisma.doctor.findFirst({
                where: {
                    createdBy: userId,
                    name: { equals: name, mode: 'insensitive' },
                    ...(excludeId ? { id: { not: excludeId } } : {}),
                },
                include: doctorInclude,
            });
        }
        return null;
    }
    async countForUser(userId) {
        return prisma_1.prisma.doctor.count({
            where: { isActive: true, AND: [accessibleDoctorWhere(userId)] },
        });
    }
    async create(data, specialtyIds, subspecialtyIds) {
        const uniqueSpecialtyIds = [...new Set(specialtyIds ?? [])];
        const uniqueSubspecialtyIds = [...new Set(subspecialtyIds ?? [])];
        return prisma_1.prisma.doctor.create({
            data: {
                name: data.name,
                phone: data.phone ?? null,
                email: data.email ?? null,
                userId: data.userId ?? null,
                createdBy: data.createdBy ?? data.userId ?? null,
                ...(uniqueSpecialtyIds.length > 0
                    ? {
                        specialties: {
                            create: uniqueSpecialtyIds.map((specialtyId) => ({ specialtyId })),
                        },
                    }
                    : {}),
                ...(uniqueSubspecialtyIds.length > 0
                    ? {
                        subspecialties: {
                            create: uniqueSubspecialtyIds.map((specialtyId) => ({ specialtyId })),
                        },
                    }
                    : {}),
            },
            include: doctorInclude,
        });
    }
    async update(id, data) {
        return prisma_1.prisma.doctor.update({
            where: { id },
            data: {
                ...(data.name !== undefined && { name: data.name }),
                ...(data.phone !== undefined && { phone: data.phone }),
                ...(data.email !== undefined && { email: data.email }),
            },
            include: doctorInclude,
        });
    }
    async delete(id) {
        return prisma_1.prisma.doctor.update({ where: { id }, data: { isActive: false } });
    }
    async setSpecialtyLinks(doctorId, specialtyIds, subspecialtyIds) {
        const uniqueSpecialtyIds = [...new Set(specialtyIds)];
        const uniqueSubspecialtyIds = [...new Set(subspecialtyIds)];
        await prisma_1.prisma.$transaction(async (tx) => {
            await tx.doctorSpecialty.deleteMany({ where: { doctorId } });
            await tx.doctorSubspecialty.deleteMany({ where: { doctorId } });
            if (uniqueSpecialtyIds.length > 0) {
                await tx.doctorSpecialty.createMany({
                    data: uniqueSpecialtyIds.map((specialtyId) => ({ doctorId, specialtyId })),
                });
            }
            if (uniqueSubspecialtyIds.length > 0) {
                await tx.doctorSubspecialty.createMany({
                    data: uniqueSubspecialtyIds.map((specialtyId) => ({ doctorId, specialtyId })),
                });
            }
        });
        return this.findById(doctorId);
    }
}
exports.DoctorRepository = DoctorRepository;
exports.doctorRepo = new DoctorRepository();
//# sourceMappingURL=doctor.repo.js.map