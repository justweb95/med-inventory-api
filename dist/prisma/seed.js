"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const nurse = await prisma.user.create({
        data: {
            email: 'nurse@example.com',
            name: 'Nurse Nancy',
            role: client_1.UserRole.NURSE,
        },
    });
    const witness = await prisma.user.create({
        data: {
            email: 'witness@example.com',
            name: 'Witness Will',
            role: client_1.UserRole.WITNESS,
        },
    });
    const admin = await prisma.user.create({
        data: {
            email: 'admin@example.com',
            name: 'Admin Alice',
            role: client_1.UserRole.ADMIN,
        },
    });
    await prisma.medication.createMany({
        data: [
            {
                name: 'Morphine',
                schedule: client_1.Schedule.II,
                unit: client_1.Unit.mg,
                currentStockQuantity: 1000,
            },
            {
                name: 'Diazepam',
                schedule: client_1.Schedule.IV,
                unit: client_1.Unit.mg,
                currentStockQuantity: 500,
            },
            {
                name: 'Midazolam',
                schedule: client_1.Schedule.IV,
                unit: client_1.Unit.mg,
                currentStockQuantity: 300,
            },
            {
                name: 'Fentanyl',
                schedule: client_1.Schedule.II,
                unit: client_1.Unit.mcg,
                currentStockQuantity: 2000,
            },
            {
                name: 'Lorazepam',
                schedule: client_1.Schedule.IV,
                unit: client_1.Unit.mg,
                currentStockQuantity: 400,
            },
        ],
    });
    console.log('Seed completed', { nurse, witness, admin });
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
