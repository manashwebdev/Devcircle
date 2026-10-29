import type { CharacterId } from '@/core/types';

export type PostType = 'built' | 'broke' | 'learned';
export type PostRequest = 'none' | 'try' | 'review';

export interface PostSummary {
  id: string;
  type: PostType;
  title: string;
  excerpt: string;
  tags: string[];
  link?: string;
  request: PostRequest;
  createdAt: string;
  mine: boolean;
  author: { username: string; displayName: string; character: CharacterId } | null;
}
export type PostFull = PostSummary & { body: string };

export interface CreatePostInput {
  type: PostType;
  title: string;
  body: string;
  tags: string[];
  link?: string;
  request: PostRequest;
}

export const TYPE_INFO: Record<PostType, { label: string; hint: string }> = {
  built: { label: 'Built', hint: 'Something you shipped or made' },
  broke: { label: 'Broke', hint: 'Something that failed, and why' },
  learned: { label: 'Learned', hint: 'Something that finally clicked' },
};
