import rateLimit from 'express-rate-limit';
import { fail } from './response';

/** Build a limiter that answers in our { ok, data, error } shape. */
const make = (windowMs: number, limit: number) =>
  rateLimit({
    windowMs,
    limit,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    handler: (_req, res) => fail(res, 429, 'RATE_LIMITED', 'Too many requests, slow down a little'),
  });

/** Login / OAuth routes: 30 per 15 minutes per IP. */
export const authLimiter = make(15 * 60 * 1000, 30);
/** Anything that writes (profile edits, later: posts, check-ins): 60 per minute. */
export const writeLimiter = make(60 * 1000, 60);
/** Gemini routes (used by the ai-summaries module): 10 per minute. */
export const aiLimiter = make(60 * 1000, 10);
/** Whole-API safety net. */
export const globalLimiter = make(60 * 1000, 300);
