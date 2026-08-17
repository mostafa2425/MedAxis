"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hospitalRepo = exports.HospitalRepository = void 0;
const prisma_1 = require("../utils/prisma");
function accessibleWhere(userId) {
    return { OR: [{ createdBy: userId }, { operations: { some: { createdBy: userId } } }] };
}
const include = {
    governorate: true,
    _count: { select: { operations: true } },
};
class HospitalRepository {
    async findAll(params) {
        const { page, limit, search, governorateId, userId } = params;
        const skip = (page - 1) * limit;
        const where = { isActive: true, AND: [accessibleWhere(userId)] };
        if (search)
            where.name = { contains: search, mode: 'insensitive' };
        if (governorateId)
            where.governorateId = governorateId;
        const [data, total] = await Promise.all([
            prisma_1.prisma.hospital.findMany({ where, skip, take: limit, include, orderBy: { name: 'asc' } }),
            prisma_1.prisma.hospital.count({ where }),
        ]);
        return { data, total };
    }
    async findById(id, userId) {
        return prisma_1.prisma.hospital.findFirst({ where: { id, AND: [accessibleWhere(userId)] }, include });
    }
    async findOwned(id, userId) { return prisma_1.prisma.hospital.findFirst({ where: { id, createdBy: userId } }); }
    async findActive(userId) {
        return prisma_1.prisma.hospital.findMany({ where: { isActive: true, AND: [accessibleWhere(userId)] }, include: { governorate: true }, orderBy: { name: 'asc' } });
    }
    async countForUser(userId) { return prisma_1.prisma.hospital.count({ where: { isActive: true, AND: [accessibleWhere(userId)] } }); }
    async create(data) {
        return prisma_1.prisma.hospital.create({ data, include });
    }
    async update(id, data) { return prisma_1.prisma.hospital.update({ where: { id }, data, include }); }
    async delete(id) { return prisma_1.prisma.hospital.update({ where: { id }, data: { isActive: false }, include }); }
}
exports.HospitalRepository = HospitalRepository;
exports.hospitalRepo = new HospitalRepository();
//# sourceMappingURL=hospital.repo.js.map