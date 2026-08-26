import { prisma } from '../utils/prisma';

export type ReportType =
  | 'operations'
  | 'patients'
  | 'follow-ups'
  | 'financial'
  | 'hospitals'
  | 'procedures';

type ReportFilters = {
  createdBy: string;
  dateFrom?: Date;
  dateTo?: Date;
  hospitalId?: string;
  specialtyId?: string;
  status?: string;
  paymentStatus?: string;
};

const decimalToNumber = (value: unknown) => Number(value ?? 0);

function dateWhere(filters: ReportFilters) {
  if (!filters.dateFrom && !filters.dateTo) return undefined;
  return {
    ...(filters.dateFrom ? { gte: filters.dateFrom } : {}),
    ...(filters.dateTo ? { lte: filters.dateTo } : {}),
  };
}

function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function buildMonthlySeries(dates: Date[]) {
  const counts = new Map<string, number>();
  dates.forEach((date) => counts.set(monthKey(date), (counts.get(monthKey(date)) ?? 0) + 1));
  return Array.from(counts.entries()).sort(([a], [b]) => a.localeCompare(b)).map(([month, value]) => ({ month, value }));
}

class ReportsService {
  async getReport(type: ReportType, filters: ReportFilters) {
    switch (type) {
      case 'operations': return this.operations(filters);
      case 'patients': return this.patients(filters);
      case 'follow-ups': return this.followUps(filters);
      case 'financial': return this.financial(filters);
      case 'hospitals': return this.hospitals(filters);
      case 'procedures': return this.procedures(filters);
    }
  }

  private operationWhere(filters: ReportFilters) {
    return {
      createdBy: filters.createdBy,
      ...(filters.hospitalId ? { hospitalId: filters.hospitalId } : {}),
      ...(filters.specialtyId ? { specialtyId: filters.specialtyId } : {}),
      ...(filters.status ? { status: filters.status as any } : {}),
      ...(dateWhere(filters) ? { operationDate: dateWhere(filters) } : {}),
    };
  }

  private async operations(filters: ReportFilters) {
    const where = this.operationWhere(filters);
    const [total, completed, scheduled, inProgress, cancelled, operations] = await Promise.all([
      prisma.operation.count({ where }),
      prisma.operation.count({ where: { ...where, status: 'COMPLETED' } }),
      prisma.operation.count({ where: { ...where, status: 'SCHEDULED' } }),
      prisma.operation.count({ where: { ...where, status: 'IN_PROGRESS' } }),
      prisma.operation.count({ where: { ...where, status: 'CANCELLED' } }),
      prisma.operation.findMany({ where, take: 5000, orderBy: { operationDate: 'desc' }, select: { id: true, name: true, operationDate: true, operationTime: true, status: true, patient: { select: { fullName: true } }, hospital: { select: { name: true, nameAr: true } }, specialty: { select: { name: true, nameAr: true } } } }),
    ]);
    return {
      summary: { total, completed, scheduled, inProgress, cancelled },
      series: buildMonthlySeries(operations.map((item) => item.operationDate)),
      rows: operations.map((item) => ({ id: item.id, operation: item.name, patient: item.patient.fullName, hospital: item.hospital.name, hospitalAr: item.hospital.nameAr, specialty: item.specialty?.name ?? null, specialtyAr: item.specialty?.nameAr ?? null, date: item.operationDate, time: item.operationTime, status: item.status })),
    };
  }

  private async patients(filters: ReportFilters) {
    const createdAt = dateWhere(filters);
    const [total, newPatients, patients] = await Promise.all([
      prisma.patient.count({ where: { createdBy: filters.createdBy } }),
      prisma.patient.count({ where: { createdBy: filters.createdBy, ...(createdAt ? { createdAt } : {}) } }),
      prisma.patient.findMany({ where: { createdBy: filters.createdBy, ...(createdAt ? { createdAt } : {}) }, take: 5000, orderBy: { createdAt: 'desc' }, include: { _count: { select: { operations: true } } } }),
    ]);
    const withOperations = patients.filter((item) => item._count.operations > 0).length;
    const byGender = patients.reduce<Record<string, number>>((acc, item) => { acc[item.gender] = (acc[item.gender] ?? 0) + 1; return acc; }, {});
    return {
      summary: { total, newPatients, withOperations },
      series: buildMonthlySeries(patients.map((item) => item.createdAt)),
      breakdown: Object.entries(byGender).map(([label, value]) => ({ label, value })),
      rows: patients.map((item) => ({ id: item.id, name: item.fullName, age: item.age, gender: item.gender, mobile: item.mobile, operations: item._count.operations, createdAt: item.createdAt })),
    };
  }

  private async followUps(filters: ReportFilters) {
    const where = {
      operation: this.operationWhere(filters),
      ...(dateWhere(filters) ? { scheduledAt: dateWhere(filters) } : {}),
      ...(filters.status ? { status: filters.status } : {}),
    };
    const [total, upcoming, overdue, completed, cancelled, items] = await Promise.all([
      prisma.operationFollowUp.count({ where }),
      prisma.operationFollowUp.count({ where: { ...where, status: 'UPCOMING' } }),
      prisma.operationFollowUp.count({ where: { ...where, status: 'OVERDUE' } }),
      prisma.operationFollowUp.count({ where: { ...where, status: 'COMPLETED' } }),
      prisma.operationFollowUp.count({ where: { ...where, status: 'CANCELLED' } }),
      prisma.operationFollowUp.findMany({ where, take: 5000, orderBy: { scheduledAt: 'desc' }, include: { operation: { select: { id: true, name: true, patient: { select: { fullName: true } }, hospital: { select: { name: true, nameAr: true } } } } } }),
    ]);
    return {
      summary: { total, upcoming, overdue, completed, cancelled },
      series: buildMonthlySeries(items.map((item) => item.scheduledAt)),
      rows: items.map((item) => ({ id: item.id, title: item.title, patient: item.operation.patient.fullName, operation: item.operation.name, hospital: item.operation.hospital.name, hospitalAr: item.operation.hospital.nameAr, scheduledAt: item.scheduledAt, completedAt: item.completedAt, status: item.status })),
    };
  }

