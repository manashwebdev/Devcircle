import type { CookieOptions } from 'express';
import { env, isProd } from './env';

export const SESSION_COOKIE = 'dc_session';
export const OAUTH_STATE_COOKIE = 'dc_oauth_state';

/**
 * Session cookie settings.
 *  - httpOnly: JavaScript on the page can never read the token.
 *  - local dev: localhost:3000 and localhost:5000 are the same "site", so SameSite=Lax works.
 *  - production on two different domains (vercel.app + onrender.com): SameSite=None + Secure is required,
 *    and CSRF protection comes from csrf.ts (Origin + custom header check).
 *  - production on subdomains of one domain: set CROSS_SITE_COOKIES=false and COOKIE_DOMAIN=".yourdomain.dev".
 */
export function sessionCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd && env.CROSS_SITE_COOKIES ? 'none' : 'lax',
    path: '/',
    maxAge: env.JWT_EXPIRES_DAYS * 24 * 60 * 60 * 1000,
    domain: env.COOKIE_DOMAIN,
  };
}

/** Short-lived cookie used only to check the OAuth "state" value. Lax is right: GitHub sends the browser back via a top-level GET. */
export function oauthStateCookieOptions(): CookieOptions {
  return { httpOnly: true, secure: isProd, sameSite: 'lax', path: '/api/auth', maxAge: 10 * 60 * 1000 };
}
