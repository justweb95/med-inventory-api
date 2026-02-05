"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const httpErrors_1 = require("../utils/httpErrors");
function errorHandler(err, _req, res, _next) {
    if (err instanceof httpErrors_1.HttpError) {
        return res.status(err.status).json({ error: err.message });
    }
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
}
