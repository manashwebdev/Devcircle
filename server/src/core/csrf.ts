import type { RequestHandler } from 'express';
import { AppError } from './errors';
import { env } from './env';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

/**
 * CSRF guard for cookie auth across two domains.
 *
 * Because the cookie may be SameSite=None, a malicious site could make the browser send it.
 * So every state-changing request must:
 *  1. come from our client origin (Origin header), and
 *  2. carry the custom header "X-Requested-With: devcircle".
 * A plain <form> or <img> on another site cannot set that header, and a fetch() that does
 * triggers a CORS preflight which our CORS config rejects for foreign origins.
 */
export const csrfGuard: RequestHandler = (req, _res, next) => {
  if (SAFE_METHODS.has(req.method)) return next();

  const origin = req.get('origin');
  if (origin && origin !== env.CLIENT_URL) return next(AppError.forbidden('Bad origin'));
  if (req.get('x-requested-with') !== 'devcircle') return next(AppError.forbidden('Missing CSRF header'));
  next();
};
