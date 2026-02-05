"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMedications = getMedications;
exports.getMedication = getMedication;
const medicationSchemas_1 = require("../schemas/medicationSchemas");
const medicationService_1 = require("../services/medicationService");
const httpErrors_1 = require("../utils/httpErrors");
async function getMedications(req, res, next) {
    try {
        const parsed = medicationSchemas_1.medicationQuerySchema.safeParse(req.query);
        if (!parsed.success) {
            throw (0, httpErrors_1.badRequest)('Invalid query parameters');
        }
        const meds = await (0, medicationService_1.listMedications)({ schedule: parsed.data.schedule });
        res.json(meds);
    }
    catch (e) {
        next(e);
    }
}
async function getMedication(req, res, next) {
    try {
        const id = Number(req.params.id);
        if (Number.isNaN(id))
            throw (0, httpErrors_1.badRequest)('Invalid medication id');
        const med = await (0, medicationService_1.getMedicationWithTransactions)(id);
        if (!med)
            throw (0, httpErrors_1.notFound)('Medication not found');
        res.json(med);
    }
    catch (e) {
        next(e);
    }
}
