import { Schema, model } from 'mongoose';

/** Dev-flavoured reactions instead of a generic "like". */
export const REACTION_KINDS = ['helpful', 'shipit', 'learned', 'same'] as const;
export type ReactionKind = (typeof REACTION_KINDS)[number];

const reactionSchema = new Schema(
  {
    postId: { type: Schema.Types.ObjectId, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    kind: { type: String, enum: REACTION_KINDS, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

reactionSchema.index({ postId: 1, userId: 1, kind: 1 }, { unique: true }); // one of each kind per person
reactionSchema.index({ postId: 1, kind: 1 }); // counts for the author

export const Reaction = model('Reaction', reactionSchema);
