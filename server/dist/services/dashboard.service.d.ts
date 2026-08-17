declare class DashboardService {
    getStats(createdBy: string): Promise<{
        totalOperations: number;
        completedOperations: number;
        pendingOperations: number;
        cancelledOperations: number;
        operationsThisMonth: number;
        totalPatients: number;
        totalDoctors: number;
        totalNurses: number;
        totalHospitals: number;
        statusBreakdown: Record<string, number>;
        recentOperations: ({
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
            status: import("../prisma").OperationStatus;
            notes: string | null;
            patientId: string;
            createdBy: string;
            specialtyId: string | null;
            catalogId: string | null;
            createdAt: Date;
            updatedAt: Date;
        })[];
        recentPatients: {
            id: string;
            fullName: string;
            age: number;
            gender: import("../prisma").Gender;
            mobile: string | null;
            notes: string | null;
            createdBy: string;
            createdAt: Date;
            updatedAt: Date;
        }[];
        revenue: {
            totalCost: number;
            totalPaid: number;
            totalRemaining: number;
        };
    }>;
    getRecentOperations(createdBy: string, limit?: number): Promise<({
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
        status: import("../prisma").OperationStatus;
        notes: string | null;
        patientId: string;
        createdBy: string;
        specialtyId: string | null;
        catalogId: string | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    getSpecialtyDistribution(createdBy: string): Promise<{
        specialtyId: string | null;
        specialtyName: string;
        count: number;
    }[]>;
    getMonthlyTrends(createdBy: string, months?: number): Promise<{
        month: string;
        total: number;
        completed: number;
    }[]>;
    getRevenue(createdBy: string): Promise<{
        totalCost: number;
        totalPaid: number;
        totalRemaining: number;
    }>;
}
export declare const dashboardService: DashboardService;
export {};
//# sourceMappingURL=dashboard.service.d.ts.map