import { prisma } from '../db';

export async function createAuditLog(params: {
  action: string;
  entityType: string;
  entityId: number;
  performedById: number;
  details: Record<string, unknown>;
}) {
  return prisma.auditLog.create({
    data: {
      action: params.action,
      entityType: params.entityType,
      entityId: params.entityId,
      performedById: params.performedById,
      details: params.details,
    },
  });
}

export async function listAuditLogs(filter: { entityType?: string }) {
  return prisma.auditLog.findMany({
    where: {
      entityType: filter.entityType,
    },
    orderBy: { timestamp: 'desc' },
  });
}
