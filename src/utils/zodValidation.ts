import { ZodSchema } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { badRequest } from './httpErrors';

export const validateBody =
  <T>(schema: ZodSchema<T>) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return next(
        badRequest(
          JSON.stringify(result.error.format())
        )
      );
    }
    req.body = result.data;
    next();
  };
