import { prisma } from '../db';
import { badRequest, notFound, conflict } from '../utils/httpErrors';
import { createAuditLog } from './auditLogService';

type CreateTransactionInput = {
  medicationId: number;
  nurseId: number;
  witnessId: number;
  type: 'CHECKOUT' | 'RETURN' | 'WASTE';
  quantity: number;
  notes?: string;
};

export async function createTransaction(input: CreateTransactionInput) {
  if (input.nurseId === input.witnessId) {
    throw badRequest('nurseId and witnessId must be different');
  }

  if (input.type === 'WASTE' && (!input.notes || input.notes.trim().length === 0)) {
    throw badRequest('notes are required for WASTE transactions');
  }

  const med = await prisma.medication.findUnique({
    where: { id: input.medicationId },
  });

  if (!med) throw notFound('Medication not found');

  let newStock = med.currentStockQuantity;

  if (input.type === 'CHECKOUT') {
    if (med.currentStockQuantity < input.quantity) {
      throw conflict('Not enough stock for checkout');
    }
    newStock = med.currentStockQuantity - input.quantity;
  } else if (input.type === 'RETURN') {
    newStock = med.currentStockQuantity + input.quantity;
  } else if (input.type === 'WASTE') {
    // no stock change
  }

  const result = await prisma.$transaction(async (tx) => {
    const transaction = await tx.transaction.create({
      data: {
        medicationId: input.medicationId,
        nurseId: input.nurseId,
        witnessId: input.witnessId,
        type: input.type,
        quantity: input.quantity,
        notes: input.notes,
      },
    });

    if (input.type !== 'WASTE') {
      await tx.medication.update({
        where: { id: input.medicationId },
        data: { currentStockQuantity: newStock },
      });
    }

    await tx.auditLog.create({
      data: {
        action: 'CREATE_TRANSACTION',
        entityType: 'Transaction',
        entityId: transaction.id,
        performedById: input.nurseId,
        details: {
          medicationId: input.medicationId,
          nurseId: input.nurseId,
          witnessId: input.witnessId,
          type: input.type,
          quantity: input.quantity,
          notes: input.notes ?? null,
          previousStock: med.currentStockQuantity,
          newStock,
        },
      },
    });

    return transaction;
  });

  return result;
}

export async function listTransactions(filter: {
  type?: 'CHECKOUT' | 'RETURN' | 'WASTE';
  medicationId?: number;
}) {
  return prisma.transaction.findMany({
    where: {
      type: filter.type,
      medicationId: filter.medicationId,
    },
    include: {
      medication: true,
      nurse: true,
      witness: true,
    },
    orderBy: { timestamp: 'desc' },
  });
}
