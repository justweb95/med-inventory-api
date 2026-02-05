import request from 'supertest';
import app from '../src/app';
import { prisma } from '../src/db';

describe('Input validation', () => {
  const baseUrl = '/api/transactions';

  beforeEach(() => {
    (prisma.medication.findUnique as any).mockResolvedValue({
      id: 1,
      name: 'Morphine',
      schedule: 'II',
      unit: 'mg',
      currentStockQuantity: 100,
    });

    (prisma.$transaction as any).mockImplementation(async (fn: any) => fn(prisma));
    (prisma.transaction.create as any).mockResolvedValue({});
    (prisma.auditLog.create as any).mockResolvedValue({});
  });

  it('fails when required fields are missing', async () => {
    const res = await request(app).post(baseUrl).send({
      medicationId: 1,
      nurseId: 10,
      type: 'CHECKOUT',
      quantity: 10,
      // witnessId missing
    });

    expect(res.status).toBe(400);
  });

  it('fails when wrong data types', async () => {
    const res = await request(app).post(baseUrl).send({
      medicationId: 'not-number',
      nurseId: 10,
      witnessId: 11,
      type: 'CHECKOUT',
      quantity: 10,
    });

    expect(res.status).toBe(400);
  });
});
