import type { RequestHandler } from 'express';

/** Express 4 does not catch errors from async handlers. This forwards them to the central error handler. */
export const asyncHandler =
  (fn: RequestHandler): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
