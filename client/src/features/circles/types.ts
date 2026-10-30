import type { CharacterId } from '@/core/types';

export type Visibility = 'private' | 'public';

/** One circle in a list. */
export interface CircleSummary {
  id: string;
  name: string;
  description: string;
  visibility: Visibility;
  memberCount: number;
  status: 'forming' | 'active';
  isOwner: boolean;
  isMember: boolean;
}

export interface CircleMember {
  id: string;
  username: string;
  displayName: string;
  character: CharacterId;
  joinedAt: string;
  isOwner: boolean;
}

/** A circle's own page. `inviteCode` is null unless you are a member. */
export interface CircleDetail extends CircleSummary {
  inviteCode: string | null;
  minMembers: number;
  maxMembers: number;
  members: CircleMember[];
}

export interface InvitePreview {
  name: string;
  description: string;
  memberCount: number;
  maxMembers: number;
  full: boolean;
}

export interface CreateCircleInput {
  name: string;
  description: string;
  visibility: Visibility;
}