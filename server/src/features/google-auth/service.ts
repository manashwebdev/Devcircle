import { env } from '../../core/env';
import { AppError } from '../../core/errors';
import { events } from '../../core/events';
import { User, type UserDoc } from '../../core/models/User';
import { slugifyUsername, uniqueUsername } from '../../core/auth/service';

/** Must match, character for character, the redirect URI you registered in Google Cloud. */
export const redirectUri = () => `${env.SERVER_URL}/api/google-auth/callback`;

/** Step 1 of the flow: the address we send the browser to, asking Google for permission. */
export function googleAuthorizeUrl(state: string): string {
  const q = new URLSearchParams({
    client_id: env.GOOGLE_CLIENT_ID,
    redirect_uri: redirectUri(),
    response_type: 'code',
    scope: 'openid profile email',
    state,
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${q}`;
}

interface GoogleProfile {
  id: string;
  name: string;
  email?: string;
}

/** Trade the one-time code for an access token, then use it to read the person's basic profile. */
export async function fetchGoogleProfile(code: string): Promise<GoogleProfile> {
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      redirect_uri: redirectUri(),
      grant_type: 'authorization_code',
    }),
  });
  const token = (await tokenRes.json()) as { access_token?: string };
  if (!token.access_token) throw AppError.badRequest('Google rejected the sign-in code');

  const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${token.access_token}` },
  });
  if (!res.ok) throw AppError.badRequest('Could not read your Google profile');
  const u = (await res.json()) as { sub: string; name?: string; email?: string };
  // "sub" is Google's permanent id for the person. We store that, not the email.
  return { id: u.sub, name: u.name ?? '', email: u.email };
}

/** First Google sign-in creates an account; later ones find it by Google id. */
export async function findOrCreateGoogleUser(p: GoogleProfile): Promise<UserDoc> {
  const existing = await User.findOne({ googleId: p.id });
  if (existing) return existing;

  const base = slugifyUsername(p.name || p.email?.split('@')[0] || 'dev');
  const user = await User.create({
    googleId: p.id,
    username: await uniqueUsername(base),
    displayName: p.name || base,
  });
  // Tell the rest of the app a user was created, without importing any other feature.
  events.emit('user.created', { userId: user.id });
  return user;
}