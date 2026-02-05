"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const errorHandler_1 = require("./middlewares/errorHandler");
const medications_1 = __importDefault(require("./routes/medications"));
const transactions_1 = __importDefault(require("./routes/transactions"));
const auditLog_1 = __importDefault(require("./routes/auditLog"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api/medications', medications_1.default);
app.use('/api/transactions', transactions_1.default);
app.use('/api/audit-log', auditLog_1.default);
app.use(errorHandler_1.errorHandler);
exports.default = app;
