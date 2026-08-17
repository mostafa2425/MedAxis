export type HospitalInput = {
    name: string;
    nameAr?: string;
    address?: string;
    city?: string;
    governorateId?: string;
    phone?: string;
    notes?: string;
};
declare class HospitalService {
    getAll(params: {
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
    getActive(userId: string): Promise<({
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
    getById(id: string, userId: string): Promise<{
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
    assertAccessible(id: string, userId: string): Promise<void>;
    create(data: HospitalInput, userId: string): Promise<{
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
    update(id: string, userId: string, data: Partial<HospitalInput>): Promise<{
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
    delete(id: string, userId: string): Promise<{
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
export declare const hospitalService: HospitalService;
export {};
//# sourceMappingURL=hospital.service.d.ts.map