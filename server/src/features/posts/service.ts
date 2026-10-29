import type { Types } from 'mongoose';
import type { CharacterId } from '../../core/constants';
import { AppError } from '../../core/errors';
import { events } from '../../core/events';
import { User, type UserDoc } from '../../core/models/User';
import { Post } from './model';
import type { CreatePostInput, ListPostsQuery } from './schema';

interface AuthorLite {
  _id: Types.ObjectId;
  username: string;
  displayName: string;
  character: CharacterId;
}
interface PostRow {
  _id: Types.ObjectId;
  authorId: AuthorLite | null;
  type: 'built' | 'broke' | 'learned';
  title: string;
  body?: string;
  excerpt: string;
  tags: string[];
  link?: string;
  request: 'none' | 'try' | 'review';
  createdAt: Date;
}

/** Plain-text preview for the feed: drop code blocks and markdown symbols, collapse spaces. */
export function makeExcerpt(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[#*`>_]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 240);
}

/** Shape sent to the client. `mine` lets the UI show a delete button without exposing ids. */
function toPublic(row: PostRow, viewerId: string, withBody: boolean) {
  const a = row.authorId;
  return {
    id: String(row._id),
    type: row.type,
    title: row.title,
    excerpt: row.excerpt,
    ...(withBody ? { body: row.body ?? '' } : {}),
    tags: row.tags,
    link: row.link,
    request: row.request,
    createdAt: row.createdAt,
    mine: a ? String(a._id) === viewerId : false,
    author: a ? { username: a.username, displayName: a.displayName || a.username, character: a.character } : null,
  };
}

const AUTHOR_FIELDS = 'username displayName character';

export async function createPost(user: UserDoc, input: CreatePostInput) {
  const post = await Post.create({ ...input, authorId: user._id, excerpt: makeExcerpt(input.body) });
  // Other features (streaks, notifications, ...) can react to this without importing posts.
  events.emit('post.created', { postId: post.id, authorId: user.id });
  return getPost(post.id, user.id);
}

/** Newest first, cursor-paginated by createdAt (stable even when new posts arrive). */
export async function listPosts(q: ListPostsQuery, viewerId: string) {
  const filter: Record<string, unknown> = { hidden: false };
  if (q.type) filter.type = q.type;
  if (q.tag) filter.tags = q.tag;
  if (q.before) filter.createdAt = { $lt: q.before };
  if (q.author) {
    const author = await User.findOne({ username: q.author }).select('_id').lean();
    if (!author) return { items: [], nextBefore: null };
    filter.authorId = author._id;
  }

  // Ask for one extra row to learn whether there is another page.
  const rows = (await Post.find(filter)
    .select('-body')
    .sort({ createdAt: -1 })
    .limit(q.limit + 1)
    .populate('authorId', AUTHOR_FIELDS)
    .lean()) as unknown as PostRow[];

  const hasMore = rows.length > q.limit;
  const page = hasMore ? rows.slice(0, q.limit) : rows;
  const last = page[page.length - 1];
  return {
    items: page.map((r) => toPublic(r, viewerId, false)),
    nextBefore: hasMore && last ? last.createdAt.toISOString() : null,
  };
}

export async function getPost(id: string, viewerId: string) {
  const row = (await Post.findOne({ _id: id, hidden: false })
    .populate('authorId', AUTHOR_FIELDS)
    .lean()) as unknown as PostRow | null;
  if (!row) throw AppError.notFound('Post not found');
  return toPublic(row, viewerId, true);
}

/** Only the author (or an admin) may delete. */
export async function deletePost(user: UserDoc, id: string) {
  const post = await Post.findById(id);
  if (!post || post.hidden) throw AppError.notFound('Post not found');
  if (String(post.authorId) !== user.id && user.role !== 'admin') throw AppError.forbidden('Not your post');
  await post.deleteOne();
  return { deleted: true };
}
