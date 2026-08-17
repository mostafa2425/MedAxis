import { Prisma } from '../prisma';
export declare class NurseRepository {
    findAll(params: {
        page: number;
        limit: number;
        search?: string;
        userId: string;
    }): Promise<{
        data: {
            id: string;
            name: string;
            phone: string | null;
            email: string | null;
            isActive: boolean;
            createdBy: string;
            createdAt: Date;
            updatedAt: Date;
        }[];
        total: number;
    }>;
    findActive(userId: string): Promise<{
        id: string;
        name: string;
        phone: string | null;
        email: string | null;
        isActive: boolean;
        createdBy: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findById(id: string, userId: string): Promise<{
        id: string;
        name: string;
        phone: string | null;
        email: string | null;
        isActive: boolean;
        createdBy: string;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    findDuplicate(userId: string, name: string, email?: string | null, excludeId?: string): Promise<{
        id: string;
        name: string;
        phone: string | null;
        email: string | null;
        isActive: boolean;
        createdBy: string;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    countForUser(userId: string): Promise<number>;
    create(data: {
        name: string;
        phone?: string | null;
        email?: string | null;
        createdBy: string;
    }): Promise<{
        id: string;
        name: string;
        phone: string | null;
        email: string | null;
        isActive: boolean;
        createdBy: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, data: Prisma.NurseUpdateInput): Promise<{
        id: string;
        name: string;
        phone: string | null;
        email: string | null;
        isActive: boolean;
        createdBy: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    delete(id: string): Promise<{
        id: string;
        name: string;
        phone: string | null;
        email: string | null;
        isActive: boolean;
        createdBy: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
export declare const nurseRepo: NurseRepository;
//# sourceMappingURL=nurse.repo.d.ts.map