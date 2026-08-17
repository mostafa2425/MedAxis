export type CostInput = {
    totalCost: number;
    paidAmount?: number;
    remainingAmount?: number;
    paymentMethod?: string;
    paymentStatus?: string;
    paymentNotes?: string;
};
export declare function normalizeOperationCost(input: CostInput): CostInput;
//# sourceMappingURL=operationCost.d.ts.map