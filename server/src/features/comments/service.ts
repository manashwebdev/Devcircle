import type { Types } from 'mongoose';
import { AppError } from '../../core/errors';
import { events } from '../../core/events';
import { AUTHOR_FIELDS, getPostMeta } from '../../core/lookup';
import { User, type UserDoc } from '../../core/models/User';
import { Comment } from './model';
import type { CreateCommentInput } from './schema';

interface CommentRow {
  _id: Types.ObjectId;
  postId: Types.ObjectId;
  authorId: { _id: Types.ObjectId; username: string; displayName: string; character: string } | null;
  parentId: Types.ObjectId | null;
  body: string;
  createdAt: Date;
}

/** @usernames in a comment (max 5, lowercase, no duplicates). Emails like a@b.com are ignored. */
export function extractMentions(text: string): string[] {
  const found = new Set<string>();
  for (const m of text.matchAll(/(?:^|[^\w@])@([a-z0-9_-]{3,24})\b/gi)) {
    if (m[1]) found.add(m[1].toLowerCase());
  }
  return [...found].slice(0, 5);
}

function toPublic(row: CommentRow, viewer: { id: string; admin: boolean }, postAuthorId: string) {
  const a = row.authorId;
  const mine = a ? String(a._id) === viewer.id : false;
  return {
    id: String(row._id),
    parentId: row.parentId ? String(row.parentId) : null,
    body: row.body,
    createdAt: row.createdAt,
    mine,
    // The comment's author, the post's author and admins may delete it.
    canDelete: mine || postAuthorId === viewer.id || viewer.admin,
    author: a ? { username: a.username, displayName: a.displayName || a.username, character: a.character } : null,
  };
}

export async function listComments(user: UserDoc, postId: string) {
  const post = await getPostMeta(postId);
  if (!post) throw AppError.notFound('Post not found');
  const rows = (await Comment.find({ postId })
    .sort({ createdAt: 1 })
    .limit(300)
    .populate('authorId', AUTHOR_FIELDS)
    .lean()) as unknown as CommentRow[];
  const viewer = { id: user.id as string, admin: user.role === 'admin' };
  return { items: rows.map((r) => toPublic(r, viewer, post.authorId)) };
}

export async function createComment(user: UserDoc, postId: string, input: CreateCommentInput) {
  const post = await getPostMeta(postId);
  if (!post) throw AppError.notFound('Post not found');

  let parentId: string | null = null;
  let parentAuthorId: string | null = null;
  if (input.parentId) {
    const parent = await Comment.findOne({ _id: input.parentId, postId }).lean();
    if (!parent) throw AppError.notFound('The comment you are replying to no longer exists');
    parentId = String(parent.parentId ?? parent._id); // replying to a reply attaches to the top-level comment
    parentAuthorId = String(parent.authorId);
  }

  const comment = await Comment.create({ postId, authorId: user._id, parentId, body: input.body });

  const names = extractMentions(input.body);
  const mentioned = names.length ? await User.find({ username: { $in: names }, banned: false }).select('_id').lean() : [];

  events.emit('comment.created', {
    commentId: comment.id,
    postId,
    postTitle: post.title,
    postAuthorId: post.authorId,
    authorId: user.id,
    parentAuthorId,
    mentionedIds: mentioned.map((m) => String(m._id)),
    snippet: input.body.replace(/\s+/g, ' ').slice(0, 120),
  });

  const row = (await Comment.findById(comment.id).populate('authorId', AUTHOR_FIELDS).lean()) as unknown as CommentRow;
  return toPublic(row, { id: user.id as string, admin: user.role === 'admin' }, post.authorId);
}

export async function deleteComment(user: UserDoc, id: string) {
  const comment = await Comment.findById(id);
  if (!comment) throw AppError.notFound('Comment not found');
  const post = await getPostMeta(String(comment.postId));
  const allowed =
    String(comment.authorId) === user.id || user.role === 'admin' || (post !== null && post.authorId === user.id);
  if (!allowed) throw AppError.forbidden('You cannot delete this comment');
  await Comment.deleteMany({ $or: [{ _id: comment._id }, { parentId: comment._id }] });
  return { deleted: true };
}
