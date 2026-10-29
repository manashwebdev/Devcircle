/**
 * THE one place the client talks to the server.
 * - credentials: 'include' sends the httpOnly session cookie.
 * - X-Requested-With is our CSRF header (the server rejects state-changing calls without it).
 * - Every server reply is { ok, data, error }; we unwrap it and throw ApiError on failure.
 */
const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public details?: unknown,
  ) {
    super(message);
  }
}

interface Envelope<T> {
  ok: boolean;
  data: T | null;
  error: { code: string; message: string; details?: unknown } | null;
}

export async function api<T>(
  path: string,
  opts: { method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'; body?: unknown; signal?: AbortSignal } = {},
): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${BASE}/api${path}`, {
      method: opts.method ?? 'GET',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'devcircle' },
      body: opts.body === undefined ? undefined : JSON.stringify(opts.body),
      signal: opts.signal,
    });
  } catch {
    throw new ApiError(0, 'NETWORK', 'Cannot reach the server');
  }

  let json: Envelope<T> | null = null;
  try {
    json = (await res.json()) as Envelope<T>;
  } catch {
    /* non-JSON reply, handled below */
  }
  if (!res.ok || !json?.ok) {
    throw new ApiError(res.status, json?.error?.code ?? 'UNKNOWN', json?.error?.message ?? 'Request failed', json?.error?.details);
  }
  return json.data as T;
}

/** Full URL for links that leave the app, e.g. the OAuth start: <a href={apiUrl('/auth/github')}>. */
export const apiUrl = (path: string) => `${BASE}/api${path}`;
