"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardService = void 0;
const operation_repo_1 = require("../repositories/operation.repo");
const patient_repo_1 = require("../repositories/patient.repo");
const doctor_repo_1 = require("../repositories/doctor.repo");
const nurse_repo_1 = require("../repositories/nurse.repo");
const hospital_repo_1 = require("../repositories/hospital.repo");
class DashboardService {
    async getStats(createdBy) {
        const [statusCounts, recentOps, recentPatients, revenue, operationsThisMonth, totalPatients, totalDoctors, totalNurses, totalHospitals,] = await Promise.all([
            operation_repo_1.operationRepo.countByStatus(createdBy),
            operation_repo_1.operationRepo.getRecent(createdBy, 5),
            patient_repo_1.patientRepo.findRecent(createdBy, 5),
            operation_repo_1.operationRepo.getTotalRevenue(createdBy),
            operation_repo_1.operationRepo.countThisMonth(createdBy),
            patient_repo_1.patientRepo.count(createdBy),
            doctor_repo_1.doctorRepo.countForUser(createdBy),
            nurse_repo_1.nurseRepo.countForUser(createdBy),
            hospital_repo_1.hospitalRepo.countForUser(createdBy),
        ]);
        const totalOperations = Object.values(statusCounts).reduce((a, b) => a + b, 0);
        const completedOperations = statusCounts.COMPLETED ?? 0;
        const pendingOperations = (statusCounts.SCHEDULED ?? 0) + (statusCounts.IN_PROGRESS ?? 0);
        return {
            totalOperations,
            completedOperations,
            pendingOperations,
            cancelledOperations: statusCounts.CANCELLED ?? 0,
            operationsThisMonth,
            totalPatients,
            totalDoctors,
            totalNurses,
            totalHospitals,
            statusBreakdown: statusCounts,
            recentOperations: recentOps,
            recentPatients,
            revenue: {
                totalCost: revenue.totalCost,
                totalPaid: revenue.totalPaid,
                totalRemaining: revenue.totalRemaining,
            },
        };
    }
    async getRecentOperations(createdBy, limit = 10) {
        return operation_repo_1.operationRepo.getRecent(createdBy, limit);
    }
    async getSpecialtyDistribution(createdBy) {
        return operation_repo_1.operationRepo.countBySpecialty(createdBy);
    }
    async getMonthlyTrends(createdBy, months = 12) {
        return operation_repo_1.operationRepo.getMonthlyTrends(createdBy, months);
    }
    async getRevenue(createdBy) {
        return operation_repo_1.operationRepo.getTotalRevenue(createdBy);
    }
}
exports.dashboardService = new DashboardService();
//# sourceMappingURL=dashboard.service.js.map