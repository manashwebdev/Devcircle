import { api } from '@/core/api';
import type { CreatePostInput, PostFull, PostSummary, PostType } from './types';

export interface FeedPage {
  items: PostSummary[];
  nextBefore: string | null;
}

export function listPosts(opts: { type?: PostType; tag?: string; author?: string; before?: string }, signal?: AbortSignal) {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(opts)) if (v) q.set(k, v);
  return api<FeedPage>(`/posts?${q}`, { signal });
}
export const getPost = (id: string, signal?: AbortSignal) => api<PostFull>(`/posts/${id}`, { signal });
export const createPost = (input: CreatePostInput) => api<PostFull>('/posts', { method: 'POST', body: input });
export const deletePost = (id: string) => api<{ deleted: boolean }>(`/posts/${id}`, { method: 'DELETE' });
