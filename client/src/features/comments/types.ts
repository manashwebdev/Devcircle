import type { CharacterId } from '@/core/types';

export interface CommentItem {
  id: string;
  parentId: string | null;
  body: string;
  createdAt: string;
  mine: boolean;
  canDelete: boolean;
  author: { username: string; displayName: string; character: CharacterId } | null;
}
