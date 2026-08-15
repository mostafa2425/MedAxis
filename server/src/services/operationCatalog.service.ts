import { operationCatalogRepo } from '../repositories/operationCatalog.repo';
import { doctorRepo } from '../repositories/doctor.repo';
import { BadRequestError, ConflictError, NotFoundError } from '../utils/errors';
import type { CatalogItemWithSpecialty } from '../repositories/operationCatalog.repo';

function toCatalogResponse(item: CatalogItemWithSpecialty) {
  return {
    id: item.id,
    name: item.name,
    nameAr: item.nameAr,
    isCustom: item.isCustom,
    specialty: item.specialty
      ? {
          id: item.specialty.id,
          name: item.specialty.name,
          nameAr: item.specialty.nameAr,
        }
      : null,
    subspecialty: item.subspecialty
      ? {
          id: item.subspecialty.id,
          name: item.subspecialty.name,
          nameAr: item.subspecialty.nameAr,
        }
      : null,
  };
}

function doctorSpecialtyIds(doctor: Awaited<ReturnType<typeof doctorRepo.findByUserId>>) {
  return new Set(doctor?.specialties.map((link) => link.specialtyId) ?? []);
}

function doctorSubspecialtyIds(doctor: Awaited<ReturnType<typeof doctorRepo.findByUserId>>) {
  return new Set(doctor?.subspecialties.map((link) => link.specialtyId) ?? []);
}

function isAccessibleCatalogItem(
  item: CatalogItemWithSpecialty,
  specialtyIds: Set<string>,
) {
  if (item.specialtyId && specialtyIds.has(item.specialtyId)) return true;
  if (item.subspecialty?.parentId && specialtyIds.has(item.subspecialty.parentId)) return true;
  return false;
}

class OperationCatalogService {
  async listForUser(userId: string) {
    const doctor = await doctorRepo.findByUserId(userId);
    const specialtyIds = [...doctorSpecialtyIds(doctor)];
    const preferredAreas = doctorSubspecialtyIds(doctor);

    const items = await operationCatalogRepo.findAccessible({ specialtyIds, userId });
    return items
      .filter((item) => {
        if (item.isCustom) return true;
        return specialtyIds.length > 0;
      })
      .sort((a, b) => {
        const aMatch = a.subspecialtyId && preferredAreas.has(a.subspecialtyId) ? 0 : 1;
        const bMatch = b.subspecialtyId && preferredAreas.has(b.subspecialtyId) ? 0 : 1;
        if (aMatch !== bMatch) return aMatch - bMatch;
        if (a.isCustom !== b.isCustom) return a.isCustom ? -1 : 1;
        return a.name.localeCompare(b.name);
      })
      .map(toCatalogResponse);
  }

  async createCustom(userId: string, name: string) {
    const trimmed = name.trim();
    const existing = await operationCatalogRepo.findCustomByName(userId, trimmed);
    if (existing) {
      throw new ConflictError('Custom operation with this name');
    }

    const item = await operationCatalogRepo.create({
      name: trimmed,
      isCustom: true,
      createdBy: userId,
    });

    return toCatalogResponse(item);
  }

  async assertAccessible(userId: string, catalogId: string) {
    const item = await operationCatalogRepo.findById(catalogId);
    if (!item || !item.isActive) {
      throw new BadRequestError('Invalid operation ID', [
        {
          path: ['operationId'],
          code: 'custom',
          message: 'Operation does not exist',
        },
      ]);
    }

    if (item.isCustom) {
      if (item.createdBy !== userId) {
        throw new BadRequestError('Invalid operation ID', [
          {
            path: ['operationId'],
            code: 'custom',
            message: 'Operation does not exist',
          },
        ]);
      }
      return item;
    }

    const doctor = await doctorRepo.findByUserId(userId);
    const specialtyIds = doctorSpecialtyIds(doctor);
    if (!isAccessibleCatalogItem(item, specialtyIds)) {
      throw new BadRequestError('Invalid operation ID', [
        {
          path: ['operationId'],
          code: 'custom',
          message: 'Operation is not available for your specialties',
        },
      ]);
    }

    return item;
  }

  async getById(id: string) {
    const item = await operationCatalogRepo.findById(id);
    if (!item) throw new NotFoundError('Operation');
    return toCatalogResponse(item);
  }
}

export const operationCatalogService = new OperationCatalogService();
