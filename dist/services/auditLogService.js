"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAuditLog = createAuditLog;
exports.listAuditLogs = listAuditLogs;
const db_1 = require("../db");
async function createAuditLog(params) {
    return db_1.prisma.auditLog.create({
        data: {
            action: params.action,
            entityType: params.entityType,
            entityId: params.entityId,
            performedById: params.performedById,
            details: params.details,
        },
    });
}
async function listAuditLogs(filter) {
    return db_1.prisma.auditLog.findMany({
        where: {
            entityType: filter.entityType,
        },
        orderBy: { timestamp: 'desc' },
    });
}
