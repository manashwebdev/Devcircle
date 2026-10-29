import type { RequestHandler } from 'express';
import type { ZodTypeAny } from 'zod';

/**
 * Validate body / query / params with Zod before a controller runs.
 * On success the parsed (typed, trimmed, defaulted) values replace the raw ones,
 * so controllers never see unvalidated input. On failure the ZodError goes to the error handler.
 */
export function validate(schemas: { body?: ZodTypeAny; query?: ZodTypeAny; params?: ZodTypeAny }): RequestHandler {
  return (req, _res, next) => {
    try {
      if (schemas.body) req.body = schemas.body.parse(req.body);
      if (schemas.query) req.query = schemas.query.parse(req.query);
      if (schemas.params) req.params = schemas.params.parse(req.params);
      next();
    } catch (err) {
      next(err);
    }
  };
}
