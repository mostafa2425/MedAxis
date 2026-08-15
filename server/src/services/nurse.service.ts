import { nurseRepo } from '../repositories/nurse.repo';
import { NotFoundError } from '../utils/errors';
import type { CreateNurseInput, UpdateNurseInput } from '../validators/nurse.validator';

class NurseService {
  async getAll(params: { page: number; limit: number; search?: string; userId: string }) {
    return nurseRepo.findAll(params);
  }

  async getActive(userId: string) {
    return nurseRepo.findActive(userId);
  }

  async getById(id: string, userId: string) {
    const nurse = await nurseRepo.findById(id, userId);
    if (!nurse) throw new NotFoundError('Nurse');
    return nurse;
  }

  async assertAccessible(id: string, userId: string) {
    await this.getById(id, userId);
  }

  async create(input: CreateNurseInput, userId: string) {
    const duplicate = await nurseRepo.findDuplicate(userId, input.name, input.email);
    if (duplicate) return duplicate;
    return nurseRepo.create({
      name: input.name,
      phone: input.phone ?? null,
      email: input.email ?? null,
      createdBy: userId,
    });
  }

  async update(id: string, userId: string, input: UpdateNurseInput) {
    await this.getById(id, userId);
    return nurseRepo.update(id, input);
  }

  async delete(id: string, userId: string) {
    await this.getById(id, userId);
    return nurseRepo.delete(id);
  }
}

export const nurseService = new NurseService();
