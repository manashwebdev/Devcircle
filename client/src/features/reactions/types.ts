export type ReactionKind = 'helpful' | 'shipit' | 'learned' | 'same';

export interface ReactionState {
  kinds: ReactionKind[];
  mine: ReactionKind[];
  isAuthor: boolean;
  /** Only filled in for the post's author. */
  counts: Record<ReactionKind, number> | null;
}

export const REACTION_INFO: Record<ReactionKind, { label: string; hint: string }> = {
  helpful: { label: 'Helpful', hint: 'This helped me' },
  shipit: { label: 'Ship it', hint: 'Looks ready to ship' },
  learned: { label: 'Learned', hint: 'I learned something' },
  same: { label: 'Same here', hint: 'I hit this too' },
};
