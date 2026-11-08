import { api } from '@/core/api';
import type { CommentItem } from './types';

export const listComments = (postId: string, signal?: AbortSignal) => api<{ items: CommentItem[] }>(`/comments/post/${postId}`, { signal });
export const createComment = (postId: string, body: string, parentId?: string) =>
  api<CommentItem>(`/comments/post/${postId}`, { method: 'POST', body: { body, ...(parentId ? { parentId } : {}) } });
export const deleteComment = (id: string) => api<{ deleted: boolean }>(`/comments/${id}`, { method: 'DELETE' });
