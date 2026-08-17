declare class HospitalService {
    getAll(params: {
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
    getActive(userId: string): Promise<{
        id: string;
        name: string;
        address: string | null;
        phone: string | null;
        isActive: boolean;
        createdBy: string | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getById(id: string, userId: string): Promise<{
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
    }>;
    assertAccessible(id: string, userId: string): Promise<void>;
    create(data: {
        name: string;
        address?: string;
        phone?: string;
    }, userId: string): Promise<{
        id: string;
        name: string;
        address: string | null;
        phone: string | null;
        isActive: boolean;
        createdBy: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, userId: string, data: {
        name?: string;
        address?: string;
        phone?: string;
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
    delete(id: string, userId: string): Promise<{
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
export declare const hospitalService: HospitalService;
export {};
//# sourceMappingURL=hospital.service.d.ts.map