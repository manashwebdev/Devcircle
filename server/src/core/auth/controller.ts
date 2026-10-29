import crypto from 'node:crypto';
import type { RequestHandler } from 'express';
import { env } from '../env';
import { AppError } from '../errors';
import { ok } from '../response';
import { OAUTH_STATE_COOKIE, SESSION_COOKIE, oauthStateCookieOptions, sessionCookieOptions } from '../cookies';
import { toPublicUser } from '../models/User';
import { fetchGithubProfile, githubAuthorizeUrl } from './github';
import { endSession, findOrCreateGithubUser, startSession } from './service';

/** Step 1: send the browser to GitHub. "state" is a random value we check on the way back (stops forged callbacks). */
export const githubStart: RequestHandler = (_req, res, next) => {
  if (!env.GITHUB_CLIENT_ID) return next(AppError.badRequest('GitHub sign-in is not configured'));
  const state = crypto.randomBytes(16).toString('hex');
  res.cookie(OAUTH_STATE_COOKIE, state, oauthStateCookieOptions());
  res.redirect(githubAuthorizeUrl(state));
};

/** Step 2: GitHub sends the browser back here with ?code&state. We sign the person in and bounce to the client. */
export const githubCallback: RequestHandler = async (req, res) => {
  const { code, state } = req.query as { code?: string; state?: string };
  const expected = req.cookies?.[OAUTH_STATE_COOKIE];
  res.clearCookie(OAUTH_STATE_COOKIE, { path: '/api/auth' });

  try {
    if (!code || !state || !expected || state !== expected) throw AppError.badRequest('Sign-in expired, try again');
    const user = await findOrCreateGithubUser(await fetchGithubProfile(code));
    const token = await startSession(user, req.get('user-agent') ?? '');
    res.cookie(SESSION_COOKIE, token, sessionCookieOptions());
    // First stop after login is the profile page: it exists even when no optional module is on.
    res.redirect(`${env.CLIENT_URL}/u/${user.username}`);
  } catch (err) {
    console.error('[auth] github callback failed', err);
    res.redirect(`${env.CLIENT_URL}/?auth=failed`);
  }
};

/** Who am I? The client calls this on load. 401 means "signed out". */
export const me: RequestHandler = (req, res) => {
  const user = req.auth!.user;
  ok(res, { ...toPublicUser(user), role: user.role });
};

export const logout: RequestHandler = async (req, res, next) => {
  try {
    await endSession(req.auth!.sessionId);
    res.clearCookie(SESSION_COOKIE, { ...sessionCookieOptions(), maxAge: undefined });
    ok(res, { loggedOut: true });
  } catch (err) {
    next(err);
  }
};
