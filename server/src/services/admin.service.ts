import { adminRepo } from '../repositories/admin.repo';

export class AdminService {
  async getOverview() { return adminRepo.getOverview(); }
  async users(search?: string) { return adminRepo.listUsers(search); }
  async updateUser(id: string, data: { role?: string; isActive?: boolean }) { return adminRepo.setUser(id, data); }
  async doctors(search?: string) { return adminRepo.listDoctors(search); }
  async updateDoctor(id: string, isActive: boolean) { return adminRepo.setDoctor(id, isActive); }
  async patients(search?: string) { return adminRepo.listPatients(search); }
  async hospitals(search?: string) { return adminRepo.listHospitals(search); }
  async updateHospital(id: string, isActive: boolean) { return adminRepo.setHospital(id, isActive); }
  async operations(params: { search?: string; status?: string }) { return adminRepo.listOperations(params); }
  async analytics() { return adminRepo.analytics(); }
  async auditLogs() { return adminRepo.auditLogs(); }
}
export const adminService = new AdminService();
