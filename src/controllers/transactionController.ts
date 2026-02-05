import { Request, Response, NextFunction } from 'express';
import { createTransactionSchema } from '../schemas/transactionSchemas';
import { validateBody } from '../utils/zodValidation';
import { createTransaction, listTransactions } from '../services/transactionService';
import { badRequest } from '../utils/httpErrors';

export const validateCreateTransaction = validateBody(createTransactionSchema);

export async function postTransaction(req: Request, res: Response, next: NextFunction) {
  try {
    const payload = req.body as any;
    const tx = await createTransaction({
      medicationId: payload.medicationId,
      nurseId: payload.nurseId,
      witnessId: payload.witnessId,
      type: payload.type,
      quantity: payload.quantity,
      notes: payload.notes,
    });
    res.status(201).json(tx);
  } catch (e) {
    next(e);
  }
}

export async function getTransactions(req: Request, res: Response, next: NextFunction) {
  try {
    const type = req.query.type as 'CHECKOUT' | 'RETURN' | 'WASTE' | undefined;
    const medicationId = req.query.medicationId
      ? Number(req.query.medicationId)
      : undefined;

    if (req.query.medicationId && Number.isNaN(Number(req.query.medicationId))) {
      throw badRequest('Invalid medicationId');
    }

    const txs = await listTransactions({ type, medicationId });
    res.json(txs);
  } catch (e) {
    next(e);
  }
}
