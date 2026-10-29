import { api } from '@/core/api';
import type { PublicUser } from '@/core/types';
import type { UpdateProfileInput } from './types';

// Every call to the server for this feature lives here.
export const getProfile = (username: string, signal?: AbortSignal) =>
  api<PublicUser>(`/profiles/${encodeURIComponent(username)}`, { signal });

export const updateProfile = (patch: UpdateProfileInput) =>
  api<PublicUser>('/profiles/me', { method: 'PATCH', body: patch });
