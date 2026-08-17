import type { CreateDoctorInput, UpdateDoctorInput } from '../validators/doctor.validator';
declare class DoctorService {
    getAll(params: {
        page: number;
        limit: number;
        search?: string;
        specialtyId?: string;
        userId: string;
    }): Promise<{
        data: {
            id: string;
            name: string;
            phone: string | null;
            email: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            specialties: {
                id: string;
                name: string;
                nameAr: string | null;
            }[];
            subspecialties: {
                id: string;
                name: string;
                nameAr: string | null;
            }[];
        }[];
        total: number;
    }>;
    getActive(userId: string): Promise<{
        id: string;
        name: string;
        phone: string | null;
        email: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        specialties: {
            id: string;
            name: string;
            nameAr: string | null;
        }[];
        subspecialties: {
            id: string;
            name: string;
            nameAr: string | null;
        }[];
    }[]>;
    getById(id: string, userId: string): Promise<{
        id: string;
        name: string;
        phone: string | null;
        email: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        specialties: {
            id: string;
            name: string;
            nameAr: string | null;
        }[];
        subspecialties: {
            id: string;
            name: string;
            nameAr: string | null;
        }[];
    }>;
    assertAccessible(id: string, userId: string): Promise<void>;
    create(input: CreateDoctorInput, userId: string): Promise<{
        id: string;
        name: string;
        phone: string | null;
        email: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        specialties: {
            id: string;
            name: string;
            nameAr: string | null;
        }[];
        subspecialties: {
            id: string;
            name: string;
            nameAr: string | null;
        }[];
    }>;
    update(id: string, userId: string, input: UpdateDoctorInput): Promise<{
        id: string;
        name: string;
        phone: string | null;
        email: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        specialties: {
            id: string;
            name: string;
            nameAr: string | null;
        }[];
        subspecialties: {
            id: string;
            name: string;
            nameAr: string | null;
        }[];
    }>;
    delete(id: string, userId: string): Promise<{
        id: string;
        name: string;
        phone: string | null;
        email: string | null;
        isActive: boolean;
        userId: string | null;
        createdBy: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
export declare const doctorService: DoctorService;
export {};
//# sourceMappingURL=doctor.service.d.ts.map