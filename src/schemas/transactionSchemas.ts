import { z } from 'zod';

export const transactionTypeEnum = z.enum(['CHECKOUT', 'RETURN', 'WASTE']);

export const createTransactionSchema = z.object({
  medicationId: z.number().int().positive(),
  nurseId: z.number().int().positive(),
  witnessId: z.number().int().positive(),
  type: transactionTypeEnum,
  quantity: z.number().int().positive(),
  notes: z.string().min(1).optional(),
});

// For WASTE, notes must be present; we enforce in service logic to keep schema simple.
