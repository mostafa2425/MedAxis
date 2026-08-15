import { BadRequestError } from './errors';

export type CostInput = {
  totalCost: number;
  paidAmount?: number;
  remainingAmount?: number;
  paymentMethod?: string;
  paymentStatus?: string;
  paymentNotes?: string;
};

export function normalizeOperationCost(input: CostInput): CostInput {
  const totalCost = Number(input.totalCost);
  if (!Number.isFinite(totalCost) || totalCost < 0) {
    throw new BadRequestError('Total amount must be 0 or greater', [
      {
        path: ['totalCost'],
        code: 'too_small',
        message: 'Total amount must be 0 or greater',
      },
    ]);
  }

  let paidAmount = Number(input.paidAmount ?? 0);
  if (!Number.isFinite(paidAmount) || paidAmount < 0) {
    throw new BadRequestError('Paid amount must be 0 or greater', [
      {
        path: ['paidAmount'],
        code: 'too_small',
        message: 'Paid amount must be 0 or greater',
      },
    ]);
  }

  if (input.paymentStatus === 'PAID') {
    paidAmount = totalCost;
  } else if (input.paymentStatus === 'UNPAID') {
    paidAmount = 0;
  }

  if (paidAmount > totalCost) {
    throw new BadRequestError('Paid amount cannot exceed total amount', [
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
