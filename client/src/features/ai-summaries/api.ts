import { api } from '@/core/api';

export const getAiStatus = (signal?: AbortSignal) => api<{ enabled: boolean }>('/ai-summaries/status', { signal });
export const summarise = (postId: string) => api<{ bullets: string[]; cached: boolean }>(`/ai-summaries/post/${postId}`, { method: 'POST' });
