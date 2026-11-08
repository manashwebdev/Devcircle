import { api } from '@/core/api';
import type { PersonLite, PostLite } from '@/core/types';

export interface FollowFeed {
  items: PostLite[];
  nextBefore: string | null;
}

export const getFollowing = (username: string, signal?: AbortSignal) => api<{ following: boolean }>(`/follows/user/${username}`, { signal });
export const toggleFollow = (username: string) => api<{ following: boolean }>(`/follows/user/${username}`, { method: 'POST' });
export const listPeople = (signal?: AbortSignal) => api<{ items: PersonLite[] }>('/follows/people', { signal });
export const listFeed = (before?: string, signal?: AbortSignal) => api<FollowFeed>(`/follows/feed${before ? `?${new URLSearchParams({ before })}` : ''}`, { signal });
