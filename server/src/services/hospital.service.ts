import { hospitalRepo } from '../repositories/hospital.repo';
import { NotFoundError, ConflictError } from '../utils/errors';

class HospitalService {
  async getAll(params: { page: number; limit: number; search?: string }) {
    return hospitalRepo.findAll(params);
  }

  async getActive() {
    return hospitalRepo.findActive();
  }

  async getById(id: string) {
    const hospital = await hospitalRepo.findById(id);
    if (!hospital) throw new NotFoundError('Hospital');
    return hospital;
  }

  async create(data: { name: string; address?: string; phone?: string }) {
    return hospitalRepo.create(data);
  }

  async update(id: string, data: { name?: string; address?: string; phone?: string }) {
    await this.getById(id);
    return hospitalRepo.update(id, data);
  }

  async delete(id: string) {
    await this.getById(id);
    return hospitalRepo.delete(id);
  }
}

export const hospitalService = new HospitalService();
