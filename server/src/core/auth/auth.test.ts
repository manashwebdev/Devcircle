import { describe, expect, it } from 'vitest';
import jwt from 'jsonwebtoken';
import { signSessionToken, verifySessionToken } from '../jwt';
import { csrfGuard } from '../csrf';
import { slugifyUsername } from './service';

describe('session tokens', () => {
  it('round-trips the claims', () => {
    const token = signSessionToken({ sub: 'user1', sid: 'sess1' });
    expect(verifySessionToken(token)).toEqual({ sub: 'user1', sid: 'sess1' });
  });

  it('rejects a token signed with another secret', () => {
    const forged = jwt.sign({ sub: 'user1', sid: 'sess1' }, 'x'.repeat(40));
    expect(verifySessionToken(forged)).toBeNull();
  });

  it('rejects garbage', () => {
    expect(verifySessionToken('not-a-token')).toBeNull();
  });
});

describe('csrfGuard', () => {
  const run = (method: string, headers: Record<string, string>) => {
    let err: unknown = null;
    const req = { method, get: (h: string) => headers[h.toLowerCase()] } as never;
    csrfGuard(req, {} as never, (e?: unknown) => (err = e ?? null));
    return err;
  };

  it('lets GET through', () => expect(run('GET', {})).toBeNull());
  it('blocks POST without the custom header', () => expect(run('POST', {})).not.toBeNull());
  it('blocks POST from a foreign origin', () =>
    expect(run('POST', { origin: 'https://evil.example', 'x-requested-with': 'devcircle' })).not.toBeNull());
  it('allows POST from the client origin with the header', () =>
    expect(run('POST', { origin: 'http://localhost:3000', 'x-requested-with': 'devcircle' })).toBeNull());
});

describe('slugifyUsername', () => {
  it('cleans odd characters', () => expect(slugifyUsername('Ada Lovelace!!')).toBe('ada-lovelace'));
  it('pads very short names', () => expect(slugifyUsername('al').length).toBeGreaterThanOrEqual(3));
});
