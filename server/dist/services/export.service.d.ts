import { OperationStatus } from '../prisma';
declare class ExportService {
    exportOperations(params: {
        format: 'json' | 'csv';
        status?: OperationStatus;
        specialtyId?: string;
        hospitalId?: string;
        dateFrom?: string;
        dateTo?: string;
        createdBy: string;
    }): Promise<{
        format: string;
        data: ({
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
        })[];
        totalRecords: number;
    } | {
        format: string;
        data: string;
        filename: string;
        totalRecords: number;
    }>;
    private toJsonCsv;
    private escapeCsv;
}
export declare const exportService: ExportService;
export {};
//# sourceMappingURL=export.service.d.ts.map