import { operationRepo } from '../repositories/operation.repo';
import { patientRepo } from '../repositories/patient.repo';

class DashboardService {
  async getStats(createdBy: string) {
    const [statusCounts, recentOps, recentPatients, revenue] = await Promise.all([
      operationRepo.countByStatus(createdBy),
      operationRepo.getRecent(createdBy, 5),
      patientRepo.findRecent(createdBy, 5),
      operationRepo.getTotalRevenue(createdBy),
    ]);

    const totalOperations = Object.values(statusCounts).reduce((a, b) => a + b, 0);

    return {
      totalOperations,
      statusBreakdown: statusCounts,
      recentOperations: recentOps,
      recentPatients,
      revenue,
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
