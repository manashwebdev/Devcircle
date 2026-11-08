import { api } from '@/core/api';
import type { AdminPost, AdminStats, AdminUser } from './types';

export const getStats = (signal?: AbortSignal) => api<AdminStats>('/admin/stats', { signal });
export const listUsers = (q: string, signal?: AbortSignal) => api<{ items: AdminUser[] }>(`/admin/users${q ? `?${new URLSearchParams({ q })}` : ''}`, { signal });
export const setBanned = (id: string, banned: boolean) => api<{ id: string; banned: boolean }>(`/admin/users/${id}/ban`, { method: 'POST', body: { banned } });
export const listPosts = (signal?: AbortSignal) => api<{ items: AdminPost[] }>('/admin/posts', { signal });
export const setHidden = (id: string, hidden: boolean) => api<{ id: string; hidden: boolean }>(`/admin/posts/${id}/hidden`, { method: 'POST', body: { hidden } });
