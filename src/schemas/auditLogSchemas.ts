import { z } from 'zod';

export const auditLogQuerySchema = z.object({
  entityType: z.string().optional(),
});
