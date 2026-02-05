"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listMedications = listMedications;
exports.getMedicationWithTransactions = getMedicationWithTransactions;
const db_1 = require("../db");
async function listMedications(filter) {
    return db_1.prisma.medication.findMany({
        where: {
            schedule: filter.schedule,
        },
        orderBy: { id: 'asc' },
    });
}
async function getMedicationWithTransactions(id) {
    return db_1.prisma.medication.findUnique({
        where: { id },
        include: {
            transactions: {
                orderBy: { timestamp: 'desc' },
            },
        },
    });
}
