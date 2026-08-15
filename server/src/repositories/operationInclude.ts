import { Prisma } from '@prisma/client';

export const operationListInclude = {
  patient: true,
  hospital: true,
  specialty: true,
  catalog: {
    include: { specialty: { select: { id: true, name: true, nameAr: true } } },
  },
  procedures: {
    include: {
      catalog: {
        include: {
          specialty: { select: { id: true, name: true, nameAr: true } },
          subspecialty: { select: { id: true, name: true, nameAr: true } },
        },
      },
      specialty: { select: { id: true, name: true, nameAr: true } },
    },
    orderBy: { sortOrder: 'asc' as const },
  },
  teamMembers: {
    include: {
      doctor: true,
      nurse: true,
    },
    orderBy: { sortOrder: 'asc' as const },
  },
  medicalTeam: {
    include: {
      primarySurgeon: true,
      assistantSurgeon: true,
      anesthesiologist: true,
      assistantAnesthesia: true,
    },
  },
  cost: true,
  files: {
    select: { id: true, fileType: true, fileName: true, filePath: true, fileSize: true, createdAt: true },
  },
} satisfies Prisma.OperationInclude;

export const operationDetailInclude = {
  ...operationListInclude,
  creator: {
    select: { id: true, name: true, email: true },
  },
  files: {
    include: {
      uploader: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: 'desc' as const },
  },
  timeline: {
    include: {
      user: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: 'desc' as const },
  },
} satisfies Prisma.OperationInclude;
