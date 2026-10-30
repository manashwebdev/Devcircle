import { api } from '@/core/api';
import type { CircleDetail, CircleSummary, CreateCircleInput, InvitePreview, Visibility } from './types';

export const listMyCircles = (signal?: AbortSignal) => api<CircleSummary[]>('/circles', { signal });
export const listPublicCircles = (signal?: AbortSignal) => api<CircleSummary[]>('/circles/public', { signal });
export const getCircle = (id: string, signal?: AbortSignal) => api<CircleDetail>(`/circles/${id}`, { signal });

export const createCircle = (input: CreateCircleInput) => api<CircleDetail>('/circles', { method: 'POST', body: input });
export const setVisibility = (id: string, visibility: Visibility) =>
  api<CircleDetail>(`/circles/${id}`, { method: 'PATCH', body: { visibility } });

export const previewInvite = (code: string, signal?: AbortSignal) => api<InvitePreview>(`/circles/invite/${code}`, { signal });
export const joinCircle = (code: string) => api<CircleDetail>(`/circles/join/${code}`, { method: 'POST' });
export const leaveCircle = (id: string) => api<{ left: boolean }>(`/circles/${id}/leave`, { method: 'POST' });
export const kickMember = (id: string, userId: string) =>
  api<{ removed: boolean }>(`/circles/${id}/members/${userId}`, { method: 'DELETE' });