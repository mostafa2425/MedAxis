import { hospitalRepo } from '../repositories/hospital.repo';
import { NotFoundError } from '../utils/errors';

export type HospitalInput = {
  name: string;
  nameAr?: string;
  address?: string;
  city?: string;
  governorateId?: string;
  phone?: string;
  notes?: string;
};

class HospitalService {
  async getAll(params: { page: number; limit: number; search?: string; governorateId?: string; userId: string }) {
    return hospitalRepo.findAll(params);
  }

  async getActive(userId: string) {
    return hospitalRepo.findActive(userId);
  }

  async getById(id: string, userId: string) {
    const hospital = await hospitalRepo.findById(id, userId);
    if (!hospital) throw new NotFoundError('Hospital');
    return hospital;
  }

  async assertAccessible(id: string, userId: string) {
    await this.getById(id, userId);
  }

  async create(data: HospitalInput, userId: string) {
    return hospitalRepo.create({ ...data, createdBy: userId });
  }

  async update(id: string, userId: string, data: Partial<HospitalInput>) {
    const owned = await hospitalRepo.findOwned(id, userId);
    if (!owned) throw new NotFoundError('Hospital');
    return hospitalRepo.update(id, data);
  }

  async delete(id: string, userId: string) {
    const owned = await hospitalRepo.findOwned(id, userId);
    if (!owned) throw new NotFoundError('Hospital');
    return hospitalRepo.delete(id);
  }
}

export const hospitalService = new HospitalService();
