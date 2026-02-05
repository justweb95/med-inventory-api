"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.medicationQuerySchema = void 0;
const zod_1 = require("zod");
exports.medicationQuerySchema = zod_1.z.object({
    schedule: zod_1.z.enum(['II', 'III', 'IV', 'V']).optional(),
});
