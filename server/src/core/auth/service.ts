import { Session } from '../models/Session';
import { User, type UserDoc } from '../models/User';
import { signSessionToken } from '../jwt';
import { events } from '../events';
import { env } from '../env';
import { AppError } from '../errors';
import type { GithubProfile } from './github';

/** Turn "Some Name!!" into a valid username: lowercase letters, digits, - and _. */
export function slugifyUsername(raw: string): string {
  const s = raw.toLowerCase().replace(/[^a-z0-9_-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  return (s.length >= 3 ? s : `dev-${s}`).slice(0, 24);
}

/** Usernames are unique. If "sam" is taken we try sam-2, sam-3, ... */
export async function uniqueUsername(base: string): Promise<string> {
  let candidate = base;
  for (let i = 2; await User.exists({ username: candidate }); i++) {
    const suffix = `-${i}`;
    candidate = base.slice(0, 24 - suffix.length) + suffix;
  }
  return candidate;
}

/** First sign-in creates the account; later sign-ins find it by GitHub id. */
export async function findOrCreateGithubUser(profile: GithubProfile): Promise<UserDoc> {
  const existing = await User.findOne({ githubId: profile.id });
  if (existing) return existing;

  const user = await User.create({
    githubId: profile.id,
    username: await uniqueUsername(slugifyUsername(profile.login)),
    displayName: profile.name ?? profile.login,
  });
  events.emit('user.created', { userId: user.id });
  return user;
}

/** Create a Session document and the signed token that points at it. */
export async function startSession(user: UserDoc, userAgent = '') {
  if (user.banned) throw AppError.forbidden('This account is suspended');
  const expiresAt = new Date(Date.now() + env.JWT_EXPIRES_DAYS * 24 * 60 * 60 * 1000);
  const session = await Session.create({ userId: user._id, userAgent: userAgent.slice(0, 300), expiresAt });
  return signSessionToken({ sub: user.id, sid: session.id });
}

export async function endSession(sessionId: string) {
  await Session.deleteOne({ _id: sessionId });
}
