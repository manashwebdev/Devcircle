import type { ErrorRequestHandler, RequestHandler } from 'express';
import { ZodError } from 'zod';
import { fail } from './response';
import { isProd } from './env';

/** An error we expect and want to show the client (bad input, not found, ...). */
export class AppError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public details?: unknown,
  ) {
    super(message);
  }

  static badRequest(msg = 'Bad request', details?: unknown) {
    return new AppError(400, 'BAD_REQUEST', msg, details);
  }
  static unauthorized(msg = 'Sign in required') {
    return new AppError(401, 'UNAUTHORIZED', msg);
  }
  static forbidden(msg = 'You cannot do that') {
    return new AppError(403, 'FORBIDDEN', msg);
  }
  static notFound(msg = 'Not found') {
    return new AppError(404, 'NOT_FOUND', msg);
  }
  static conflict(msg = 'Already exists') {
    return new AppError(409, 'CONFLICT', msg);
  }
}

/** Unknown /api route. Mounted last. */
export const notFoundHandler: RequestHandler = (_req, res) => {
  fail(res, 404, 'NOT_FOUND', 'Route not found');
};

/** Central error handler: every thrown error ends up here and leaves in the { ok, data, error } shape. */
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    return fail(res, 400, 'VALIDATION_ERROR', 'Invalid input', err.flatten().fieldErrors);
  }
  if (err instanceof AppError) {
    return fail(res, err.status, err.code, err.message, err.details);
  }
  // Anything else is a bug. Log it, but never leak internals in production.
  console.error(err);
  return fail(res, 500, 'INTERNAL', isProd ? 'Something went wrong' : String(err?.message ?? err));
};
