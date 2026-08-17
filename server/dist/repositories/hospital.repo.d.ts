import { Prisma } from '../prisma';
export declare class HospitalRepository {
    findAll(params: {
        page: number;
        limit: number;
        search?: string;
        userId: string;
    }): Promise<{
        data: ({
            _count: {
                operations: number;
            };
        } & {
            id: string;
            name: string;
            address: string | null;
            phone: string | null;
            isActive: boolean;
            createdBy: string | null;
            createdAt: Date;
            updatedAt: Date;
        })[];
        total: number;
    }>;
    findById(id: string, userId: string): Promise<({
        _count: {
            operations: number;
        };
    } & {
        id: string;
        name: string;
        address: string | null;
        phone: string | null;
        isActive: boolean;
        createdBy: string | null;
        createdAt: Date;
        updatedAt: Date;
    }) | null>;
    findOwned(id: string, userId: string): Promise<{
        id: string;
        name: string;
        address: string | null;
        phone: string | null;
        isActive: boolean;
        createdBy: string | null;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    findActive(userId: string): Promise<{
        id: string;
        name: string;
        address: string | null;
        phone: string | null;
        isActive: boolean;
        createdBy: string | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    countForUser(userId: string): Promise<number>;
    create(data: {
        name: string;
        address?: string;
        phone?: string;
        createdBy: string;
    }): Promise<{
        id: string;
        name: string;
        address: string | null;
        phone: string | null;
        isActive: boolean;
        createdBy: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, data: Prisma.HospitalUpdateInput): Promise<{
        id: string;
        name: string;
        address: string | null;
        phone: string | null;
        isActive: boolean;
        createdBy: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    delete(id: string): Promise<{
        id: string;
        name: string;
        address: string | null;
        phone: string | null;
        isActive: boolean;
        createdBy: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
export declare const hospitalRepo: HospitalRepository;
//# sourceMappingURL=hospital.repo.d.ts.map