import { prisma } from '../db';

export async function listMedications(filter: { schedule?: string }) {
  return prisma.medication.findMany({
    where: {
      schedule: filter.schedule as any,
    },
    orderBy: { id: 'asc' },
  });
}

export async function getMedicationWithTransactions(id: number) {
  return prisma.medication.findUnique({
    where: { id },
    include: {
      transactions: {
        orderBy: { timestamp: 'desc' },
      },
    },
  });
}
