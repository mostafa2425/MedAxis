"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRepo = exports.UserRepository = void 0;
const prisma_1 = require("../utils/prisma");
class UserRepository {
    async findById(id) {
        return prisma_1.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                name: true,
                phone: true,
                role: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }
    async findByEmail(email) {
        return prisma_1.prisma.user.findUnique({ where: { email } });
    }
    async create(data) {
        return prisma_1.prisma.user.create({ data });
    }
    async update(id, data) {
        return prisma_1.prisma.user.update({ where: { id }, data });
    }
    async findMany(params) {
        const { page, limit, search } = params;
        const skip = (page - 1) * limit;
        const where = {};
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
            ];
        }
        const [data, total] = await Promise.all([
            prisma_1.prisma.user.findMany({
                where,
                skip,
                take: limit,
                select: {
                    id: true,
                    email: true,
                    name: true,
                    phone: true,
                    role: true,
                    isActive: true,
                    createdAt: true,
                    updatedAt: true,
                },
                orderBy: { createdAt: 'desc' },
            }),
            prisma_1.prisma.user.count({ where }),
        ]);
        return { data, total };
    }
}
exports.UserRepository = UserRepository;
exports.userRepo = new UserRepository();
//# sourceMappingURL=user.repo.js.map