"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.operationDetailInclude = exports.operationListInclude = void 0;
exports.operationListInclude = {
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
        orderBy: { sortOrder: 'asc' },
    },
    teamMembers: {
        include: { doctor: true, nurse: true },
        orderBy: { sortOrder: 'asc' },
    },
    medicalTeam: {
        include: { primarySurgeon: true, assistantSurgeon: true, anesthesiologist: true, assistantAnesthesia: true },
    },
    cost: true,
    files: {
        select: {
            id: true,
            operationId: true,
            fileType: true,
            fileName: true,
            filePath: true,
            fileSize: true,
            mimeType: true,
            createdAt: true,
        },
    },
};
exports.operationDetailInclude = {
    ...exports.operationListInclude,
    creator: { select: { id: true, name: true, email: true } },
    files: {
        include: { uploader: { select: { id: true, name: true } } },
        orderBy: { createdAt: 'desc' },
    },
    timeline: {
        include: { user: { select: { id: true, name: true } } },
        orderBy: { createdAt: 'desc' },
    },
};
//# sourceMappingURL=operationInclude.js.map