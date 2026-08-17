import { OperationStatus, FileType } from '../prisma';
type TeamInput = {
    doctorIds?: string[];
    nurseIds?: string[];
    primarySurgeonId?: string;
    assistantSurgeonId?: string;
    anesthesiologistId?: string;
    assistantAnesthesiaId?: string;
    nurse?: string;
    notes?: string;
};
declare class OperationService {
    getAll(params: {
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
        total: number;
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
                fileType: FileType;
                id: string;
                mimeType: string | null;
                operationId: string;
            }[];
            hospital: {
                id: string;
                name: string;
                address: string | null;
                phone: string | null;
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
    }>;
    getById(id: string, createdBy: string): Promise<{
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
            fileType: FileType;
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
            address: string | null;
            phone: string | null;
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
    }>;
    private assertHospital;
    private assertDoctors;
    private assertNurses;
    private buildTeam;
    create(data: {
        operationId?: string;
        operationIds?: string[];
        name?: string;
        diagnosis?: string | null;
        hospitalId: string;
        operationDate: string;
        operationTime: string;
        operationRoom?: string;
        duration?: number;
        status?: OperationStatus;
        notes?: string;
        patientId: string;
        specialtyId?: string;
        medicalTeam?: TeamInput;
        cost?: {
            totalCost: number;
            paidAmount?: number;
            remainingAmount?: number;
            paymentMethod?: string;
            paymentStatus?: string;
            paymentNotes?: string;
        };
    }, createdBy: string): Promise<{
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
            fileType: FileType;
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
            address: string | null;
            phone: string | null;
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
    }>;
    update(id: string, createdBy: string, data: {
        operationId?: string;
        operationIds?: string[];
        name?: string;
        diagnosis?: string | null;
        hospitalId?: string;
        operationDate?: string;
        operationTime?: string;
        operationRoom?: string;
        duration?: number;
        notes?: string;
        patientId?: string;
        specialtyId?: string;
        status?: OperationStatus;
        medicalTeam?: TeamInput;
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
            fileType: FileType;
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
            address: string | null;
            phone: string | null;
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
    updateCost(id: string, createdBy: string, data: {
        totalCost: number;
        paidAmount?: number;
        remainingAmount?: number;
        paymentMethod?: string;
        paymentStatus?: string;
        paymentNotes?: string;
    }): Promise<{
        id: string;
        operationId: string;
        totalCost: import("@prisma/client-runtime-utils").Decimal;
        paidAmount: import("@prisma/client-runtime-utils").Decimal;
        remainingAmount: import("@prisma/client-runtime-utils").Decimal;
        paymentMethod: import("../prisma").PaymentMethod;
        paymentStatus: import("../prisma").PaymentStatus;
        paymentNotes: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    uploadFiles(id: string, createdBy: string, files: Express.Multer.File[], fileType: FileType): Promise<({
        id: string;
        operationId: string;
        fileType: FileType;
        fileName: string;
        filePath: string;
        fileSize: number | null;
        mimeType: string | null;
        uploadedBy: string;
        createdAt: Date;
    } & {
        url: string;
        fileUrl: string;
    })[]>;
    createFileUploadUrl(id: string, createdBy: string, input: {
        fileName: string;
        mimeType: string;
        fileSize: number;
        fileType: FileType;
    }): Promise<{
        path: string;
        token: string;
        signedUrl: string;
        expiresIn: number;
        fileName: string;
        mimeType: string;
        fileSize: number;
        fileType: FileType;
    }>;
    completeFileUpload(id: string, createdBy: string, input: {
        filePath: string;
        fileName: string;
        mimeType: string;
        fileSize: number;
        fileType: FileType;
    }): Promise<({
        id: string;
        operationId: string;
        fileType: FileType;
        fileName: string;
        filePath: string;
        fileSize: number | null;
        mimeType: string | null;
        uploadedBy: string;
        createdAt: Date;
    } & {
        url: string;
        fileUrl: string;
    }) | ({
        uploader: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        operationId: string;
        fileType: FileType;
        fileName: string;
        filePath: string;
        fileSize: number | null;
        mimeType: string | null;
        uploadedBy: string;
        createdAt: Date;
    })>;
    getFileDownloadUrl(operationId: string, fileId: string, createdBy: string): Promise<{
        url: string;
        expiresIn: number;
    }>;
    deleteFile(operationId: string, fileId: string, createdBy: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getTimeline(operationId: string, createdBy: string): Promise<({
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
            paymentMethod: import("../prisma").PaymentMethod;
            paymentStatus: import("../prisma").PaymentStatus;
            paymentNotes: string | null;
            createdAt: Date;
            updatedAt: Date;
        } | null;
        hospital: {
            id: string;
            name: string;
            address: string | null;
            phone: string | null;
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
}
export declare const operationService: OperationService;
export {};
//# sourceMappingURL=operation.service.d.ts.map