import type { Types } from 'mongoose';
import type { CoreEvents } from '../../core/events';
import { AUTHOR_FIELDS } from '../../core/lookup';
import { Notification, type NotificationKind } from './model';

interface Row {
  _id: Types.ObjectId;
  kind: NotificationKind;
  postId?: Types.ObjectId;
  postTitle: string;
  snippet: string;
  read: boolean;
  createdAt: Date;
  actorId: { username: string; displayName: string; character: string } | null;
}

// ---- Writing: called from the event listeners in index.ts ----

/** Who gets told about a new comment, and why. One notification per person, strongest reason wins. */
export function commentTargets(p: CoreEvents['comment.created']): Map<string, NotificationKind> {
  const targets = new Map<string, NotificationKind>();
  if (p.parentAuthorId) targets.set(p.parentAuthorId, 'reply');
  if (!targets.has(p.postAuthorId)) targets.set(p.postAuthorId, 'comment');
  for (const id of p.mentionedIds) if (!targets.has(id)) targets.set(id, 'mention');
  targets.delete(p.authorId); // never notify people about their own actions
  return targets;
}

export async function onComment(p: CoreEvents['comment.created']) {
  const docs = [...commentTargets(p)].map(([userId, kind]) => ({
    userId,
    actorId: p.authorId,
    kind,
    postId: p.postId,
    postTitle: p.postTitle,
    snippet: p.snippet,
  }));
  if (docs.length) await Notification.insertMany(docs);
}

export async function onReaction(p: CoreEvents['reaction.created']) {
  // Toggling a reaction on and off must not spam: one unread notification per person per post.
  await Notification.updateOne(
    { userId: p.postAuthorId, actorId: p.userId, postId: p.postId, kind: 'reaction', read: false },
    { $set: { postTitle: p.postTitle, snippet: p.kind, createdAt: new Date() } },
    { upsert: true },
  );
}

export async function onFollow(p: CoreEvents['user.followed']) {
  // Unfollow + follow again must not spam: one notification per follower, refreshed and marked unread.
  await Notification.updateOne(
    { userId: p.followeeId, actorId: p.followerId, kind: 'follow' },
    { $set: { read: false, createdAt: new Date() } },
    { upsert: true },
  );
}

// ---- Reading: called from the controllers ----

export async function listNotifications(userId: string) {
  const rows = (await Notification.find({ userId })
    .sort({ createdAt: -1 })
    .limit(40)
    .populate('actorId', AUTHOR_FIELDS)
    .lean()) as unknown as Row[];
  const unread = await Notification.countDocuments({ userId, read: false });
  return {
    unread,
    items: rows.map((r) => ({
      id: String(r._id),
      kind: r.kind,
      postId: r.postId ? String(r.postId) : null,
      postTitle: r.postTitle,
      snippet: r.snippet,
      read: r.read,
      createdAt: r.createdAt,
      actor: r.actorId ? { username: r.actorId.username, displayName: r.actorId.displayName || r.actorId.username, character: r.actorId.character } : null,
    })),
  };
}

export async function unreadCount(userId: string) {
  return { unread: await Notification.countDocuments({ userId, read: false }) };
}

export async function markAllRead(userId: string) {
  await Notification.updateMany({ userId, read: false }, { $set: { read: true } });
  return { unread: 0 };
}

export async function markRead(userId: string, id: string) {
  await Notification.updateOne({ _id: id, userId }, { $set: { read: true } });
  return unreadCount(userId);
}
