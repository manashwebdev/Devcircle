import type { Response } from 'express';

/** Every API reply has the same shape: { ok, data, error }. */
export interface ApiEnvelope<T> {
  ok: boolean;
  data: T | null;
  error: { code: string; message: string; details?: unknown } | null;
}

export function ok<T>(res: Response, data: T, status = 200) {
  const body: ApiEnvelope<T> = { ok: true, data, error: null };
  return res.status(status).json(body);
}

export function fail(res: Response, status: number, code: string, message: string, details?: unknown) {
  const body: ApiEnvelope<null> = { ok: false, data: null, error: { code, message, details } };
  return res.status(status).json(body);
}
