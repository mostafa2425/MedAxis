"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeOperationCost = normalizeOperationCost;
const errors_1 = require("./errors");
function normalizeOperationCost(input) {
    const totalCost = Number(input.totalCost);
    if (!Number.isFinite(totalCost) || totalCost < 0) {
        throw new errors_1.BadRequestError('Total amount must be 0 or greater', [
            {
                path: ['totalCost'],
                code: 'too_small',
                message: 'Total amount must be 0 or greater',
            },
        ]);
    }
    let paidAmount = Number(input.paidAmount ?? 0);
    if (!Number.isFinite(paidAmount) || paidAmount < 0) {
        throw new errors_1.BadRequestError('Paid amount must be 0 or greater', [
            {
                path: ['paidAmount'],
                code: 'too_small',
                message: 'Paid amount must be 0 or greater',
            },
        ]);
    }
    if (input.paymentStatus === 'PAID') {
        paidAmount = totalCost;
    }
    else if (input.paymentStatus === 'UNPAID') {
        paidAmount = 0;
    }
    if (paidAmount > totalCost) {
        throw new errors_1.BadRequestError('Paid amount cannot exceed total amount', [
            {
                path: ['paidAmount'],
                code: 'custom',
                message: 'Paid amount cannot exceed total amount',
            },
        ]);
    }
    return {
        ...input,
        totalCost,
        paidAmount,
        remainingAmount: totalCost - paidAmount,
    };
}
//# sourceMappingURL=operationCost.js.map