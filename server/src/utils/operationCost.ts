import { BadRequestError } from './errors';

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

export function normalizeOperationCost(input: CostInput): CostInput {
  const totalCost = Number(input.totalCost);
  if (!Number.isFinite(totalCost) || totalCost < 0) throw new BadRequestError('Total amount must be 0 or greater');

  let paidAmount = Number(input.paidAmount ?? 0);
  if (!Number.isFinite(paidAmount) || paidAmount < 0) throw new BadRequestError('Paid amount must be 0 or greater');
  if (input.paymentStatus === 'PAID') paidAmount = totalCost;
  if (input.paymentStatus === 'UNPAID') paidAmount = 0;
  if (paidAmount > totalCost) throw new BadRequestError('Paid amount cannot exceed total amount');

  const breakdown = {
    hospitalCost: Number(input.hospitalCost ?? 0),
    nursingCost: Number(input.nursingCost ?? 0),
    assistantDoctorsCost: Number(input.assistantDoctorsCost ?? 0),
    equipmentCost: Number(input.equipmentCost ?? 0),
    otherCost: Number(input.otherCost ?? 0),
  };
  const breakdownTotal = Object.values(breakdown).reduce((sum, value) => sum + value, 0);
  if (Object.values(breakdown).some((value) => !Number.isFinite(value) || value < 0)) throw new BadRequestError('Cost breakdown values must be 0 or greater');
  if (breakdownTotal > totalCost) throw new BadRequestError('Cost breakdown cannot exceed total operation cost');

  return { ...input, ...breakdown, totalCost, paidAmount, remainingAmount: totalCost - paidAmount };
}
