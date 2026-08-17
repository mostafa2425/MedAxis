import { Prisma, OperationStatus } from '../prisma';
type CostData = {
    totalCost: number;
    paidAmount?: number;
    remainingAmount?: number;
    hospitalCost?: number;
    nursingCost?: number;
    assistantDoctorsCost?: number;
    equipmentCost?: number;
    otherCost?: number;
    paymentMethod?: string;
    paymentStatus?: string;
    paymentNotes?: string;
};
export declare class OperationRepository {
    findAll(params: {
        page: number;
        limit: number;
        search?: string;
        status?: OperationStatus;
        specialtyId?: string;
        hospitalId?: string;
        dateFrom?: string;
        dateTo?: string;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
        createdBy: string;
    }): Promise<{
        data: ({
            catalog: ({
                specialty: {
                    id: string;
                    name: string;
                    nameAr: string | null;
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
            }) | null;
            cost: {
                id: string;
                operationId: string;
                totalCost: import("@prisma/client-runtime-utils").Decimal;
                paidAmount: import("@prisma/client-runtime-utils").Decimal;
                remainingAmount: import("@prisma/client-runtime-utils").Decimal;
                hospitalCost: import("@prisma/client-runtime-utils").Decimal;
                nursingCost: import("@prisma/client-runtime-utils").Decimal;
                assistantDoctorsCost: import("@prisma/client-runtime-utils").Decimal;
                equipmentCost: import("@prisma/client-runtime-utils").Decimal;
                otherCost: import("@prisma/client-runtime-utils").Decimal;
                paymentMethod: import("../prisma").PaymentMethod;
                paymentStatus: import("../prisma").PaymentStatus;
                paymentNotes: string | null;
                createdAt: Date;
                updatedAt: Date;
            } | null;
            files: {
                createdAt: Date;
                fileName: string;
                filePath: string;
                fileSize: number | null;
                fileType: import("../prisma").FileType;
                id: string;
                mimeType: string | null;
                operationId: string;
            }[];
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
            medicalTeam: ({
                anesthesiologist: {
                    id: string;
                    name: string;
                    phone: string | null;
                    email: string | null;
                    isActive: boolean;
                    userId: string | null;
                    createdBy: string | null;
                    createdAt: Date;
                    updatedAt: Date;
                } | null;
                assistantAnesthesia: {
                    id: string;
                    name: string;
                    phone: string | null;
                    email: string | null;
                    isActive: boolean;
                    userId: string | null;
                    createdBy: string | null;
                    createdAt: Date;
                    updatedAt: Date;
                } | null;
                assistantSurgeon: {
                    id: string;
                    name: string;
                    phone: string | null;
                    email: string | null;
                    isActive: boolean;
                    userId: string | null;
                    createdBy: string | null;
                    createdAt: Date;
                    updatedAt: Date;
                } | null;
                primarySurgeon: {
                    id: string;
                    name: string;
                    phone: string | null;
                    email: string | null;
                    isActive: boolean;
                    userId: string | null;
                    createdBy: string | null;
                    createdAt: Date;
                    updatedAt: Date;
                } | null;
            } & {
                id: string;
                operationId: string;
                primarySurgeonId: string | null;
                assistantSurgeonId: string | null;
                anesthesiologistId: string | null;
                assistantAnesthesiaId: string | null;
                nurse: string | null;
                notes: string | null;
                createdAt: Date;
            })[];
            patient: {
                id: string;
                fullName: string;
                age: number;
                gender: import("../prisma").Gender;
                mobile: string | null;
                notes: string | null;
                createdBy: string;
                createdAt: Date;
                updatedAt: Date;
            };
            procedures: ({
                catalog: ({
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
                }) | null;
                specialty: {
                    id: string;
                    name: string;
                    nameAr: string | null;
                } | null;
            } & {
                id: string;
                operationId: string;
                catalogId: string | null;
                name: string;
                nameAr: string | null;
                specialtyId: string | null;
                sortOrder: number;
                createdAt: Date;
            })[];
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
            teamMembers: ({
                doctor: {
                    id: string;
                    name: string;
                    phone: string | null;
                    email: string | null;
                    isActive: boolean;
                    userId: string | null;
                    createdBy: string | null;
                    createdAt: Date;
                    updatedAt: Date;
                } | null;
                nurse: {
                    id: string;
                    name: string;
                    phone: string | null;
                    email: string | null;
                    isActive: boolean;
                    createdBy: string;
                    createdAt: Date;
                    updatedAt: Date;
                } | null;
            } & {
                id: string;
                operationId: string;
                doctorId: string | null;
                nurseId: string | null;
                sortOrder: number;
                createdAt: Date;
            })[];
        } & {
            id: string;
            name: string;
            diagnosis: string | null;
            hospitalId: string;
            operationDate: Date;
            operationTime: string;
            operationRoom: string | null;
            duration: number | null;
            status: OperationStatus;
            notes: string | null;
            patientId: string;
            createdBy: string;
            specialtyId: string | null;
            catalogId: string | null;
            createdAt: Date;
            updatedAt: Date;
        })[];
        total: number;
    }>;
    findById(id: string, createdBy: string): Promise<({
        catalog: ({
            specialty: {
                id: string;
                name: string;
                nameAr: string | null;
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
        }) | null;
        cost: {
            id: string;
            operationId: string;
            totalCost: import("@prisma/client-runtime-utils").Decimal;
            paidAmount: import("@prisma/client-runtime-utils").Decimal;
            remainingAmount: import("@prisma/client-runtime-utils").Decimal;
            hospitalCost: import("@prisma/client-runtime-utils").Decimal;
            nursingCost: import("@prisma/client-runtime-utils").Decimal;
            assistantDoctorsCost: import("@prisma/client-runtime-utils").Decimal;
            equipmentCost: import("@prisma/client-runtime-utils").Decimal;
            otherCost: import("@prisma/client-runtime-utils").Decimal;
            paymentMethod: import("../prisma").PaymentMethod;
            paymentStatus: import("../prisma").PaymentStatus;
            paymentNotes: string | null;
            createdAt: Date;
            updatedAt: Date;
        } | null;
        creator: {
            email: string;
            id: string;
            name: string;
        };
        files: ({
            uploader: {
                id: string;
                name: string;
            };
        } & {
            id: string;
            operationId: string;
            fileType: import("../prisma").FileType;
            fileName: string;
            filePath: string;
            fileSize: number | null;
            mimeType: string | null;
            uploadedBy: string;
            createdAt: Date;
        })[];
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
        medicalTeam: ({
            anesthesiologist: {
                id: string;
                name: string;
                phone: string | null;
                email: string | null;
                isActive: boolean;
                userId: string | null;
                createdBy: string | null;
                createdAt: Date;
                updatedAt: Date;
            } | null;
            assistantAnesthesia: {
                id: string;
                name: string;
                phone: string | null;
                email: string | null;
                isActive: boolean;
                userId: string | null;
                createdBy: string | null;
                createdAt: Date;
                updatedAt: Date;
            } | null;
            assistantSurgeon: {
                id: string;
                name: string;
                phone: string | null;
                email: string | null;
                isActive: boolean;
                userId: string | null;
                createdBy: string | null;
                createdAt: Date;
                updatedAt: Date;
            } | null;
            primarySurgeon: {
                id: string;
                name: string;
                phone: string | null;
                email: string | null;
                isActive: boolean;
                userId: string | null;
                createdBy: string | null;
                createdAt: Date;
                updatedAt: Date;
            } | null;
        } & {
            id: string;
            operationId: string;
            primarySurgeonId: string | null;
            assistantSurgeonId: string | null;
            anesthesiologistId: string | null;
            assistantAnesthesiaId: string | null;
            nurse: string | null;
            notes: string | null;
            createdAt: Date;
        })[];
        patient: {
            id: string;
            fullName: string;
            age: number;
            gender: import("../prisma").Gender;
            mobile: string | null;
            notes: string | null;
            createdBy: string;
            createdAt: Date;
            updatedAt: Date;
        };
        procedures: ({
            catalog: ({
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
            }) | null;
            specialty: {
                id: string;
                name: string;
                nameAr: string | null;
            } | null;
        } & {
            id: string;
            operationId: string;
            catalogId: string | null;
            name: string;
            nameAr: string | null;
            specialtyId: string | null;
            sortOrder: number;
            createdAt: Date;
        })[];
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
        teamMembers: ({
            doctor: {
                id: string;
                name: string;
                phone: string | null;
                email: string | null;
                isActive: boolean;
                userId: string | null;
                createdBy: string | null;
                createdAt: Date;
                updatedAt: Date;
            } | null;
            nurse: {
                id: string;
                name: string;
                phone: string | null;
                email: string | null;
                isActive: boolean;
                createdBy: string;
                createdAt: Date;
                updatedAt: Date;
            } | null;
        } & {
            id: string;
            operationId: string;
            doctorId: string | null;
            nurseId: string | null;
            sortOrder: number;
            createdAt: Date;
        })[];
        timeline: ({
            user: {
                id: string;
                name: string;
            };
        } & {
            id: string;
            operationId: string;
            action: import("../prisma").TimelineAction;
            description: string | null;
            userId: string;
            createdAt: Date;
        })[];
    } & {
        id: string;
        name: string;
        diagnosis: string | null;
        hospitalId: string;
        operationDate: Date;
        operationTime: string;
        operationRoom: string | null;
        duration: number | null;
        status: OperationStatus;
        notes: string | null;
        patientId: string;
        createdBy: string;
        specialtyId: string | null;
        catalogId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }) | null>;
    create(data: {
        name: string;
        diagnosis?: string | null;
        hospitalId: string;
        operationDate: Date;
        operationTime: string;
        operationRoom?: string;
        duration?: number;
        status?: OperationStatus;
        notes?: string;
        patientId: string;
        createdBy: string;
        specialtyId?: string | null;
        catalogId?: string | null;
        procedures?: Array<{
            catalogId?: string | null;
            name: string;
            nameAr?: string | null;
            specialtyId?: string | null;
            sortOrder: number;
        }>;
        teamMembers?: Array<{
            doctorId?: string | null;
            nurseId?: string | null;
            sortOrder: number;
        }>;
        medicalTeam?: {
            primarySurgeonId?: string;
            assistantSurgeonId?: string;
            anesthesiologistId?: string;
            assistantAnesthesiaId?: string;
            nurse?: string;
            notes?: string;
        };
        cost?: CostData;
    }): Promise<{
        catalog: ({
            specialty: {
                id: string;
                name: string;
                nameAr: string | null;
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
        }) | null;
        cost: {
            id: string;
            operationId: string;
            totalCost: import("@prisma/client-runtime-utils").Decimal;
            paidAmount: import("@prisma/client-runtime-utils").Decimal;
            remainingAmount: import("@prisma/client-runtime-utils").Decimal;
            hospitalCost: import("@prisma/client-runtime-utils").Decimal;
            nursingCost: import("@prisma/client-runtime-utils").Decimal;
            assistantDoctorsCost: import("@prisma/client-runtime-utils").Decimal;
            equipmentCost: import("@prisma/client-runtime-utils").Decimal;
            otherCost: import("@prisma/client-runtime-utils").Decimal;
            paymentMethod: import("../prisma").PaymentMethod;
            paymentStatus: import("../prisma").PaymentStatus;
            paymentNotes: string | null;
            createdAt: Date;
            updatedAt: Date;
        } | null;
        files: {
            createdAt: Date;
            fileName: string;
            filePath: string;
            fileSize: number | null;
            fileType: import("../prisma").FileType;
            id: string;
            mimeType: string | null;
            operationId: string;
        }[];
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
        medicalTeam: ({
            anesthesiologist: {
                id: string;
                name: string;
                phone: string | null;
                email: string | null;
                isActive: boolean;
                userId: string | null;
                createdBy: string | null;
                createdAt: Date;
                updatedAt: Date;
            } | null;
            assistantAnesthesia: {
                id: string;
                name: string;
                phone: string | null;
                email: string | null;
                isActive: boolean;
                userId: string | null;
                createdBy: string | null;
                createdAt: Date;
                updatedAt: Date;
            } | null;
            assistantSurgeon: {
                id: string;
                name: string;
                phone: string | null;
                email: string | null;
                isActive: boolean;
                userId: string | null;
                createdBy: string | null;
                createdAt: Date;
                updatedAt: Date;
            } | null;
            primarySurgeon: {
                id: string;
                name: string;
                phone: string | null;
                email: string | null;
                isActive: boolean;
                userId: string | null;
                createdBy: string | null;
                createdAt: Date;
                updatedAt: Date;
            } | null;
        } & {
            id: string;
            operationId: string;
            primarySurgeonId: string | null;
            assistantSurgeonId: string | null;
            anesthesiologistId: string | null;
            assistantAnesthesiaId: string | null;
            nurse: string | null;
            notes: string | null;
            createdAt: Date;
        })[];
        patient: {
            id: string;
            fullName: string;
            age: number;
            gender: import("../prisma").Gender;
            mobile: string | null;
            notes: string | null;
            createdBy: string;
            createdAt: Date;
            updatedAt: Date;
        };
        procedures: ({
            catalog: ({
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
            }) | null;
            specialty: {
                id: string;
                name: string;
                nameAr: string | null;
            } | null;
        } & {
            id: string;
            operationId: string;
            catalogId: string | null;
            name: string;
            nameAr: string | null;
            specialtyId: string | null;
            sortOrder: number;
            createdAt: Date;
        })[];
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
        teamMembers: ({
            doctor: {
                id: string;
                name: string;
                phone: string | null;
                email: string | null;
                isActive: boolean;
                userId: string | null;
                createdBy: string | null;
                createdAt: Date;
                updatedAt: Date;
            } | null;
            nurse: {
                id: string;
                name: string;
                phone: string | null;
                email: string | null;
                isActive: boolean;
                createdBy: string;
                createdAt: Date;
                updatedAt: Date;
            } | null;
        } & {
            id: string;
            operationId: string;
            doctorId: string | null;
            nurseId: string | null;
            sortOrder: number;
            createdAt: Date;
        })[];
    } & {
        id: string;
        name: string;
        diagnosis: string | null;
        hospitalId: string;
        operationDate: Date;
        operationTime: string;
        operationRoom: string | null;
        duration: number | null;
        status: OperationStatus;
        notes: string | null;
        patientId: string;
        createdBy: string;
        specialtyId: string | null;
        catalogId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    replaceProcedures(operationId: string, procedures: Array<{
        catalogId?: string | null;
        name: string;
        nameAr?: string | null;
        specialtyId?: string | null;
        sortOrder: number;
    }>): Promise<void>;
    replaceTeamMembers(operationId: string, members: Array<{
        doctorId?: string | null;
        nurseId?: string | null;
        sortOrder: number;
    }>): Promise<void>;
    update(id: string, createdBy: string, data: Prisma.OperationUpdateInput): Promise<{
        catalog: ({
            specialty: {
                id: string;
                name: string;
                nameAr: string | null;
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
        }) | null;
        cost: {
            id: string;
            operationId: string;
            totalCost: import("@prisma/client-runtime-utils").Decimal;
            paidAmount: import("@prisma/client-runtime-utils").Decimal;
            remainingAmount: import("@prisma/client-runtime-utils").Decimal;
            hospitalCost: import("@prisma/client-runtime-utils").Decimal;
            nursingCost: import("@prisma/client-runtime-utils").Decimal;
            assistantDoctorsCost: import("@prisma/client-runtime-utils").Decimal;
            equipmentCost: import("@prisma/client-runtime-utils").Decimal;
            otherCost: import("@prisma/client-runtime-utils").Decimal;
            paymentMethod: import("../prisma").PaymentMethod;
            paymentStatus: import("../prisma").PaymentStatus;
            paymentNotes: string | null;
            createdAt: Date;
            updatedAt: Date;
        } | null;
        files: {
            createdAt: Date;
            fileName: string;
            filePath: string;
            fileSize: number | null;
            fileType: import("../prisma").FileType;
            id: string;
            mimeType: string | null;
            operationId: string;
        }[];
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
        medicalTeam: ({
            anesthesiologist: {
                id: string;
                name: string;
                phone: string | null;
                email: string | null;
                isActive: boolean;
                userId: string | null;
                createdBy: string | null;
                createdAt: Date;
                updatedAt: Date;
            } | null;
            assistantAnesthesia: {
                id: string;
                name: string;
                phone: string | null;
                email: string | null;
                isActive: boolean;
                userId: string | null;
                createdBy: string | null;
                createdAt: Date;
                updatedAt: Date;
            } | null;
            assistantSurgeon: {
                id: string;
                name: string;
                phone: string | null;
                email: string | null;
                isActive: boolean;
                userId: string | null;
                createdBy: string | null;
                createdAt: Date;
                updatedAt: Date;
            } | null;
            primarySurgeon: {
                id: string;
                name: string;
                phone: string | null;
                email: string | null;
                isActive: boolean;
                userId: string | null;
                createdBy: string | null;
                createdAt: Date;
                updatedAt: Date;
            } | null;
        } & {
            id: string;
            operationId: string;
            primarySurgeonId: string | null;
            assistantSurgeonId: string | null;
            anesthesiologistId: string | null;
            assistantAnesthesiaId: string | null;
            nurse: string | null;
            notes: string | null;
            createdAt: Date;
        })[];
        patient: {
            id: string;
            fullName: string;
            age: number;
            gender: import("../prisma").Gender;
            mobile: string | null;
            notes: string | null;
            createdBy: string;
            createdAt: Date;
            updatedAt: Date;
        };
        procedures: ({
            catalog: ({
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
            }) | null;
            specialty: {
                id: string;
                name: string;
                nameAr: string | null;
            } | null;
        } & {
            id: string;
            operationId: string;
            catalogId: string | null;
            name: string;
            nameAr: string | null;
            specialtyId: string | null;
            sortOrder: number;
            createdAt: Date;
        })[];
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
        teamMembers: ({
            doctor: {
                id: string;
                name: string;
                phone: string | null;
                email: string | null;
                isActive: boolean;
                userId: string | null;
                createdBy: string | null;
                createdAt: Date;
                updatedAt: Date;
            } | null;
            nurse: {
                id: string;
                name: string;
                phone: string | null;
                email: string | null;
                isActive: boolean;
                createdBy: string;
                createdAt: Date;
                updatedAt: Date;
            } | null;
        } & {
            id: string;
            operationId: string;
            doctorId: string | null;
            nurseId: string | null;
            sortOrder: number;
            createdAt: Date;
        })[];
    } & {
        id: string;
        name: string;
        diagnosis: string | null;
        hospitalId: string;
        operationDate: Date;
        operationTime: string;
        operationRoom: string | null;
        duration: number | null;
        status: OperationStatus;
        notes: string | null;
        patientId: string;
        createdBy: string;
        specialtyId: string | null;
        catalogId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateStatus(id: string, createdBy: string, status: OperationStatus): Promise<{
        id: string;
        name: string;
        diagnosis: string | null;
        hospitalId: string;
        operationDate: Date;
        operationTime: string;
        operationRoom: string | null;
        duration: number | null;
        status: OperationStatus;
        notes: string | null;
        patientId: string;
        createdBy: string;
        specialtyId: string | null;
        catalogId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    delete(id: string, createdBy: string): Promise<{
        id: string;
        name: string;
        diagnosis: string | null;
        hospitalId: string;
        operationDate: Date;
        operationTime: string;
        operationRoom: string | null;
        duration: number | null;
        status: OperationStatus;
        notes: string | null;
        patientId: string;
        createdBy: string;
        specialtyId: string | null;
        catalogId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    upsertCost(operationId: string, data: CostData): Promise<{
        id: string;
        operationId: string;
        totalCost: import("@prisma/client-runtime-utils").Decimal;
        paidAmount: import("@prisma/client-runtime-utils").Decimal;
        remainingAmount: import("@prisma/client-runtime-utils").Decimal;
        hospitalCost: import("@prisma/client-runtime-utils").Decimal;
        nursingCost: import("@prisma/client-runtime-utils").Decimal;
        assistantDoctorsCost: import("@prisma/client-runtime-utils").Decimal;
        equipmentCost: import("@prisma/client-runtime-utils").Decimal;
        otherCost: import("@prisma/client-runtime-utils").Decimal;
        paymentMethod: import("../prisma").PaymentMethod;
        paymentStatus: import("../prisma").PaymentStatus;
        paymentNotes: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    addFile(operationId: string, data: {
        fileType: string;
        fileName: string;
        filePath: string;
        fileSize?: number;
        mimeType?: string;
        uploadedBy: string;
    }): Promise<{
        id: string;
        operationId: string;
        fileType: import("../prisma").FileType;
        fileName: string;
        filePath: string;
        fileSize: number | null;
        mimeType: string | null;
        uploadedBy: string;
        createdAt: Date;
    }>;
    deleteFile(fileId: string, uploadedBy: string): Promise<{
        id: string;
        operationId: string;
        fileType: import("../prisma").FileType;
        fileName: string;
        filePath: string;
        fileSize: number | null;
        mimeType: string | null;
        uploadedBy: string;
        createdAt: Date;
    } | null>;
    addTimeline(operationId: string, data: {
        action: string;
        description?: string;
        userId: string;
    }): Promise<{
        id: string;
        operationId: string;
        action: import("../prisma").TimelineAction;
        description: string | null;
        userId: string;
        createdAt: Date;
    }>;
    getTimeline(operationId: string): Promise<({
        user: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        operationId: string;
        action: import("../prisma").TimelineAction;
        description: string | null;
        userId: string;
        createdAt: Date;
    })[]>;
    getRecent(createdBy: string, limit?: number): Promise<({
        cost: {
            id: string;
            operationId: string;
            totalCost: import("@prisma/client-runtime-utils").Decimal;
            paidAmount: import("@prisma/client-runtime-utils").Decimal;
            remainingAmount: import("@prisma/client-runtime-utils").Decimal;
            hospitalCost: import("@prisma/client-runtime-utils").Decimal;
            nursingCost: import("@prisma/client-runtime-utils").Decimal;
            assistantDoctorsCost: import("@prisma/client-runtime-utils").Decimal;
            equipmentCost: import("@prisma/client-runtime-utils").Decimal;
            otherCost: import("@prisma/client-runtime-utils").Decimal;
            paymentMethod: import("../prisma").PaymentMethod;
            paymentStatus: import("../prisma").PaymentStatus;
            paymentNotes: string | null;
            createdAt: Date;
            updatedAt: Date;
        } | null;
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
        patient: {
            id: string;
            fullName: string;
            age: number;
            gender: import("../prisma").Gender;
            mobile: string | null;
            notes: string | null;
            createdBy: string;
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
        status: OperationStatus;
        notes: string | null;
        patientId: string;
        createdBy: string;
        specialtyId: string | null;
        catalogId: string | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    countThisMonth(createdBy: string): Promise<number>;
    countByStatus(createdBy: string): Promise<Record<string, number>>;
    countBySpecialty(createdBy: string): Promise<{
        specialtyId: string | null;
        specialtyName: string;
        count: number;
    }[]>;
    getMonthlyTrends(createdBy: string, months?: number): Promise<{
        month: string;
        total: number;
        completed: number;
    }[]>;
    getTotalRevenue(createdBy: string): Promise<{
        totalCost: number;
        totalPaid: number;
        totalRemaining: number;
    }>;
    exportData(params: {
        status?: OperationStatus;
        specialtyId?: string;
        hospitalId?: string;
        dateFrom?: string;
        dateTo?: string;
        createdBy: string;
    }): Promise<({
        cost: {
            id: string;
            operationId: string;
            totalCost: import("@prisma/client-runtime-utils").Decimal;
            paidAmount: import("@prisma/client-runtime-utils").Decimal;
            remainingAmount: import("@prisma/client-runtime-utils").Decimal;
            hospitalCost: import("@prisma/client-runtime-utils").Decimal;
            nursingCost: import("@prisma/client-runtime-utils").Decimal;
            assistantDoctorsCost: import("@prisma/client-runtime-utils").Decimal;
            equipmentCost: import("@prisma/client-runtime-utils").Decimal;
            otherCost: import("@prisma/client-runtime-utils").Decimal;
            paymentMethod: import("../prisma").PaymentMethod;
            paymentStatus: import("../prisma").PaymentStatus;
            paymentNotes: string | null;
            createdAt: Date;
            updatedAt: Date;
        } | null;
        hospital: {
            name: string;
        };
        medicalTeam: ({
            anesthesiologist: {
                name: string;
            } | null;
            assistantSurgeon: {
                name: string;
            } | null;
            primarySurgeon: {
                name: string;
            } | null;
        } & {
            id: string;
            operationId: string;
            primarySurgeonId: string | null;
            assistantSurgeonId: string | null;
            anesthesiologistId: string | null;
            assistantAnesthesiaId: string | null;
            nurse: string | null;
            notes: string | null;
            createdAt: Date;
        })[];
        patient: {
            age: number;
            fullName: string;
            gender: import("../prisma").Gender;
            mobile: string | null;
        };
        specialty: {
            name: string;
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
        status: OperationStatus;
        notes: string | null;
        patientId: string;
        createdBy: string;
        specialtyId: string | null;
        catalogId: string | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
}
export declare const operationRepo: OperationRepository;
export {};
//# sourceMappingURL=operation.repo.d.ts.map