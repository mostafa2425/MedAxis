declare class OperationCatalogService {
    listForUser(userId: string): Promise<{
        id: string;
        name: string;
        nameAr: string | null;
        isCustom: boolean;
        specialty: {
            id: string;
            name: string;
            nameAr: string | null;
        } | null;
        subspecialty: {
            id: string;
            name: string;
            nameAr: string | null;
        } | null;
    }[]>;
    createCustom(userId: string, name: string): Promise<{
        id: string;
        name: string;
        nameAr: string | null;
        isCustom: boolean;
        specialty: {
            id: string;
            name: string;
            nameAr: string | null;
        } | null;
        subspecialty: {
            id: string;
            name: string;
            nameAr: string | null;
        } | null;
    }>;
    assertAccessible(userId: string, catalogId: string): Promise<{
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
    getById(id: string): Promise<{
        id: string;
        name: string;
        nameAr: string | null;
        isCustom: boolean;
        specialty: {
            id: string;
            name: string;
            nameAr: string | null;
        } | null;
        subspecialty: {
            id: string;
            name: string;
            nameAr: string | null;
        } | null;
    }>;
}
export declare const operationCatalogService: OperationCatalogService;
export {};
//# sourceMappingURL=operationCatalog.service.d.ts.map