import { prisma } from '../utils/prisma';
import { Prisma } from '../prisma';

const catalogInclude = {
  specialty: {
    select: { id: true, name: true, nameAr: true, parentId: true },
  },
  subspecialty: {
    select: { id: true, name: true, nameAr: true, parentId: true },
  },
} satisfies Prisma.OperationCatalogInclude;

export type CatalogItemWithSpecialty = Prisma.OperationCatalogGetPayload<{
  include: typeof catalogInclude;
}>;

export class OperationCatalogRepository {
  async findAccessible(params: { specialtyIds: string[]; userId: string }) {
    const { specialtyIds, userId } = params;

    const or: Prisma.OperationCatalogWhereInput[] = [
      {
        isCustom: true,
        createdBy: userId,
      },
    ];

    if (specialtyIds.length > 0) {
      or.unshift({
        isCustom: false,
        OR: [
          { specialtyId: { in: specialtyIds } },
          { specialtyId: null, subspecialty: { parentId: { in: specialtyIds } } },
        ],
      });
    }

    return prisma.operationCatalog.findMany({
      where: {
        isActive: true,
        OR: or,
      },
      include: catalogInclude,
      orderBy: [{ isCustom: 'asc' }, { name: 'asc' }],
    });
  }

  async findById(id: string) {
    return prisma.operationCatalog.findUnique({
      where: { id },
      include: catalogInclude,
    });
  }

  async findCommonByName(name: string, specialtyId: string) {
    return prisma.operationCatalog.findFirst({
      where: {
        name: { equals: name, mode: 'insensitive' },
        specialtyId,
        isCustom: false,
      },
      include: catalogInclude,
    });
  }

  async findCustomByName(userId: string, name: string) {
    return prisma.operationCatalog.findFirst({
      where: {
        createdBy: userId,
        isCustom: true,
        name: { equals: name, mode: 'insensitive' },
      },
      include: catalogInclude,
    });
  }

  async create(data: {
    name: string;
    nameAr?: string | null;
    specialtyId?: string | null;
    subspecialtyId?: string | null;
    isCustom?: boolean;
    createdBy?: string | null;
  }) {
    return prisma.operationCatalog.create({
      data: {
        name: data.name,
        nameAr: data.nameAr ?? null,
        specialtyId: data.specialtyId ?? null,
        subspecialtyId: data.subspecialtyId ?? null,
        isCustom: data.isCustom ?? false,
        createdBy: data.createdBy ?? null,
      },
      include: catalogInclude,
    });
  }
}

export const operationCatalogRepo = new OperationCatalogRepository();
