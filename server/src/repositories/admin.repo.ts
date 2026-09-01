import { prisma } from '../utils/prisma';

export class AdminRepository {
  async getOverview() {
    const [users, doctors, patients, operations, hospitals, activeUsers, activeDoctors, activeHospitals, revenue] = await Promise.all([
      prisma.user.count(),
      prisma.doctor.count(),
      prisma.patient.count(),
      prisma.operation.count(),
      prisma.hospital.count(),
      prisma.user.count({ where: { isActive: true } }),
      prisma.doctor.count({ where: { isActive: true } }),
      prisma.hospital.count({ where: { isActive: true } }),
      prisma.operationCost.aggregate({ _sum: { totalCost: true, paidAmount: true, remainingAmount: true } }),
    ]);

    return {
      users,
      doctors,
      patients,
      operations,
      hospitals,
      activeUsers,
      activeDoctors,
      activeHospitals,
      revenue: {
        totalCost: revenue._sum.totalCost ?? 0,
        totalPaid: revenue._sum.paidAmount ?? 0,
        totalRemaining: revenue._sum.remainingAmount ?? 0,
      },
    };
  }
}

export const adminRepo = new AdminRepository();
