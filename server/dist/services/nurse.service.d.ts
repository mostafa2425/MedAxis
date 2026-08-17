import type { CreateNurseInput, UpdateNurseInput } from '../validators/nurse.validator';
declare class NurseService {
    getAll(params: {
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
    getActive(userId: string): Promise<{
        id: string;
        name: string;
        phone: string | null;
        email: string | null;
        isActive: boolean;
        createdBy: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getById(id: string, userId: string): Promise<{
        id: string;
        name: string;
        phone: string | null;
        email: string | null;
        isActive: boolean;
        createdBy: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    assertAccessible(id: string, userId: string): Promise<void>;
    create(input: CreateNurseInput, userId: string): Promise<{
        id: string;
        name: string;
        phone: string | null;
        email: string | null;
        isActive: boolean;
        createdBy: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, userId: string, input: UpdateNurseInput): Promise<{
        id: string;
        name: string;
        phone: string | null;
        email: string | null;
        isActive: boolean;
        createdBy: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    delete(id: string, userId: string): Promise<{
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
export declare const nurseService: NurseService;
export {};
//# sourceMappingURL=nurse.service.d.ts.map