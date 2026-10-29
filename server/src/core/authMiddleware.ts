import type { RequestHandler } from 'express';
import { AppError } from './errors';
import { SESSION_COOKIE } from './cookies';
import { verifySessionToken } from './jwt';
import { Session } from './models/Session';
import { User } from './models/User';

/** Reads the cookie, checks the token AND that the Session still exists, then loads the user. */
async function loadAuth(token: string | undefined) {
  if (!token) return null;
  const claims = verifySessionToken(token);
  if (!claims) return null;
  const session = await Session.findById(claims.sid).lean();
  if (!session || String(session.userId) !== claims.sub) return null;
  const user = await User.findById(claims.sub);
  if (!user || user.banned) return null;
  return { user, sessionId: claims.sid };
}

/** Route needs a signed-in user. 401 otherwise. */
export const requireAuth: RequestHandler = async (req, _res, next) => {
  try {
    const auth = await loadAuth(req.cookies?.[SESSION_COOKIE]);
    if (!auth) throw AppError.unauthorized();
    req.auth = auth;
    next();
  } catch (err) {
    next(err);
  }
};

/** Route works for everyone, but knows who you are if you are signed in. */
export const optionalAuth: RequestHandler = async (req, _res, next) => {
  try {
    const auth = await loadAuth(req.cookies?.[SESSION_COOKIE]);
    if (auth) req.auth = auth;
    next();
  } catch (err) {
    next(err);
  }
};

/** Role gate, used after requireAuth (the admin module will use it). */
export const requireRole =
  (role: 'admin'): RequestHandler =>
  (req, _res, next) => {
    if (req.auth?.user.role !== role) return next(AppError.forbidden());
    next();
  };
