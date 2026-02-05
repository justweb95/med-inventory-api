"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBody = void 0;
const httpErrors_1 = require("./httpErrors");
const validateBody = (schema) => (req, _res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
        return next((0, httpErrors_1.badRequest)(JSON.stringify(result.error.format())));
    }
    req.body = result.data;
    next();
};
exports.validateBody = validateBody;
