import type { CharacterId } from '@/core/types';

export interface AdminStats {
  users: number;
  banned: number;
  newUsers: number;
  /** null means that feature is switched off. */
  posts: number | null;
  hiddenPosts: number | null;
  newPosts: number | null;
  comments: number | null;
}
export interface AdminUser {
  id: string;
  username: string;
  displayName: string;
  character: CharacterId;
  role: 'user' | 'admin';
  banned: boolean;
  createdAt: string;
}
export interface AdminPost {
  id: string;
  type: string;
  title: string;
  hidden: boolean;
  createdAt: string;
  author: string | null;
}
