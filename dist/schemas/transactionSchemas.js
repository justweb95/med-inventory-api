"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTransactionSchema = exports.transactionTypeEnum = void 0;
const zod_1 = require("zod");
exports.transactionTypeEnum = zod_1.z.enum(['CHECKOUT', 'RETURN', 'WASTE']);
exports.createTransactionSchema = zod_1.z.object({
    medicationId: zod_1.z.number().int().positive(),
    nurseId: zod_1.z.number().int().positive(),
    witnessId: zod_1.z.number().int().positive(),
    type: exports.transactionTypeEnum,
    quantity: zod_1.z.number().int().positive(),
    notes: zod_1.z.string().min(1).optional(),
});
// For WASTE, notes must be present; we enforce in service logic to keep schema simple.
