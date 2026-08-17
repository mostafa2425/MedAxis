import { Prisma } from '../prisma';
export declare class HospitalRepository {
    findAll(params: {
        page: number;
        limit: number;
        search?: string;
        governorateId?: string;
        userId: string;
    }): Promise<{
        data: ({
            _count: {
                operations: number;
            };
            governorate: {
                id: string;
                nameEn: string;
                nameAr: string;
                code: string;
                isActive: boolean;
            } | null;
        } & {
            id: string;
            name: string;
            nameAr: string | null;
            address: string | null;
            city: string | null;
            governorateId: string | null;
            phone: string | null;
            notes: string | null;
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
        governorate: {
            id: string;
            nameEn: string;
            nameAr: string;
            code: string;
            isActive: boolean;
        } | null;
    } & {
        id: string;
        name: string;
        nameAr: string | null;
        address: string | null;
        city: string | null;
        governorateId: string | null;
        phone: string | null;
        notes: string | null;
        isActive: boolean;
        createdBy: string | null;
        createdAt: Date;
        updatedAt: Date;
    }) | null>;
    findOwned(id: string, userId: string): Promise<{
        id: string;
        name: string;
        nameAr: string | null;
        address: string | null;
        city: string | null;
        governorateId: string | null;
        phone: string | null;
        notes: string | null;
        isActive: boolean;
        createdBy: string | null;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    findActive(userId: string): Promise<({
        governorate: {
            id: string;
            nameEn: string;
            nameAr: string;
            code: string;
            isActive: boolean;
        } | null;
    } & {
        id: string;
        name: string;
        nameAr: string | null;
        address: string | null;
        city: string | null;
        governorateId: string | null;
        phone: string | null;
        notes: string | null;
        isActive: boolean;
        createdBy: string | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    countForUser(userId: string): Promise<number>;
    create(data: {
        name: string;
        nameAr?: string;
        address?: string;
        city?: string;
        governorateId?: string;
        phone?: string;
        notes?: string;
        createdBy: string;
    }): Promise<{
        _count: {
            operations: number;
        };
        governorate: {
            id: string;
            nameEn: string;
            nameAr: string;
            code: string;
            isActive: boolean;
        } | null;
    } & {
        id: string;
        name: string;
        nameAr: string | null;
        address: string | null;
        city: string | null;
        governorateId: string | null;
        phone: string | null;
        notes: string | null;
        isActive: boolean;
        createdBy: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, data: Prisma.HospitalUpdateInput): Promise<{
        _count: {
            operations: number;
        };
        governorate: {
            id: string;
            nameEn: string;
            nameAr: string;
            code: string;
            isActive: boolean;
        } | null;
    } & {
        id: string;
        name: string;
        nameAr: string | null;
        address: string | null;
        city: string | null;
        governorateId: string | null;
        phone: string | null;
        notes: string | null;
        isActive: boolean;
        createdBy: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    delete(id: string): Promise<{
        _count: {
            operations: number;
        };
        governorate: {
            id: string;
            nameEn: string;
            nameAr: string;
            code: string;
            isActive: boolean;
        } | null;
    } & {
        id: string;
        name: string;
        nameAr: string | null;
        address: string | null;
        city: string | null;
        governorateId: string | null;
        phone: string | null;
        notes: string | null;
        isActive: boolean;
        createdBy: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
export declare const hospitalRepo: HospitalRepository;
//# sourceMappingURL=hospital.repo.d.ts.map