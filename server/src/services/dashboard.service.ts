import { operationRepo } from '../repositories/operation.repo';
import { operationFollowUpRepo } from '../repositories/operationFollowUp.repo';
import { patientRepo } from '../repositories/patient.repo';
import { doctorRepo } from '../repositories/doctor.repo';
import { nurseRepo } from '../repositories/nurse.repo';
import { hospitalRepo } from '../repositories/hospital.repo';

class DashboardService {
  async getStats(createdBy: string) {
    const [statusCounts, recentOps, recentPatients, revenue, operationsThisMonth, totalPatients, totalDoctors, totalNurses, totalHospitals] = await Promise.all([
      operationRepo.countByStatus(createdBy), operationRepo.getRecent(createdBy, 5), patientRepo.findRecent(createdBy, 5), operationRepo.getTotalRevenue(createdBy),
      operationRepo.countThisMonth(createdBy), patientRepo.count(createdBy), doctorRepo.countForUser(createdBy), nurseRepo.countForUser(createdBy), hospitalRepo.countForUser(createdBy),
    ]);
    const totalOperations = Object.values(statusCounts).reduce((a, b) => a + b, 0);
    return {
      totalOperations, completedOperations: statusCounts.COMPLETED ?? 0, pendingOperations: (statusCounts.SCHEDULED ?? 0) + (statusCounts.IN_PROGRESS ?? 0),
      cancelledOperations: statusCounts.CANCELLED ?? 0, operationsThisMonth, totalPatients, totalDoctors, totalNurses, totalHospitals,
      statusBreakdown: statusCounts, recentOperations: recentOps, recentPatients,
      revenue: { totalCost: revenue.totalCost, totalPaid: revenue.totalPaid, totalRemaining: revenue.totalRemaining },
    };
  }

  async getOverview(createdBy: string) {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    const nextWeek = new Date(start);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const [todayResult, upcomingResult, followUps, stats, specialtyDistribution] = await Promise.all([
      operationRepo.findAll({ page: 1, limit: 8, dateFrom: start.toISOString(), dateTo: end.toISOString(), sortBy: 'operationDate', sortOrder: 'asc', createdBy }),
      operationRepo.findAll({ page: 1, limit: 8, dateFrom: end.toISOString(), dateTo: nextWeek.toISOString(), sortBy: 'operationDate', sortOrder: 'asc', createdBy }),
      operationFollowUpRepo.findAllForDoctor(createdBy, { from: start, to: nextWeek }),
      this.getStats(createdBy),
      operationRepo.countBySpecialty(createdBy),
    ]);

    return {
      todayOperations: todayResult.data,
      upcomingOperations: upcomingResult.data,
      followUps: followUps.slice(0, 8),
      followUpSummary: {
        overdue: followUps.filter((item) => item.status === 'OVERDUE').length,
        upcoming: followUps.filter((item) => item.status === 'UPCOMING').length,
        completed: followUps.filter((item) => item.status === 'COMPLETED').length,
        cancelled: followUps.filter((item) => item.status === 'CANCELLED').length,
      },
      stats,
      caseMix: specialtyDistribution,
    };
  }

  async getRecentOperations(createdBy: string, limit = 10) { return operationRepo.getRecent(createdBy, limit); }
  async getSpecialtyDistribution(createdBy: string) { return operationRepo.countBySpecialty(createdBy); }
  async getMonthlyTrends(createdBy: string, months = 12) { return operationRepo.getMonthlyTrends(createdBy, months); }
  async getRevenue(createdBy: string) { return operationRepo.getTotalRevenue(createdBy); }
}

export const dashboardService = new DashboardService();
