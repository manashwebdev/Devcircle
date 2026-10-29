import jwt from 'jsonwebtoken';
import { env } from './env';

/** What we put inside the session token: who (sub) and which Session document (sid). */
export interface SessionClaims {
  sub: string;
  sid: string;
}

export function signSessionToken(claims: SessionClaims): string {
  return jwt.sign(claims, env.JWT_SECRET, {
    algorithm: 'HS256',
    expiresIn: `${env.JWT_EXPIRES_DAYS}d`,
  });
}

/** Returns the claims, or null for anything wrong (bad signature, expired, malformed). Never throws. */
export function verifySessionToken(token: string): SessionClaims | null {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET, { algorithms: ['HS256'] });
    if (typeof decoded === 'object' && typeof decoded.sub === 'string' && typeof decoded.sid === 'string') {
      return { sub: decoded.sub, sid: decoded.sid };
    }
    return null;
  } catch {
    return null;
  }
}
