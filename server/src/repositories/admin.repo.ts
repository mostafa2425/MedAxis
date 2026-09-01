import { prisma } from '../utils/prisma';
import { Prisma } from '../prisma';

const userSelect = { id: true, name: true, email: true, phone: true, role: true, isActive: true, avatarUrl: true, emailVerifiedAt: true, createdAt: true } as const;

export class AdminRepository {
  async getOverview() {
    const [users, doctors, patients, operations, hospitals, activeUsers, activeDoctors, activeHospitals, revenue, status, recentOperations] = await Promise.all([
      prisma.user.count(), prisma.doctor.count(), prisma.patient.count(), prisma.operation.count(), prisma.hospital.count(),
      prisma.user.count({ where: { isActive: true } }), prisma.doctor.count({ where: { isActive: true } }), prisma.hospital.count({ where: { isActive: true } }),
      prisma.operationCost.aggregate({ _sum: { totalCost: true, paidAmount: true, remainingAmount: true } }),
      prisma.operation.groupBy({ by: ['status'], _count: { status: true } }),
      prisma.operation.findMany({ take: 8, orderBy: { createdAt: 'desc' }, select: { id: true, name: true, status: true, operationDate: true, patient: { select: { fullName: true } }, hospital: { select: { name: true } } } }),
    ]);
    return { users, doctors, patients, operations, hospitals, activeUsers, activeDoctors, activeHospitals,
      revenue: { totalCost: revenue._sum.totalCost ?? 0, totalPaid: revenue._sum.paidAmount ?? 0, totalRemaining: revenue._sum.remainingAmount ?? 0 },
      operationStatus: status.map((item) => ({ status: item.status, count: item._count.status })), recentOperations };
  }
  async listUsers(search?: string) {
    const where: Prisma.UserWhereInput = search ? { OR: [{ name: { contains: search, mode: 'insensitive' } }, { email: { contains: search, mode: 'insensitive' } }] } : {};
    return prisma.user.findMany({ where, select: userSelect, orderBy: { createdAt: 'desc' }, take: 200 });
  }
  async setUser(id: string, data: { role?: string; isActive?: boolean }) { return prisma.user.update({ where: { id }, data, select: userSelect }); }
  async listDoctors(search?: string) {
    const where: Prisma.DoctorWhereInput = search ? { OR: [{ name: { contains: search, mode: 'insensitive' } }, { email: { contains: search, mode: 'insensitive' } }, { phone: { contains: search, mode: 'insensitive' } }] } : {};
    return prisma.doctor.findMany({ where, include: { user: { select: { id: true, email: true, role: true, isActive: true } }, specialties: { include: { specialty: true } }, _count: { select: { primarySurgeon: true, assistant: true, anesthesiologist: true } } }, orderBy: { name: 'asc' }, take: 300 });
  }
  async setDoctor(id: string, isActive: boolean) { return prisma.doctor.update({ where: { id }, data: { isActive } }); }
  async listPatients(search?: string) {
    const where: Prisma.PatientWhereInput = search ? { OR: [{ fullName: { contains: search, mode: 'insensitive' } }, { mobile: { contains: search, mode: 'insensitive' } }] } : {};
    return prisma.patient.findMany({ where, include: { _count: { select: { operations: true } } }, orderBy: { updatedAt: 'desc' }, take: 300 });
  }
  async listHospitals(search?: string) {
    const where: Prisma.HospitalWhereInput = search ? { OR: [{ name: { contains: search, mode: 'insensitive' } }, { city: { contains: search, mode: 'insensitive' } }] } : {};
    return prisma.hospital.findMany({ where, include: { governorate: true, _count: { select: { operations: true } } }, orderBy: { name: 'asc' }, take: 300 });
  }
  async setHospital(id: string, isActive: boolean) { return prisma.hospital.update({ where: { id }, data: { isActive } }); }
  async listOperations(params: { search?: string; status?: string }) {
    const where: Prisma.OperationWhereInput = {};
    if (params.status) where.status = params.status as any;
    if (params.search) where.OR = [{ name: { contains: params.search, mode: 'insensitive' } }, { patient: { fullName: { contains: params.search, mode: 'insensitive' } } }, { hospital: { name: { contains: params.search, mode: 'insensitive' } } }];
    return prisma.operation.findMany({ where, include: { patient: true, hospital: true, specialty: true, cost: true }, orderBy: { operationDate: 'desc' }, take: 500 });
  }
  async analytics() {
    const [bySpecialty, byHospital, monthly, followUps, files] = await Promise.all([
      prisma.operation.groupBy({ by: ['specialtyId'], _count: { id: true } }), prisma.operation.groupBy({ by: ['hospitalId'], _count: { id: true } }),
      prisma.operation.findMany({ select: { operationDate: true, status: true }, orderBy: { operationDate: 'asc' }, take: 5000 }),
      prisma.operationFollowUp.groupBy({ by: ['status'], _count: { id: true } }), prisma.operationFile.count(),
    ]);
    const [specialties, hospitals] = await Promise.all([
      prisma.specialty.findMany({ where: { id: { in: bySpecialty.map((x) => x.specialtyId).filter(Boolean) as string[] } }, select: { id: true, name: true } }),
      prisma.hospital.findMany({ where: { id: { in: byHospital.map((x) => x.hospitalId) } }, select: { id: true, name: true } }),
    ]);
    const sm = new Map(specialties.map((x) => [x.id, x.name])); const hm = new Map(hospitals.map((x) => [x.id, x.name])); const months = new Map<string, number>();
    for (const op of monthly) { const key = `${op.operationDate.getFullYear()}-${String(op.operationDate.getMonth() + 1).padStart(2, '0')}`; months.set(key, (months.get(key) ?? 0) + 1); }
    return { bySpecialty: bySpecialty.map((x) => ({ name: x.specialtyId ? sm.get(x.specialtyId) ?? 'Unknown' : 'Unassigned', count: x._count.id })).sort((a,b)=>b.count-a.count), byHospital: byHospital.map((x) => ({ name: hm.get(x.hospitalId) ?? 'Unknown', count: x._count.id })).sort((a,b)=>b.count-a.count), monthly: [...months].map(([month,count])=>({month,count})), followUps, files };
  }
  async auditLogs() { return prisma.operationTimeline.findMany({ take: 500, orderBy: { createdAt: 'desc' }, include: { user: { select: { id: true, name: true, email: true } }, operation: { select: { id: true, name: true } } } }); }
}
export const adminRepo = new AdminRepository();
