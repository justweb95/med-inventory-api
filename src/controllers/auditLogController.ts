import { Request, Response, NextFunction } from 'express';
import { auditLogQuerySchema } from '../schemas/auditLogSchemas';
import { listAuditLogs } from '../services/auditLogService';
import { badRequest } from '../utils/httpErrors';

export async function getAuditLog(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = auditLogQuerySchema.safeParse(req.query);
    if (!parsed.success) throw badRequest('Invalid query parameters');
    const logs = await listAuditLogs({ entityType: parsed.data.entityType });
    res.json(logs);
  } catch (e) {
    next(e);
  }
}
