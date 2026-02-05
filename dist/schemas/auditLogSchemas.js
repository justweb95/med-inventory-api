"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditLogQuerySchema = void 0;
const zod_1 = require("zod");
exports.auditLogQuerySchema = zod_1.z.object({
    entityType: zod_1.z.string().optional(),
});