  private async financial(filters: ReportFilters) {
    const where = { operation: this.operationWhere(filters), ...(filters.paymentStatus ? { paymentStatus: filters.paymentStatus as any } : {}) };
    const [aggregate, paidCount, unpaidCount, partialCount, costs] = await Promise.all([
      prisma.operationCost.aggregate({ where, _sum: { totalCost: true, paidAmount: true, remainingAmount: true } }),
      prisma.operationCost.count({ where: { ...where, paymentStatus: 'PAID' } }),
      prisma.operationCost.count({ where: { ...where, paymentStatus: 'UNPAID' } }),
      prisma.operationCost.count({ where: { ...where, paymentStatus: 'PARTIAL' } }),
      prisma.operationCost.findMany({ where, take: 5000, orderBy: { updatedAt: 'desc' }, include: { operation: { select: { id: true, name: true, operationDate: true, patient: { select: { fullName: true } }, hospital: { select: { name: true, nameAr: true } } } } } }),
    ]);
    const total = decimalToNumber(aggregate._sum.totalCost);
    const paid = decimalToNumber(aggregate._sum.paidAmount);
    const remaining = decimalToNumber(aggregate._sum.remainingAmount);
    return {
      summary: { total, paid, remaining, paidCount, unpaidCount, partialCount, collectionRate: total ? Math.round((paid / total) * 100) : 0 },
      series: buildMonthlySeries(costs.map((item) => item.operation.operationDate)),
      rows: costs.map((item) => ({ id: item.id, operationId: item.operation.id, operation: item.operation.name, patient: item.operation.patient.fullName, hospital: item.operation.hospital.name, hospitalAr: item.operation.hospital.nameAr, date: item.operation.operationDate, totalCost: decimalToNumber(item.totalCost), paidAmount: decimalToNumber(item.paidAmount), remainingAmount: decimalToNumber(item.remainingAmount), paymentStatus: item.paymentStatus, paymentMethod: item.paymentMethod })),
    };
  }

  private async hospitals(filters: ReportFilters) {
    const where = this.operationWhere(filters);
    const grouped = await prisma.operation.groupBy({ by: ['hospitalId'], where, _count: { id: true } });
    const hospitalIds = grouped.map((item) => item.hospitalId);
    const hospitals = await prisma.hospital.findMany({ where: { id: { in: hospitalIds } }, select: { id: true, name: true, nameAr: true, city: true, governorate: { select: { nameEn: true, nameAr: true } } } });
    const costs = await prisma.operationCost.findMany({ where: { operation: where }, select: { operation: { select: { hospitalId: true } }, totalCost: true, paidAmount: true, remainingAmount: true } });
    const costMap = new Map<string, { total: number; paid: number; remaining: number }>();
    costs.forEach((item) => { const current = costMap.get(item.operation.hospitalId) ?? { total: 0, paid: 0, remaining: 0 }; current.total += decimalToNumber(item.totalCost); current.paid += decimalToNumber(item.paidAmount); current.remaining += decimalToNumber(item.remainingAmount); costMap.set(item.operation.hospitalId, current); });
    const hospitalMap = new Map(hospitals.map((item) => [item.id, item]));
    const rows = grouped.map((item) => { const hospital = hospitalMap.get(item.hospitalId); const money = costMap.get(item.hospitalId) ?? { total: 0, paid: 0, remaining: 0 }; return { id: item.hospitalId, name: hospital?.name ?? 'Unknown', nameAr: hospital?.nameAr, city: hospital?.city, governorate: hospital?.governorate?.nameEn, governorateAr: hospital?.governorate?.nameAr, operations: item._count.id, ...money }; }).sort((a, b) => b.operations - a.operations);
    return { summary: { hospitals: rows.length, operations: rows.reduce((sum, item) => sum + item.operations, 0), revenue: rows.reduce((sum, item) => sum + item.total, 0) }, series: rows.slice(0, 10).map((item) => ({ label: item.name, value: item.operations })), rows };
  }

  private async procedures(filters: ReportFilters) {
    const operations = await prisma.operation.findMany({ where: this.operationWhere(filters), take: 5000, select: { procedures: { select: { id: true, name: true, nameAr: true, specialty: { select: { name: true, nameAr: true } } } } } });
    const map = new Map<string, { name: string; nameAr: string | null; specialty: string | null; specialtyAr: string | null; count: number }>();
    operations.forEach((operation) => operation.procedures.forEach((procedure) => { const key = procedure.id; const current = map.get(key) ?? { name: procedure.name, nameAr: procedure.nameAr, specialty: procedure.specialty?.name ?? null, specialtyAr: procedure.specialty?.nameAr ?? null, count: 0 }; current.count += 1; map.set(key, current); }));
    const rows = Array.from(map.entries()).map(([id, item]) => ({ id, ...item })).sort((a, b) => b.count - a.count);
    return { summary: { procedures: rows.length, totalUses: rows.reduce((sum, item) => sum + item.count, 0) }, series: rows.slice(0, 10).map((item) => ({ label: item.name, value: item.count })), rows };
  }
}

export const reportsService = new ReportsService();
