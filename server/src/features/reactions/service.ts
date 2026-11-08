import { Types } from 'mongoose';
import { AppError } from '../../core/errors';
import { events } from '../../core/events';
import { getPostMeta } from '../../core/lookup';
import type { UserDoc } from '../../core/models/User';
import { REACTION_KINDS, Reaction, type ReactionKind } from './model';

/**
 * "No public likes": everybody sees which reactions THEY gave; only the post's author sees the totals.
 */
export async function getReactions(postId: string, viewerId: string) {
  const post = await getPostMeta(postId);
  if (!post) throw AppError.notFound('Post not found');

  const mineRows = await Reaction.find({ postId, userId: viewerId }).select('kind').lean();
  const isAuthor = post.authorId === viewerId;

  let counts: Record<ReactionKind, number> | null = null;
  if (isAuthor) {
    const grouped = await Reaction.aggregate<{ _id: ReactionKind; n: number }>([
      { $match: { postId: new Types.ObjectId(postId) } },
      { $group: { _id: '$kind', n: { $sum: 1 } } },
    ]);
    counts = Object.fromEntries(REACTION_KINDS.map((k) => [k, grouped.find((g) => g._id === k)?.n ?? 0])) as Record<ReactionKind, number>;
  }
  return { kinds: [...REACTION_KINDS], mine: mineRows.map((r) => r.kind), isAuthor, counts };
}

/** Press once to react, press again to take it back. */
export async function toggleReaction(user: UserDoc, postId: string, kind: ReactionKind) {
  const post = await getPostMeta(postId);
  if (!post) throw AppError.notFound('Post not found');

  const removed = await Reaction.findOneAndDelete({ postId, userId: user._id, kind });
  if (!removed) {
    try {
      await Reaction.create({ postId, userId: user._id, kind });
      if (post.authorId !== user.id) {
        events.emit('reaction.created', { postId, postTitle: post.title, postAuthorId: post.authorId, userId: user.id, kind });
      }
    } catch (err) {
      // Two fast taps can race into the unique index. The reaction exists either way, so that is fine.
      if ((err as { code?: number }).code !== 11000) throw err;
    }
  }
  return getReactions(postId, user.id);
}
