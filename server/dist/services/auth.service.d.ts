import type { UpdateProfileInput } from '../validators/auth.validator';
declare class AuthService {
    login(email: string, password: string): Promise<{
        token: string;
        user: {
            id: string;
            email: string;
            name: string;
            phone: string | null;
            role: string;
            isActive: boolean;
            doctorId: string | null;
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
            createdAt?: Date | undefined;
            updatedAt?: Date | undefined;
        };
    }>;
    register(email: string, password: string, name: string, specialtyIds: string[], phone?: string, subspecialtyIds?: string[]): Promise<{
        token: string;
        user: {
            id: string;
            email: string;
            name: string;
            phone: string | null;
            role: string;
            isActive: boolean;
            doctorId: string | null;
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
            createdAt?: Date | undefined;
            updatedAt?: Date | undefined;
        };
    }>;
    getMe(userId: string): Promise<{
        id: string;
        email: string;
        name: string;
        phone: string | null;
        role: string;
        isActive: boolean;
        doctorId: string | null;
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
        createdAt?: Date | undefined;
        updatedAt?: Date | undefined;
    }>;
    updateProfile(userId: string, input: UpdateProfileInput): Promise<{
        id: string;
        email: string;
        name: string;
        phone: string | null;
        role: string;
        isActive: boolean;
        doctorId: string | null;
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
        createdAt?: Date | undefined;
        updatedAt?: Date | undefined;
    }>;
}
export declare const authService: AuthService;
export {};
//# sourceMappingURL=auth.service.d.ts.map