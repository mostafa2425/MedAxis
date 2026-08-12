import { doctorRepo } from '../repositories/doctor.repo';
import { NotFoundError } from '../utils/errors';

class DoctorService {
  async getAll(params: { page: number; limit: number; search?: string; specialtyId?: string }) {
    return doctorRepo.findAll(params);
  }

  async getActive() {
    return doctorRepo.findActive();
  }

  async getById(id: string) {
    const doctor = await doctorRepo.findById(id);
    if (!doctor) throw new NotFoundError('Doctor');
    return doctor;
  }

  async create(data: { name: string; phone?: string; email?: string }, specialtyIds?: string[]) {
    return doctorRepo.create(data, specialtyIds);
  }

  async update(id: string, data: { name?: string; phone?: string; email?: string }, specialtyIds?: string[]) {
    await this.getById(id);
    await doctorRepo.update(id, data);
    if (specialtyIds !== undefined) {
      return doctorRepo.setSpecialties(id, specialtyIds);
    }
    return this.getById(id);
  }

  async delete(id: string) {
    await this.getById(id);
    return doctorRepo.delete(id);
  }
}

export const doctorService = new DoctorService();
