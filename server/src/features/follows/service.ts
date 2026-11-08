import type { Types } from 'mongoose';
import { AppError } from '../../core/errors';
import { events } from '../../core/events';
import { AUTHOR_FIELDS, postModel, toPostLite, type PostLiteRow } from '../../core/lookup';
import { User, type UserDoc } from '../../core/models/User';
import { Follow } from './model';
import type { FeedQuery } from './schema';

async function findTarget(username: string) {
  const target = await User.findOne({ username, banned: false }).select('_id').lean();
  if (!target) throw AppError.notFound('No developer with that username');
  return target;
}

/** "No follower counts": you only ever learn whether YOU follow someone. */
export async function isFollowing(me: UserDoc, username: string) {
  const target = await findTarget(username);
  return { following: Boolean(await Follow.exists({ followerId: me._id, followeeId: target._id })) };
}

export async function toggleFollow(me: UserDoc, username: string) {
  const target = await findTarget(username);
  if (String(target._id) === me.id) throw AppError.badRequest('You cannot follow yourself');
  const removed = await Follow.findOneAndDelete({ followerId: me._id, followeeId: target._id });
  if (removed) return { following: false };
  try {
    await Follow.create({ followerId: me._id, followeeId: target._id });
    events.emit('user.followed', { followerId: me.id, followeeId: String(target._id) });
  } catch (err) {
    if ((err as { code?: number }).code !== 11000) throw err; // double tap: already following
  }
  return { following: true };
}

async function followeeIds(me: UserDoc): Promise<Types.ObjectId[]> {
  const rows = await Follow.find({ followerId: me._id }).sort({ createdAt: -1 }).limit(500).select('followeeId').lean();
  return rows.map((r) => r.followeeId);
}

export async function listFollowing(me: UserDoc) {
  const ids = await followeeIds(me);
  if (ids.length === 0) return { items: [] };
  const users = await User.find({ _id: { $in: ids }, banned: false }).select('username displayName character bio techStack').sort({ username: 1 }).lean();
  return {
    items: users.map((u) => ({ username: u.username, displayName: u.displayName || u.username, character: u.character, bio: u.bio, techStack: u.techStack })),
  };
}

/** Newest posts from the people you follow, cursor-paginated like the main feed. */
export async function followingFeed(me: UserDoc, q: FeedQuery) {
  const Post = postModel();
  const ids = await followeeIds(me);
  if (!Post || ids.length === 0) return { items: [], nextBefore: null };

  const filter: Record<string, unknown> = { hidden: false, authorId: { $in: ids } };
  if (q.before) filter.createdAt = { $lt: q.before };
  const rows = (await Post.find(filter)
    .select('-body')
    .sort({ createdAt: -1 })
    .limit(q.limit + 1)
    .populate('authorId', AUTHOR_FIELDS)
    .lean()) as unknown as PostLiteRow[];

  const hasMore = rows.length > q.limit;
  const page = hasMore ? rows.slice(0, q.limit) : rows;
  const last = page[page.length - 1];
  return { items: page.map(toPostLite), nextBefore: hasMore && last ? last.createdAt.toISOString() : null };
}
