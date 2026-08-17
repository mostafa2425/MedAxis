import * as runtime from "@prisma/client/runtime/index-browser";
export type * from '../models';
export type * from './prismaNamespace';
export declare const Decimal: typeof runtime.Decimal;
export declare const NullTypes: {
    DbNull: (new (secret: never) => typeof runtime.DbNull);
    JsonNull: (new (secret: never) => typeof runtime.JsonNull);
    AnyNull: (new (secret: never) => typeof runtime.AnyNull);
};
/**
 * Helper for filtering JSON entries that have `null` on the database (empty on the db)
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const DbNull: import("@prisma/client-runtime-utils").DbNullClass;
/**
 * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const JsonNull: import("@prisma/client-runtime-utils").JsonNullClass;
/**
 * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const AnyNull: import("@prisma/client-runtime-utils").AnyNullClass;
export declare const ModelName: {
    readonly User: 'User';
    readonly Patient: 'Patient';
    readonly Specialty: 'Specialty';
    readonly Doctor: 'Doctor';
    readonly DoctorSpecialty: 'DoctorSpecialty';
    readonly DoctorSubspecialty: 'DoctorSubspecialty';
    readonly OperationCatalog: 'OperationCatalog';
    readonly Governorate: 'Governorate';
    readonly Hospital: 'Hospital';
    readonly Nurse: 'Nurse';
    readonly Operation: 'Operation';
    readonly OperationMedicalTeam: 'OperationMedicalTeam';
    readonly OperationProcedure: 'OperationProcedure';
    readonly OperationTeamMember: 'OperationTeamMember';
    readonly OperationCost: 'OperationCost';
    readonly OperationFile: 'OperationFile';
    readonly OperationTimeline: 'OperationTimeline';
};
export type ModelName = (typeof ModelName)[keyof typeof ModelName];
export declare const TransactionIsolationLevel: {
    readonly ReadUncommitted: 'ReadUncommitted';
    readonly ReadCommitted: 'ReadCommitted';
    readonly RepeatableRead: 'RepeatableRead';
    readonly Serializable: 'Serializable';
};
export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];
export declare const UserScalarFieldEnum: {
    readonly id: 'id';
    readonly email: 'email';
    readonly password: 'password';
    readonly name: 'name';
    readonly phone: 'phone';
    readonly role: 'role';
    readonly isActive: 'isActive';
    readonly createdAt: 'createdAt';
    readonly updatedAt: 'updatedAt';
};
export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum];
export declare const PatientScalarFieldEnum: {
    readonly id: 'id';
    readonly fullName: 'fullName';
    readonly age: 'age';
    readonly gender: 'gender';
    readonly mobile: 'mobile';
    readonly notes: 'notes';
    readonly createdBy: 'createdBy';
    readonly createdAt: 'createdAt';
    readonly updatedAt: 'updatedAt';
};
export type PatientScalarFieldEnum = (typeof PatientScalarFieldEnum)[keyof typeof PatientScalarFieldEnum];
export declare const SpecialtyScalarFieldEnum: {
    readonly id: 'id';
    readonly name: 'name';
    readonly nameAr: 'nameAr';
    readonly icon: 'icon';
    readonly parentId: 'parentId';
    readonly isActive: 'isActive';
    readonly createdAt: 'createdAt';
    readonly updatedAt: 'updatedAt';
};
export type SpecialtyScalarFieldEnum = (typeof SpecialtyScalarFieldEnum)[keyof typeof SpecialtyScalarFieldEnum];
export declare const DoctorScalarFieldEnum: {
    readonly id: 'id';
    readonly name: 'name';
    readonly phone: 'phone';
    readonly email: 'email';
    readonly isActive: 'isActive';
    readonly userId: 'userId';
    readonly createdBy: 'createdBy';
    readonly createdAt: 'createdAt';
    readonly updatedAt: 'updatedAt';
};
export type DoctorScalarFieldEnum = (typeof DoctorScalarFieldEnum)[keyof typeof DoctorScalarFieldEnum];
export declare const DoctorSpecialtyScalarFieldEnum: {
    readonly id: 'id';
    readonly doctorId: 'doctorId';
    readonly specialtyId: 'specialtyId';
    readonly createdAt: 'createdAt';
};
export type DoctorSpecialtyScalarFieldEnum = (typeof DoctorSpecialtyScalarFieldEnum)[keyof typeof DoctorSpecialtyScalarFieldEnum];
export declare const DoctorSubspecialtyScalarFieldEnum: {
    readonly id: 'id';
    readonly doctorId: 'doctorId';
    readonly specialtyId: 'specialtyId';
    readonly createdAt: 'createdAt';
};
export type DoctorSubspecialtyScalarFieldEnum = (typeof DoctorSubspecialtyScalarFieldEnum)[keyof typeof DoctorSubspecialtyScalarFieldEnum];
export declare const OperationCatalogScalarFieldEnum: {
    readonly id: 'id';
    readonly name: 'name';
    readonly nameAr: 'nameAr';
    readonly specialtyId: 'specialtyId';
    readonly subspecialtyId: 'subspecialtyId';
    readonly isActive: 'isActive';
    readonly isCustom: 'isCustom';
    readonly createdBy: 'createdBy';
    readonly createdAt: 'createdAt';
    readonly updatedAt: 'updatedAt';
};
export type OperationCatalogScalarFieldEnum = (typeof OperationCatalogScalarFieldEnum)[keyof typeof OperationCatalogScalarFieldEnum];
export declare const GovernorateScalarFieldEnum: {
    readonly id: 'id';
    readonly nameEn: 'nameEn';
    readonly nameAr: 'nameAr';
    readonly code: 'code';
    readonly isActive: 'isActive';
};
export type GovernorateScalarFieldEnum = (typeof GovernorateScalarFieldEnum)[keyof typeof GovernorateScalarFieldEnum];
export declare const HospitalScalarFieldEnum: {
    readonly id: 'id';
    readonly name: 'name';
    readonly nameAr: 'nameAr';
    readonly address: 'address';
    readonly city: 'city';
    readonly governorateId: 'governorateId';
    readonly phone: 'phone';
    readonly notes: 'notes';
    readonly isActive: 'isActive';
    readonly createdBy: 'createdBy';
    readonly createdAt: 'createdAt';
    readonly updatedAt: 'updatedAt';
};
export type HospitalScalarFieldEnum = (typeof HospitalScalarFieldEnum)[keyof typeof HospitalScalarFieldEnum];
export declare const NurseScalarFieldEnum: {
    readonly id: 'id';
    readonly name: 'name';
    readonly phone: 'phone';
    readonly email: 'email';
    readonly isActive: 'isActive';
    readonly createdBy: 'createdBy';
    readonly createdAt: 'createdAt';
    readonly updatedAt: 'updatedAt';
};
export type NurseScalarFieldEnum = (typeof NurseScalarFieldEnum)[keyof typeof NurseScalarFieldEnum];
export declare const OperationScalarFieldEnum: {
    readonly id: 'id';
    readonly name: 'name';
    readonly diagnosis: 'diagnosis';
    readonly hospitalId: 'hospitalId';
    readonly operationDate: 'operationDate';
    readonly operationTime: 'operationTime';
    readonly operationRoom: 'operationRoom';
    readonly duration: 'duration';
    readonly status: 'status';
    readonly notes: 'notes';
    readonly patientId: 'patientId';
    readonly createdBy: 'createdBy';
    readonly specialtyId: 'specialtyId';
    readonly catalogId: 'catalogId';
    readonly createdAt: 'createdAt';
    readonly updatedAt: 'updatedAt';
};
export type OperationScalarFieldEnum = (typeof OperationScalarFieldEnum)[keyof typeof OperationScalarFieldEnum];
export declare const OperationMedicalTeamScalarFieldEnum: {
    readonly id: 'id';
    readonly operationId: 'operationId';
    readonly primarySurgeonId: 'primarySurgeonId';
    readonly assistantSurgeonId: 'assistantSurgeonId';
    readonly anesthesiologistId: 'anesthesiologistId';
    readonly assistantAnesthesiaId: 'assistantAnesthesiaId';
    readonly nurse: 'nurse';
    readonly notes: 'notes';
    readonly createdAt: 'createdAt';
};
export type OperationMedicalTeamScalarFieldEnum = (typeof OperationMedicalTeamScalarFieldEnum)[keyof typeof OperationMedicalTeamScalarFieldEnum];
export declare const OperationProcedureScalarFieldEnum: {
    readonly id: 'id';
    readonly operationId: 'operationId';
    readonly catalogId: 'catalogId';
    readonly name: 'name';
    readonly nameAr: 'nameAr';
    readonly specialtyId: 'specialtyId';
    readonly sortOrder: 'sortOrder';
    readonly createdAt: 'createdAt';
};
export type OperationProcedureScalarFieldEnum = (typeof OperationProcedureScalarFieldEnum)[keyof typeof OperationProcedureScalarFieldEnum];
export declare const OperationTeamMemberScalarFieldEnum: {
    readonly id: 'id';
    readonly operationId: 'operationId';
    readonly doctorId: 'doctorId';
    readonly nurseId: 'nurseId';
    readonly sortOrder: 'sortOrder';
    readonly createdAt: 'createdAt';
};
export type OperationTeamMemberScalarFieldEnum = (typeof OperationTeamMemberScalarFieldEnum)[keyof typeof OperationTeamMemberScalarFieldEnum];
export declare const OperationCostScalarFieldEnum: {
    readonly id: 'id';
    readonly operationId: 'operationId';
    readonly totalCost: 'totalCost';
    readonly paidAmount: 'paidAmount';
    readonly remainingAmount: 'remainingAmount';
    readonly hospitalCost: 'hospitalCost';
    readonly nursingCost: 'nursingCost';
    readonly assistantDoctorsCost: 'assistantDoctorsCost';
    readonly equipmentCost: 'equipmentCost';
    readonly otherCost: 'otherCost';
    readonly paymentMethod: 'paymentMethod';
    readonly paymentStatus: 'paymentStatus';
    readonly paymentNotes: 'paymentNotes';
    readonly createdAt: 'createdAt';
    readonly updatedAt: 'updatedAt';
};
export type OperationCostScalarFieldEnum = (typeof OperationCostScalarFieldEnum)[keyof typeof OperationCostScalarFieldEnum];
export declare const OperationFileScalarFieldEnum: {
    readonly id: 'id';
    readonly operationId: 'operationId';
    readonly fileType: 'fileType';
    readonly fileName: 'fileName';
    readonly filePath: 'filePath';
    readonly fileSize: 'fileSize';
    readonly mimeType: 'mimeType';
    readonly uploadedBy: 'uploadedBy';
    readonly createdAt: 'createdAt';
};
export type OperationFileScalarFieldEnum = (typeof OperationFileScalarFieldEnum)[keyof typeof OperationFileScalarFieldEnum];
export declare const OperationTimelineScalarFieldEnum: {
    readonly id: 'id';
    readonly operationId: 'operationId';
    readonly action: 'action';
    readonly description: 'description';
    readonly userId: 'userId';
    readonly createdAt: 'createdAt';
};
export type OperationTimelineScalarFieldEnum = (typeof OperationTimelineScalarFieldEnum)[keyof typeof OperationTimelineScalarFieldEnum];
export declare const SortOrder: {
    readonly asc: 'asc';
    readonly desc: 'desc';
};
export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];
export declare const QueryMode: {
    readonly default: 'default';
    readonly insensitive: 'insensitive';
};
export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode];
export declare const NullsOrder: {
    readonly first: 'first';
    readonly last: 'last';
};
export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder];
//# sourceMappingURL=prismaNamespaceBrowser.d.ts.map