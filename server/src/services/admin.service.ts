import { adminRepo } from '../repositories/admin.repo';

export class AdminService {
  async getOverview() {
    return adminRepo.getOverview();
  }
}

export const adminService = new AdminService();
