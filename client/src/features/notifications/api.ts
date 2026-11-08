import { api } from '@/core/api';
import type { NotificationItem } from './types';

export const listNotifications = (signal?: AbortSignal) => api<{ unread: number; items: NotificationItem[] }>('/notifications', { signal });
export const getUnreadCount = (signal?: AbortSignal) => api<{ unread: number }>('/notifications/unread-count', { signal });
export const markAllRead = () => api<{ unread: number }>('/notifications/read-all', { method: 'POST' });
export const markRead = (id: string) => api<{ unread: number }>(`/notifications/${id}/read`, { method: 'POST' });
