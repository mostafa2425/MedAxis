import { specialtyRepo } from '../repositories/specialty.repo';
import { NotFoundError, ConflictError, BadRequestError } from '../utils/errors';

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

  async assertTopLevelSpecialtyIds(ids: string[]) {
    const unique = [...new Set(ids)];
    if (unique.length === 0) {
      throw new BadRequestError('Please select at least one specialty', [
        {
          path: ['specialtyIds'],
          code: 'too_small',
          message: 'Please select at least one specialty',
        },
      ]);
    }

    const found = await specialtyRepo.findByIds(unique);
    if (found.length !== unique.length) {
      throw new BadRequestError('One or more specialty IDs are invalid', [
        {
          path: ['specialtyIds'],
          code: 'custom',
          message: 'One or more specialty IDs are invalid',
        },
      ]);
    }

    const nested = found.filter((specialty) => specialty.parentId);
    if (nested.length > 0) {
      throw new BadRequestError('Areas of expertise cannot be used as top-level specialties', [
        {
          path: ['specialtyIds'],
          code: 'custom',
          message: `${nested.map((item) => item.name).join(', ')} must be selected as areas of expertise`,
        },
      ]);
    }

    return unique;
  }

  async assertSubspecialtyIds(ids: string[] | undefined, parentIds: string[]) {
    const unique = [...new Set(ids ?? [])];
    if (unique.length === 0) return [];

    const found = await specialtyRepo.findByIds(unique);
    if (found.length !== unique.length) {
      throw new BadRequestError('One or more area of expertise IDs are invalid', [
        {
          path: ['subspecialtyIds'],
          code: 'custom',
          message: 'One or more area of expertise IDs are invalid',
        },
      ]);
    }

    const parentSet = new Set(parentIds);
    return found
      .filter((specialty) => specialty.parentId && parentSet.has(specialty.parentId))
      .map((specialty) => specialty.id);
  }
}

export const specialtyService = new SpecialtyService();
