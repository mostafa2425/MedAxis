import { specialtyRepo } from '../repositories/specialty.repo';
import { NotFoundError, ConflictError } from '../utils/errors';

class SpecialtyService {
  async getAll() {
    return specialtyRepo.findAll();
  }

  async getById(id: string) {
    const specialty = await specialtyRepo.findById(id);
    if (!specialty) throw new NotFoundError('Specialty');
    return specialty;
  }

  async create(data: { name: string; nameAr?: string; icon?: string }) {
    const existing = await specialtyRepo.findByName(data.name);
    if (existing) throw new ConflictError('Specialty with this name');
    return specialtyRepo.create(data);
  }

  async update(id: string, data: { name?: string; nameAr?: string; icon?: string }) {
    await this.getById(id);
    if (data.name) {
      const existing = await specialtyRepo.findByName(data.name);
      if (existing && existing.id !== id) throw new ConflictError('Specialty with this name');
    }
    return specialtyRepo.update(id, data);
  }

  async delete(id: string) {
    await this.getById(id);
    return specialtyRepo.delete(id);
  }

  async getWithOperationsCount() {
    return specialtyRepo.findWithOperationsCount();
  }
}

export const specialtyService = new SpecialtyService();
