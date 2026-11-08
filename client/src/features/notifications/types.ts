import type { CharacterId } from '@/core/types';

export type NotificationKind = 'comment' | 'reply' | 'mention' | 'reaction' | 'follow';

export interface NotificationItem {
  id: string;
  kind: NotificationKind;
  postId: string | null;
  postTitle: string;
  snippet: string;
  read: boolean;
  createdAt: string;
  actor: { username: string; displayName: string; character: CharacterId } | null;
}

export const KIND_TEXT: Record<NotificationKind, string> = {
  comment: 'commented on your post',
  reply: 'replied to you on',
  mention: 'mentioned you on',
  reaction: 'reacted to your post',
  follow: 'started following you',
};

/** Fired after notifications are read so the nav badge refreshes right away. */
export const NOTIFICATIONS_CHANGED = 'devcircle:notifications';
