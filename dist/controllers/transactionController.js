"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCreateTransaction = void 0;
exports.postTransaction = postTransaction;
exports.getTransactions = getTransactions;
const transactionSchemas_1 = require("../schemas/transactionSchemas");
const zodValidation_1 = require("../utils/zodValidation");
const transactionService_1 = require("../services/transactionService");
const httpErrors_1 = require("../utils/httpErrors");
exports.validateCreateTransaction = (0, zodValidation_1.validateBody)(transactionSchemas_1.createTransactionSchema);
async function postTransaction(req, res, next) {
    try {
        const payload = req.body;
        const tx = await (0, transactionService_1.createTransaction)({
            medicationId: payload.medicationId,
            nurseId: payload.nurseId,
            witnessId: payload.witnessId,
            type: payload.type,
            quantity: payload.quantity,
            notes: payload.notes,
        });
        res.status(201).json(tx);
    }
    catch (e) {
        next(e);
    }
}
async function getTransactions(req, res, next) {
    try {
        const type = req.query.type;
        const medicationId = req.query.medicationId
            ? Number(req.query.medicationId)
            : undefined;
        if (req.query.medicationId && Number.isNaN(Number(req.query.medicationId))) {
            throw (0, httpErrors_1.badRequest)('Invalid medicationId');
        }
        const txs = await (0, transactionService_1.listTransactions)({ type, medicationId });
        res.json(txs);
    }
    catch (e) {
        next(e);
    }
}
