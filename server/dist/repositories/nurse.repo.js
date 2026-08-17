"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nurseRepo = exports.NurseRepository = void 0;
const prisma_1 = require("../utils/prisma");
class NurseRepository {
    async findAll(params) {
        const { page, limit, search, userId } = params;
        const skip = (page - 1) * limit;
        const where = { createdBy: userId, isActive: true };
        if (search) {
            const term = search.trim();
            where.OR = [
                { name: { contains: term, mode: 'insensitive' } },
                { phone: { contains: term, mode: 'insensitive' } },
                { email: { contains: term, mode: 'insensitive' } },
            ];
        }
        const [data, total] = await Promise.all([
            prisma_1.prisma.nurse.findMany({
                where,
                skip,
                take: limit,
                orderBy: { name: 'asc' },
            }),
            prisma_1.prisma.nurse.count({ where }),
        ]);
        return { data, total };
    }
    async findActive(userId) {
        return prisma_1.prisma.nurse.findMany({
            where: { createdBy: userId, isActive: true },
            orderBy: { name: 'asc' },
        });
    }
    async findById(id, userId) {
        return prisma_1.prisma.nurse.findFirst({ where: { id, createdBy: userId } });
    }
    async findDuplicate(userId, name, email, excludeId) {
        if (email) {
            const byEmail = await prisma_1.prisma.nurse.findFirst({
                where: {
                    createdBy: userId,
                    email: { equals: email, mode: 'insensitive' },
                    ...(excludeId ? { id: { not: excludeId } } : {}),
                },
            });
            if (byEmail)
                return byEmail;
        }
        return prisma_1.prisma.nurse.findFirst({
            where: {
                createdBy: userId,
                name: { equals: name, mode: 'insensitive' },
                ...(excludeId ? { id: { not: excludeId } } : {}),
            },
        });
    }
    async countForUser(userId) {
        return prisma_1.prisma.nurse.count({ where: { createdBy: userId, isActive: true } });
    }
    async create(data) {
        return prisma_1.prisma.nurse.create({ data });
    }
    async update(id, data) {
        return prisma_1.prisma.nurse.update({ where: { id }, data });
    }
    async delete(id) {
        return prisma_1.prisma.nurse.update({ where: { id }, data: { isActive: false } });
    }
}
exports.NurseRepository = NurseRepository;
exports.nurseRepo = new NurseRepository();
//# sourceMappingURL=nurse.repo.js.map