import { Prisma } from '../prisma';
export declare class UserRepository {
    findById(id: string): Promise<{
        createdAt: Date;
        email: string;
        id: string;
        isActive: boolean;
        name: string;
        phone: string | null;
        role: string;
        updatedAt: Date;
    } | null>;
    findByEmail(email: string): Promise<{
        id: string;
        email: string;
        password: string;
        name: string;
        phone: string | null;
        role: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    create(data: {
        email: string;
        password: string;
        name: string;
        phone?: string;
        role?: string;
    }): Promise<{
        id: string;
        email: string;
        password: string;
        name: string;
        phone: string | null;
        role: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, data: Prisma.UserUpdateInput): Promise<{
        id: string;
        email: string;
        password: string;
        name: string;
        phone: string | null;
        role: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findMany(params: {
        page: number;
        limit: number;
        search?: string;
    }): Promise<{
        data: {
            createdAt: Date;
            email: string;
            id: string;
            isActive: boolean;
            name: string;
            phone: string | null;
            role: string;
            updatedAt: Date;
        }[];
        total: number;
    }>;
}
export declare const userRepo: UserRepository;
//# sourceMappingURL=user.repo.d.ts.map