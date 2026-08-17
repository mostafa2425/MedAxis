export type CostInput = {
    totalCost: number;
    paidAmount?: number;
    remainingAmount?: number;
    hospitalCost?: number;
    nursingCost?: number;
    assistantDoctorsCost?: number;
    equipmentCost?: number;
    otherCost?: number;
    paymentMethod?: string;
    paymentStatus?: string;
    paymentNotes?: string;
};
export declare function normalizeOperationCost(input: CostInput): CostInput;
//# sourceMappingURL=operationCost.d.ts.map