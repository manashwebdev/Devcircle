import { api } from '@/core/api';
import type { PostLite } from '@/core/types';

export type SavedPost = PostLite & { savedAt: string };

export const listSaved = (signal?: AbortSignal) => api<{ items: SavedPost[] }>('/bookmarks', { signal });
export const getSaved = (postId: string, signal?: AbortSignal) => api<{ saved: boolean }>(`/bookmarks/post/${postId}`, { signal });
export const toggleSaved = (postId: string) => api<{ saved: boolean }>(`/bookmarks/post/${postId}`, { method: 'POST' });
