"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const medicationController_1 = require("../controllers/medicationController");
const router = (0, express_1.Router)();
router.get('/', medicationController_1.getMedications);
router.get('/:id', medicationController_1.getMedication);
exports.default = router;
