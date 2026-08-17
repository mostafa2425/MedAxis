import { Prisma } from '../prisma';
export declare class PatientRepository {
    findAll(params: {
        page: number;
        limit: number;
        search?: string;
        gender?: 'MALE' | 'FEMALE';
        createdBy: string;
    }): Promise<{
        data: ({
            _count: {
                operations: number;
            };
        } & {
            id: string;
            fullName: string;
            age: number;
            gender: import("../prisma").Gender;
            mobile: string | null;
            notes: string | null;
            createdBy: string;
            createdAt: Date;
            updatedAt: Date;
        })[];
        total: number;
    }>;
    findById(id: string, createdBy: string): Promise<({
        operations: ({
            hospital: {
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
            };
            specialty: {
                id: string;
                name: string;
                nameAr: string | null;
                icon: string | null;
                parentId: string | null;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
            } | null;
        } & {
            id: string;
            name: string;
            diagnosis: string | null;
            hospitalId: string;
            operationDate: Date;
            operationTime: string;
            operationRoom: string | null;
            duration: number | null;
            status: import("../prisma").OperationStatus;
            notes: string | null;
            patientId: string;
            createdBy: string;
            specialtyId: string | null;
            catalogId: string | null;
            createdAt: Date;
            updatedAt: Date;
        })[];
    } & {
        id: string;
        fullName: string;
        age: number;
        gender: import("../prisma").Gender;
        mobile: string | null;
        notes: string | null;
        createdBy: string;
        createdAt: Date;
        updatedAt: Date;
    }) | null>;
    create(data: {
        fullName: string;
        age: number;
        gender?: 'MALE' | 'FEMALE';
        mobile?: string;
        notes?: string;
        createdBy: string;
    }): Promise<{
        id: string;
        fullName: string;
        age: number;
        gender: import("../prisma").Gender;
        mobile: string | null;
        notes: string | null;
        createdBy: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, createdBy: string, data: Prisma.PatientUpdateInput): Promise<{
        id: string;
        fullName: string;
        age: number;
        gender: import("../prisma").Gender;
        mobile: string | null;
        notes: string | null;
        createdBy: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    delete(id: string, createdBy: string): Promise<{
        id: string;
        fullName: string;
        age: number;
        gender: import("../prisma").Gender;
        mobile: string | null;
        notes: string | null;
        createdBy: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findRecent(createdBy: string, limit?: number): Promise<{
        id: string;
        fullName: string;
        age: number;
        gender: import("../prisma").Gender;
        mobile: string | null;
        notes: string | null;
        createdBy: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    count(createdBy: string): Promise<number>;
}
export declare const patientRepo: PatientRepository;
//# sourceMappingURL=patient.repo.d.ts.map