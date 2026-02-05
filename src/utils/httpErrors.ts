export class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export const notFound = (msg = 'Not found') => new HttpError(404, msg);
export const badRequest = (msg = 'Bad request') => new HttpError(400, msg);
export const conflict = (msg = 'Conflict') => new HttpError(409, msg);
export const internal = (msg = 'Internal server error') => new HttpError(500, msg);
