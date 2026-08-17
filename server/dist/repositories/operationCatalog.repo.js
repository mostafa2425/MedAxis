"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.operationCatalogRepo = exports.OperationCatalogRepository = void 0;
const prisma_1 = require("../utils/prisma");
const catalogInclude = {
    specialty: {
        select: { id: true, name: true, nameAr: true, parentId: true },
    },
    subspecialty: {
        select: { id: true, name: true, nameAr: true, parentId: true },
    },
};
class OperationCatalogRepository {
    async findAccessible(params) {
        const { specialtyIds, userId } = params;
        const or = [
            {
                isCustom: true,
                createdBy: userId,
            },
        ];
        if (specialtyIds.length > 0) {
            or.unshift({
                isCustom: false,
                OR: [
                    { specialtyId: { in: specialtyIds } },
                    { specialtyId: null, subspecialty: { parentId: { in: specialtyIds } } },
                ],
            });
        }
        return prisma_1.prisma.operationCatalog.findMany({
            where: {
                isActive: true,
                OR: or,
            },
            include: catalogInclude,
            orderBy: [{ isCustom: 'asc' }, { name: 'asc' }],
        });
    }
    async findById(id) {
        return prisma_1.prisma.operationCatalog.findUnique({
            where: { id },
            include: catalogInclude,
        });
    }
    async findCommonByName(name, specialtyId) {
        return prisma_1.prisma.operationCatalog.findFirst({
            where: {
                name: { equals: name, mode: 'insensitive' },
                specialtyId,
                isCustom: false,
            },
            include: catalogInclude,
        });
    }
    async findCustomByName(userId, name) {
        return prisma_1.prisma.operationCatalog.findFirst({
            where: {
                createdBy: userId,
                isCustom: true,
                name: { equals: name, mode: 'insensitive' },
            },
            include: catalogInclude,
        });
    }
    async create(data) {
        return prisma_1.prisma.operationCatalog.create({
            data: {
                name: data.name,
                nameAr: data.nameAr ?? null,
                specialtyId: data.specialtyId ?? null,
                subspecialtyId: data.subspecialtyId ?? null,
                isCustom: data.isCustom ?? false,
                createdBy: data.createdBy ?? null,
            },
            include: catalogInclude,
        });
    }
}
exports.OperationCatalogRepository = OperationCatalogRepository;
exports.operationCatalogRepo = new OperationCatalogRepository();
//# sourceMappingURL=operationCatalog.repo.js.map