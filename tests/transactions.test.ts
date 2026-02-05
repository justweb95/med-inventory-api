import request from 'supertest';
import app from '../src/app'

import { prisma } from '../src/db';

// successful creation + stock effects + failure cases

describe('Transactions API', () => {
  const baseUrl = '/api/transactions';

  beforeEach(() => {
    // set up mock data
    (prisma.medication.findUnique as any).mockResolvedValue({
      id: 1,
      name: 'Morphine',
      schedule: 'II',
      unit: 'mg',
      currentStockQuantity: 100,
    });

    (prisma.$transaction as any).mockImplementation(async (fn: any) => {
      return fn(prisma);
    });

    (prisma.transaction.create as any).mockImplementation(async ({ data }: any) => ({
      id: 1,
      ...data,
      timestamp: new Date(),
    }));

    (prisma.medication.update as any).mockResolvedValue({});
    (prisma.auditLog.create as any).mockResolvedValue({});
  });

  it('creates a CHECKOUT transaction and decreases stock', async () => {
    const res = await request(app)
      .post(baseUrl)
      .send({
        medicationId: 1,
        nurseId: 10,
        witnessId: 11,
        type: 'CHECKOUT',
        quantity: 20,
      });

    expect(res.status).toBe(201);
    expect(prisma.medication.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { currentStockQuantity: 80 },
    });
    expect(prisma.auditLog.create).toHaveBeenCalled();
  });

  it('fails when nurseId equals witnessId', async () => {
    const res = await request(app)
      .post(baseUrl)
      .send({
        medicationId: 1,
        nurseId: 10,
        witnessId: 10,
        type: 'CHECKOUT',
        quantity: 10,
      });

    expect(res.status).toBe(400);
  });

  it('fails when not enough stock on CHECKOUT', async () => {
    (prisma.medication.findUnique as any).mockResolvedValueOnce({
      id: 1,
      name: 'Morphine',
      schedule: 'II',
      unit: 'mg',
      currentStockQuantity: 5,
    });

    const res = await request(app)
      .post(baseUrl)
      .send({
        medicationId: 1,
        nurseId: 10,
        witnessId: 11,
        type: 'CHECKOUT',
        quantity: 10,
      });

    expect(res.status).toBe(409);
  });

  it('requires notes for WASTE', async () => {
    const res = await request(app)
      .post(baseUrl)
      .send({
        medicationId: 1,
        nurseId: 10,
        witnessId: 11,
        type: 'WASTE',
        quantity: 5,
      });

    expect(res.status).toBe(400);
  });

  it('does not change stock for WASTE', async () => {
    const res = await request(app)
      .post(baseUrl)
      .send({
        medicationId: 1,
        nurseId: 10,
        witnessId: 11,
        type: 'WASTE',
        quantity: 5,
        notes: 'Spilled',
      });

    expect(res.status).toBe(201);
    expect(prisma.medication.update).not.toHaveBeenCalled();
  });

  it('increases stock for RETURN', async () => {
    const res = await request(app)
      .post(baseUrl)
      .send({
        medicationId: 1,
        nurseId: 10,
        witnessId: 11,
        type: 'RETURN',
        quantity: 10,
      });

    expect(res.status).toBe(201);
    expect(prisma.medication.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { currentStockQuantity: 110 },
    });
  });
});
