declare class SpecialtyService {
    getAll(params?: {
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
    getById(id: string): Promise<{
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
    }>;
    create(data: {
        name: string;
        nameAr?: string;
        icon?: string;
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
    update(id: string, data: {
        name?: string;
        nameAr?: string;
        icon?: string;
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
    getWithOperationsCount(): Promise<({
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
    assertTopLevelSpecialtyIds(ids: string[]): Promise<string[]>;
    assertSubspecialtyIds(ids: string[] | undefined, parentIds: string[]): Promise<string[]>;
    filterSubspecialtyIds(ids: string[] | undefined, parentIds: string[]): Promise<string[]>;
}
export declare const specialtyService: SpecialtyService;
export {};
//# sourceMappingURL=specialty.service.d.ts.map