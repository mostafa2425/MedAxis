export declare const Gender: {
    readonly MALE: 'MALE';
    readonly FEMALE: 'FEMALE';
};
export type Gender = (typeof Gender)[keyof typeof Gender];
export declare const OperationStatus: {
    readonly SCHEDULED: 'SCHEDULED';
    readonly IN_PROGRESS: 'IN_PROGRESS';
    readonly COMPLETED: 'COMPLETED';
    readonly CANCELLED: 'CANCELLED';
};
export type OperationStatus = (typeof OperationStatus)[keyof typeof OperationStatus];
export declare const PaymentMethod: {
    readonly CASH: 'CASH';
    readonly CARD: 'CARD';
    readonly INSURANCE: 'INSURANCE';
    readonly BANK_TRANSFER: 'BANK_TRANSFER';
    readonly OTHER: 'OTHER';
};
export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod];
export declare const PaymentStatus: {
    readonly PAID: 'PAID';
    readonly UNPAID: 'UNPAID';
    readonly PARTIAL: 'PARTIAL';
};
export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];
export declare const FileType: {
    readonly BEFORE_IMAGE: 'BEFORE_IMAGE';
    readonly BEFORE_XRAY: 'BEFORE_XRAY';
    readonly BEFORE_MRI: 'BEFORE_MRI';
    readonly BEFORE_CT: 'BEFORE_CT';
    readonly BEFORE_LAB: 'BEFORE_LAB';
    readonly BEFORE_PDF: 'BEFORE_PDF';
    readonly AFTER_IMAGE: 'AFTER_IMAGE';
    readonly AFTER_REPORT: 'AFTER_REPORT';
    readonly AFTER_PDF: 'AFTER_PDF';
    readonly AFTER_OTHER: 'AFTER_OTHER';
};
export type FileType = (typeof FileType)[keyof typeof FileType];
export declare const TimelineAction: {
    readonly OPERATION_CREATED: 'OPERATION_CREATED';
    readonly OPERATION_UPDATED: 'OPERATION_UPDATED';
    readonly OPERATION_DELETED: 'OPERATION_DELETED';
    readonly STATUS_CHANGED: 'STATUS_CHANGED';
    readonly FILES_UPLOADED: 'FILES_UPLOADED';
    readonly COST_UPDATED: 'COST_UPDATED';
    readonly NOTES_UPDATED: 'NOTES_UPDATED';
    readonly TEAM_UPDATED: 'TEAM_UPDATED';
};
export type TimelineAction = (typeof TimelineAction)[keyof typeof TimelineAction];
//# sourceMappingURL=enums.d.ts.map