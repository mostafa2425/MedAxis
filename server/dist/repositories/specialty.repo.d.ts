import { Prisma } from '../prisma';
export declare class SpecialtyRepository {
    findAll(params?: {
        parentIds?: string[];
        rootsOnly?: boolean;
        search?: string;
        skip?: number;
        take?: number;
    }): Promise<{
        data: ({
            _count: {
                doctors: number;
            };
        } & {
            id: string;
            name: string;
            nameAr: string | null;
            icon: string | null;
            parentId: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        })[];
        total: number;
    }>;
    findById(id: string): Promise<({
        _count: {
            doctors: number;
        };
    } & {
        id: string;
        name: string;
        nameAr: string | null;
        icon: string | null;
        parentId: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }) | null>;
    findByIds(ids: string[]): Promise<{
        id: string;
        name: string;
        nameAr: string | null;
        icon: string | null;
        parentId: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findByName(name: string): Promise<{
        id: string;
        name: string;
        nameAr: string | null;
        icon: string | null;
        parentId: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    create(data: {
        name: string;
        nameAr?: string;
        icon?: string;
        parentId?: string;
    }): Promise<{
        id: string;
        name: string;
        nameAr: string | null;
        icon: string | null;
        parentId: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, data: Prisma.SpecialtyUpdateInput): Promise<{
        id: string;
        name: string;
        nameAr: string | null;
        icon: string | null;
        parentId: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    delete(id: string): Promise<{
        id: string;
        name: string;
        nameAr: string | null;
        icon: string | null;
        parentId: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findWithOperationsCount(): Promise<({
        _count: {
            doctors: number;
        };
    } & {
        id: string;
        name: string;
        nameAr: string | null;
        icon: string | null;
        parentId: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
}
export declare const specialtyRepo: SpecialtyRepository;
//# sourceMappingURL=specialty.repo.d.ts.map