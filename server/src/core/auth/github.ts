import { env } from '../env';
import { AppError } from '../errors';

export interface GithubProfile {
  id: string;
  login: string;
  name: string | null;
}

export function githubAuthorizeUrl(state: string): string {
  const q = new URLSearchParams({
    client_id: env.GITHUB_CLIENT_ID,
    redirect_uri: `${env.SERVER_URL}/api/auth/github/callback`,
    scope: 'read:user',
    state,
  });
  return `https://github.com/login/oauth/authorize?${q}`;
}

/** Trade the one-time "code" GitHub gave us for the person's public profile. */
export async function fetchGithubProfile(code: string): Promise<GithubProfile> {
  const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: `${env.SERVER_URL}/api/auth/github/callback`,
    }),
  });
  const tokenJson = (await tokenRes.json()) as { access_token?: string };
  if (!tokenJson.access_token) throw AppError.badRequest('GitHub rejected the sign-in code');

  const userRes = await fetch('https://api.github.com/user', {
    headers: { Authorization: `Bearer ${tokenJson.access_token}`, 'User-Agent': 'devcircle' },
  });
  if (!userRes.ok) throw AppError.badRequest('Could not read your GitHub profile');
  const u = (await userRes.json()) as { id: number; login: string; name: string | null };
  return { id: String(u.id), login: u.login, name: u.name };
}
