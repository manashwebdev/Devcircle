import crypto from 'node:crypto';
import type { RequestHandler } from 'express';
import { env } from '../../core/env';
import { AppError } from '../../core/errors';
import { SESSION_COOKIE, oauthStateCookieOptions, sessionCookieOptions } from '../../core/cookies';
import { startSession } from '../../core/auth/service';
import { fetchGoogleProfile, findOrCreateGoogleUser, googleAuthorizeUrl } from './service';

const STATE_COOKIE = 'dc_google_state';
// The core state cookie only travels on /api/auth, so this feature scopes its own to /api/google-auth.
const stateOptions = () => ({ ...oauthStateCookieOptions(), path: '/api/google-auth' });

/** Step 1: remember a random "state" in a cookie, then send the browser to Google. */
export const start: RequestHandler = (_req, res, next) => {
  if (!env.GOOGLE_CLIENT_ID) return next(AppError.badRequest('Google sign-in is not configured'));
  const state = crypto.randomBytes(16).toString('hex');
  res.cookie(STATE_COOKIE, state, stateOptions());
  res.redirect(googleAuthorizeUrl(state));
};

/** Step 2: Google sends the browser back here. Check state, sign the person in, go to the client. */
export const callback: RequestHandler = async (req, res) => {
  const { code, state } = req.query as { code?: string; state?: string };
  const expected = req.cookies?.[STATE_COOKIE];
  res.clearCookie(STATE_COOKIE, { path: '/api/google-auth' });

  try {
    // If state does not match, the request did not start from our own button (possible forged callback).
    if (!code || !state || !expected || state !== expected) throw AppError.badRequest('Sign-in expired, try again');
    const user = await findOrCreateGoogleUser(await fetchGoogleProfile(code));
    const token = await startSession(user, req.get('user-agent') ?? '');
    res.cookie(SESSION_COOKIE, token, sessionCookieOptions());
    res.redirect(`${env.CLIENT_URL}/u/${user.username}`);
  } catch (err) {
    console.error('[google-auth] callback failed', err);
    res.redirect(`${env.CLIENT_URL}/?auth=failed`);
  }
};