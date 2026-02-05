import { PrismaClient, Schedule, Unit, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const nurse = await prisma.user.create({
    data: {
      email: 'nurse@example.com',
      name: 'Nurse Nancy',
      role: UserRole.NURSE,
    },
  });

  const witness = await prisma.user.create({
    data: {
      email: 'witness@example.com',
      name: 'Witness Will',
      role: UserRole.WITNESS,
    },
  });

  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      name: 'Admin Alice',
      role: UserRole.ADMIN,
    },
  });

  await prisma.medication.createMany({
    data: [
      {
        name: 'Morphine',
        schedule: Schedule.II,
        unit: Unit.mg,
        currentStockQuantity: 1000,
      },
      {
        name: 'Diazepam',
        schedule: Schedule.IV,
        unit: Unit.mg,
        currentStockQuantity: 500,
      },
      {
        name: 'Midazolam',
        schedule: Schedule.IV,
        unit: Unit.mg,
        currentStockQuantity: 300,
      },
      {
        name: 'Fentanyl',
        schedule: Schedule.II,
        unit: Unit.mcg,
        currentStockQuantity: 2000,
      },
      {
        name: 'Lorazepam',
        schedule: Schedule.IV,
        unit: Unit.mg,
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
