"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuditLog = getAuditLog;
const auditLogSchemas_1 = require("../schemas/auditLogSchemas");
const auditLogService_1 = require("../services/auditLogService");
const httpErrors_1 = require("../utils/httpErrors");
async function getAuditLog(req, res, next) {
    try {
        const parsed = auditLogSchemas_1.auditLogQuerySchema.safeParse(req.query);
        if (!parsed.success)
            throw (0, httpErrors_1.badRequest)('Invalid query parameters');
        const logs = await (0, auditLogService_1.listAuditLogs)({ entityType: parsed.data.entityType });
        res.json(logs);
    }
    catch (e) {
        next(e);
    }
}
