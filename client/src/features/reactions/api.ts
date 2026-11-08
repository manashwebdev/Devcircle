import { api } from '@/core/api';
import type { ReactionKind, ReactionState } from './types';

export const getReactions = (postId: string, signal?: AbortSignal) => api<ReactionState>(`/reactions/post/${postId}`, { signal });
export const toggleReaction = (postId: string, kind: ReactionKind) => api<ReactionState>(`/reactions/post/${postId}`, { method: 'POST', body: { kind } });
