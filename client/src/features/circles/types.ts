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
export interface Checkin {
  id: string;
  text: string;
  link?: string;
  createdAt: string;
  author: { id: string; username: string; displayName: string; character: CharacterId };
}

/** What GET /api/circles/:id/checkins returns. */
export interface CheckinList {
  day: string;
  isToday: boolean;
  isMember: boolean;
  checkedIn: boolean;
  items: Checkin[];
  /** Members who have not checked in yet (empty for non-members). */
  pending: { id: string; username: string; displayName: string; character: CharacterId }[];
}