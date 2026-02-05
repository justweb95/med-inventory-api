import { Request, Response, NextFunction } from 'express';
import { medicationQuerySchema } from '../schemas/medicationSchemas';
import { listMedications, getMedicationWithTransactions } from '../services/medicationService';
import { badRequest, notFound } from '../utils/httpErrors';

export async function getMedications(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = medicationQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      throw badRequest('Invalid query parameters');
    }
    const meds = await listMedications({ schedule: parsed.data.schedule });
    res.json(meds);
  } catch (e) {
    next(e);
  }
}

export async function getMedication(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) throw badRequest('Invalid medication id');

    const med = await getMedicationWithTransactions(id);
    if (!med) throw notFound('Medication not found');

    res.json(med);
  } catch (e) {
    next(e);
  }
}
