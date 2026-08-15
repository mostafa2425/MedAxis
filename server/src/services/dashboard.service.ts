import { operationRepo } from '../repositories/operation.repo';
import { patientRepo } from '../repositories/patient.repo';
import { doctorRepo } from '../repositories/doctor.repo';
import { nurseRepo } from '../repositories/nurse.repo';
import { hospitalRepo } from '../repositories/hospital.repo';

class DashboardService {
  async getStats(createdBy: string) {
    const [
      statusCounts,
      recentOps,
      recentPatients,
      revenue,
      operationsThisMonth,
      totalPatients,
      totalDoctors,
      totalNurses,
      totalHospitals,
    ] = await Promise.all([
      operationRepo.countByStatus(createdBy),
      operationRepo.getRecent(createdBy, 5),
      patientRepo.findRecent(createdBy, 5),
      operationRepo.getTotalRevenue(createdBy),
      operationRepo.countThisMonth(createdBy),
      patientRepo.count(createdBy),
      doctorRepo.countForUser(createdBy),
      nurseRepo.countForUser(createdBy),
      hospitalRepo.countForUser(createdBy),
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

  async getRecentOperations(createdBy: string, limit = 10) {
    return operationRepo.getRecent(createdBy, limit);
  }

  async getSpecialtyDistribution(createdBy: string) {
    return operationRepo.countBySpecialty(createdBy);
  }

  async getMonthlyTrends(createdBy: string, months = 12) {
    return operationRepo.getMonthlyTrends(createdBy, months);
  }

  async getRevenue(createdBy: string) {
    return operationRepo.getTotalRevenue(createdBy);
  }
}

export const dashboardService = new DashboardService();
