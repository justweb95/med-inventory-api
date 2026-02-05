import { z } from 'zod';

export const medicationQuerySchema = z.object({
  schedule: z.enum(['II', 'III', 'IV', 'V']).optional(),
});
