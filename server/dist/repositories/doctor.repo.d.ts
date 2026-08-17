import { Prisma } from '../prisma';
declare const doctorInclude: {
    specialties: {
        include: {
            specialty: true;
        };
        orderBy: {
            specialty: {
                name: 'asc';
            };
        };
    };
    subspecialties: {
        include: {
            specialty: true;
        };
        orderBy: {
            specialty: {
                name: 'asc';
            };
        };
    };
};
export type DoctorWithSpecialties = Prisma.DoctorGetPayload<{
    include: typeof doctorInclude;
}>;
export declare function accessibleDoctorWhere(userId: string): Prisma.DoctorWhereInput;
export declare class DoctorRepository {
    findAll(params: {
        page: number;
        limit: number;
        search?: string;
        specialtyId?: string;
        userId: string;
    }): Promise<{
        data: ({
            specialties: ({
                specialty: {
                    id: string;
                    name: string;
                    nameAr: string | null;
                    icon: string | null;
                    parentId: string | null;
                    isActive: boolean;
                    createdAt: Date;
                    updatedAt: Date;
                };
            } & {
                id: string;
                doctorId: string;
                specialtyId: string;
                createdAt: Date;
            })[];
            subspecialties: ({
                specialty: {
                    id: string;
                    name: string;
                    nameAr: string | null;
                    icon: string | null;
                    parentId: string | null;
                    isActive: boolean;
                    createdAt: Date;
                    updatedAt: Date;
                };
            } & {
                id: string;
                doctorId: string;
                specialtyId: string;
                createdAt: Date;
            })[];
        } & {
            id: string;
            name: string;
            phone: string | null;
            email: string | null;
            isActive: boolean;
            userId: string | null;
            createdBy: string | null;
            createdAt: Date;
            updatedAt: Date;
        })[];
        total: number;
    }>;
    findActive(userId: string): Promise<({
        specialties: ({
            specialty: {
                id: string;
                name: string;
                nameAr: string | null;
                icon: string | null;
                parentId: string | null;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            doctorId: string;
            specialtyId: string;
            createdAt: Date;
        })[];
        subspecialties: ({
            specialty: {
                id: string;
                name: string;
                nameAr: string | null;
                icon: string | null;
                parentId: string | null;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            doctorId: string;
            specialtyId: string;
            createdAt: Date;
        })[];
    } & {
        id: string;
        name: string;
        phone: string | null;
        email: string | null;
        isActive: boolean;
        userId: string | null;
        createdBy: string | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    findById(id: string, userId?: string): Promise<({
        specialties: ({
            specialty: {
                id: string;
                name: string;
                nameAr: string | null;
                icon: string | null;
                parentId: string | null;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            doctorId: string;
            specialtyId: string;
            createdAt: Date;
        })[];
        subspecialties: ({
            specialty: {
                id: string;
                name: string;
                nameAr: string | null;
                icon: string | null;
                parentId: string | null;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            doctorId: string;
            specialtyId: string;
            createdAt: Date;
        })[];
    } & {
        id: string;
        name: string;
        phone: string | null;
        email: string | null;
        isActive: boolean;
        userId: string | null;
        createdBy: string | null;
        createdAt: Date;
        updatedAt: Date;
    }) | null>;
    findOwned(id: string, userId: string): Promise<({
        specialties: ({
            specialty: {
                id: string;
                name: string;
                nameAr: string | null;
                icon: string | null;
                parentId: string | null;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            doctorId: string;
            specialtyId: string;
            createdAt: Date;
        })[];
        subspecialties: ({
            specialty: {
                id: string;
                name: string;
                nameAr: string | null;
                icon: string | null;
                parentId: string | null;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            doctorId: string;
            specialtyId: string;
            createdAt: Date;
        })[];
    } & {
        id: string;
        name: string;
        phone: string | null;
        email: string | null;
        isActive: boolean;
        userId: string | null;
        createdBy: string | null;
        createdAt: Date;
        updatedAt: Date;
    }) | null>;
    findByUserId(userId: string): Promise<({
        specialties: ({
            specialty: {
                id: string;
                name: string;
                nameAr: string | null;
                icon: string | null;
                parentId: string | null;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            doctorId: string;
            specialtyId: string;
            createdAt: Date;
        })[];
        subspecialties: ({
            specialty: {
                id: string;
                name: string;
                nameAr: string | null;
                icon: string | null;
                parentId: string | null;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            doctorId: string;
            specialtyId: string;
            createdAt: Date;
        })[];
    } & {
        id: string;
        name: string;
        phone: string | null;
        email: string | null;
        isActive: boolean;
        userId: string | null;
        createdBy: string | null;
        createdAt: Date;
        updatedAt: Date;
    }) | null>;
    findDuplicate(userId: string, email?: string | null, name?: string, excludeId?: string): Promise<({
        specialties: ({
            specialty: {
                id: string;
                name: string;
                nameAr: string | null;
                icon: string | null;
                parentId: string | null;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            doctorId: string;
            specialtyId: string;
            createdAt: Date;
        })[];
        subspecialties: ({
            specialty: {
                id: string;
                name: string;
                nameAr: string | null;
                icon: string | null;
                parentId: string | null;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            doctorId: string;
            specialtyId: string;
            createdAt: Date;
        })[];
    } & {
        id: string;
        name: string;
        phone: string | null;
        email: string | null;
        isActive: boolean;
        userId: string | null;
        createdBy: string | null;
        createdAt: Date;
        updatedAt: Date;
    }) | null>;
    countForUser(userId: string): Promise<number>;
    create(data: {
        name: string;
        phone?: string | null;
        email?: string | null;
        userId?: string | null;
        createdBy?: string | null;
    }, specialtyIds?: string[], subspecialtyIds?: string[]): Promise<{
        specialties: ({
            specialty: {
                id: string;
                name: string;
                nameAr: string | null;
                icon: string | null;
                parentId: string | null;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            doctorId: string;
            specialtyId: string;
            createdAt: Date;
        })[];
        subspecialties: ({
            specialty: {
                id: string;
                name: string;
                nameAr: string | null;
                icon: string | null;
                parentId: string | null;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            doctorId: string;
            specialtyId: string;
            createdAt: Date;
        })[];
    } & {
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
    update(id: string, data: {
        name?: string;
        phone?: string | null;
        email?: string | null;
    }): Promise<{
        specialties: ({
            specialty: {
                id: string;
                name: string;
                nameAr: string | null;
                icon: string | null;
                parentId: string | null;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            doctorId: string;
            specialtyId: string;
            createdAt: Date;
        })[];
        subspecialties: ({
            specialty: {
                id: string;
                name: string;
                nameAr: string | null;
                icon: string | null;
                parentId: string | null;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            doctorId: string;
            specialtyId: string;
            createdAt: Date;
        })[];
    } & {
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
    delete(id: string): Promise<{
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
    setSpecialtyLinks(doctorId: string, specialtyIds: string[], subspecialtyIds: string[]): Promise<({
        specialties: ({
            specialty: {
                id: string;
                name: string;
                nameAr: string | null;
                icon: string | null;
                parentId: string | null;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            doctorId: string;
            specialtyId: string;
            createdAt: Date;
        })[];
        subspecialties: ({
            specialty: {
                id: string;
                name: string;
                nameAr: string | null;
                icon: string | null;
                parentId: string | null;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            doctorId: string;
            specialtyId: string;
            createdAt: Date;
        })[];
    } & {
        id: string;
        name: string;
        phone: string | null;
        email: string | null;
        isActive: boolean;
        userId: string | null;
        createdBy: string | null;
        createdAt: Date;
        updatedAt: Date;
    }) | null>;
}
export declare const doctorRepo: DoctorRepository;
export {};
//# sourceMappingURL=doctor.repo.d.ts.map