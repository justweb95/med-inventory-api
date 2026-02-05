"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTransaction = createTransaction;
exports.listTransactions = listTransactions;
const db_1 = require("../db");
const httpErrors_1 = require("../utils/httpErrors");
async function createTransaction(input) {
    if (input.nurseId === input.witnessId) {
        throw (0, httpErrors_1.badRequest)('nurseId and witnessId must be different');
    }
    if (input.type === 'WASTE' && (!input.notes || input.notes.trim().length === 0)) {
        throw (0, httpErrors_1.badRequest)('notes are required for WASTE transactions');
    }
    const med = await db_1.prisma.medication.findUnique({
        where: { id: input.medicationId },
    });
    if (!med)
        throw (0, httpErrors_1.notFound)('Medication not found');
    let newStock = med.currentStockQuantity;
    if (input.type === 'CHECKOUT') {
        if (med.currentStockQuantity < input.quantity) {
            throw (0, httpErrors_1.conflict)('Not enough stock for checkout');
        }
        newStock = med.currentStockQuantity - input.quantity;
    }
    else if (input.type === 'RETURN') {
        newStock = med.currentStockQuantity + input.quantity;
    }
    else if (input.type === 'WASTE') {
        // no stock change
    }
    const result = await db_1.prisma.$transaction(async (tx) => {
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
async function listTransactions(filter) {
    return db_1.prisma.transaction.findMany({
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
