"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auditLogController_1 = require("../controllers/auditLogController");
const router = (0, express_1.Router)();
router.get('/', auditLogController_1.getAuditLog);
exports.default = router;
