import { Prisma } from '../prisma';
declare const catalogInclude: {
    specialty: {
        select: {
            id: true;
            name: true;
            nameAr: true;
            parentId: true;
        };
    };
    subspecialty: {
        select: {
            id: true;
            name: true;
            nameAr: true;
            parentId: true;
        };
    };
};
export type CatalogItemWithSpecialty = Prisma.OperationCatalogGetPayload<{
    include: typeof catalogInclude;
}>;
export declare class OperationCatalogRepository {
    findAccessible(params: {
        specialtyIds: string[];
        userId: string;
    }): Promise<({
        specialty: {
            id: string;
            name: string;
            nameAr: string | null;
            parentId: string | null;
        } | null;
        subspecialty: {
            id: string;
            name: string;
            nameAr: string | null;
            parentId: string | null;
        } | null;
    } & {
        id: string;
        name: string;
        nameAr: string | null;
        specialtyId: string | null;
        subspecialtyId: string | null;
        isActive: boolean;
        isCustom: boolean;
        createdBy: string | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    findById(id: string): Promise<({
        specialty: {
            id: string;
            name: string;
            nameAr: string | null;
            parentId: string | null;
        } | null;
        subspecialty: {
            id: string;
            name: string;
            nameAr: string | null;
            parentId: string | null;
        } | null;
    } & {
        id: string;
        name: string;
        nameAr: string | null;
        specialtyId: string | null;
        subspecialtyId: string | null;
        isActive: boolean;
        isCustom: boolean;
        createdBy: string | null;
        createdAt: Date;
        updatedAt: Date;
    }) | null>;
    findCommonByName(name: string, specialtyId: string): Promise<({
        specialty: {
            id: string;
            name: string;
            nameAr: string | null;
            parentId: string | null;
        } | null;
        subspecialty: {
            id: string;
            name: string;
            nameAr: string | null;
            parentId: string | null;
        } | null;
    } & {
        id: string;
        name: string;
        nameAr: string | null;
        specialtyId: string | null;
        subspecialtyId: string | null;
        isActive: boolean;
        isCustom: boolean;
        createdBy: string | null;
        createdAt: Date;
        updatedAt: Date;
    }) | null>;
    findCustomByName(userId: string, name: string): Promise<({
        specialty: {
            id: string;
            name: string;
            nameAr: string | null;
            parentId: string | null;
        } | null;
        subspecialty: {
            id: string;
            name: string;
            nameAr: string | null;
            parentId: string | null;
        } | null;
    } & {
        id: string;
        name: string;
        nameAr: string | null;
        specialtyId: string | null;
        subspecialtyId: string | null;
        isActive: boolean;
        isCustom: boolean;
        createdBy: string | null;
        createdAt: Date;
        updatedAt: Date;
    }) | null>;
    create(data: {
        name: string;
        nameAr?: string | null;
        specialtyId?: string | null;
        subspecialtyId?: string | null;
        isCustom?: boolean;
        createdBy?: string | null;
    }): Promise<{
        specialty: {
            id: string;
            name: string;
            nameAr: string | null;
            parentId: string | null;
        } | null;
        subspecialty: {
            id: string;
            name: string;
            nameAr: string | null;
            parentId: string | null;
        } | null;
    } & {
        id: string;
        name: string;
        nameAr: string | null;
        specialtyId: string | null;
        subspecialtyId: string | null;
        isActive: boolean;
        isCustom: boolean;
        createdBy: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
export declare const operationCatalogRepo: OperationCatalogRepository;
export {};
//# sourceMappingURL=operationCatalog.repo.d.ts.map