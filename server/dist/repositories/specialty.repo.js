"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.specialtyRepo = exports.SpecialtyRepository = void 0;
const prisma_1 = require("../utils/prisma");
class SpecialtyRepository {
    async findAll(params) {
        const where = { isActive: true };
        if (params?.parentIds && params.parentIds.length > 0) {
            where.parentId = { in: params.parentIds };
        }
        else if (params?.rootsOnly) {
            where.parentId = null;
        }
        if (params?.search) {
            where.OR = [
                { name: { contains: params.search, mode: 'insensitive' } },
                { nameAr: { contains: params.search, mode: 'insensitive' } },
            ];
        }
        const [data, total] = await Promise.all([
            prisma_1.prisma.specialty.findMany({
                where,
                orderBy: { name: 'asc' },
                include: { _count: { select: { doctors: true } } },
                ...(params?.skip != null ? { skip: params.skip } : {}),
                ...(params?.take != null ? { take: params.take } : {}),
            }),
            prisma_1.prisma.specialty.count({ where }),
        ]);
        return { data, total };
    }
    async findById(id) {
        return prisma_1.prisma.specialty.findUnique({
            where: { id },
            include: { _count: { select: { doctors: true } } },
        });
    }
    async findByIds(ids) {
        if (ids.length === 0)
            return [];
        return prisma_1.prisma.specialty.findMany({
            where: { id: { in: ids }, isActive: true },
        });
    }
    async findByName(name) {
        return prisma_1.prisma.specialty.findUnique({ where: { name } });
    }
    async create(data) {
        return prisma_1.prisma.specialty.create({ data });
    }
    async update(id, data) {
        return prisma_1.prisma.specialty.update({ where: { id }, data });
    }
    async delete(id) {
        return prisma_1.prisma.specialty.update({ where: { id }, data: { isActive: false } });
    }
    async findWithOperationsCount() {
        return prisma_1.prisma.specialty.findMany({
            where: { isActive: true },
            include: {
                _count: {
                    select: {
                        doctors: true,
                    },
                },
            },
            orderBy: { name: 'asc' },
        });
    }
}
exports.SpecialtyRepository = SpecialtyRepository;
exports.specialtyRepo = new SpecialtyRepository();
//# sourceMappingURL=specialty.repo.js.map