import mongoose, { type Model, type Types } from 'mongoose';

/**
 * Read-only lookups into the posts collection for features that sit AROUND posts
 * (comments, reactions, bookmarks, notifications, search, explore, ai-summaries).
 *
 * Why not `import { Post } from '../posts/model'`? Because features never import each other.
 * We ask Mongoose for the model by name instead: if the posts feature is off, the model was never
 * registered, these helpers return null / empty, and every feature built on them degrades quietly.
 */
type Row = Record<string, unknown>;

export function postModel(): Model<Row> | null {
  return (mongoose.models['Post'] as Model<Row> | undefined) ?? null;
}

export interface PostMeta {
  id: string;
  authorId: string;
  title: string;
}

/** Cheap existence + ownership check: is there a visible post with this id, and who wrote it? */
export async function getPostMeta(postId: string): Promise<PostMeta | null> {
  const Post = postModel();
  if (!Post) return null;
  const row = (await Post.findOne({ _id: postId, hidden: false }).select('authorId title').lean()) as unknown as {
    _id: Types.ObjectId;
    authorId: Types.ObjectId;
    title: string;
  } | null;
  return row ? { id: String(row._id), authorId: String(row.authorId), title: row.title } : null;
}

/** Fields to populate for an author badge (avatar + names). */
export const AUTHOR_FIELDS = 'username displayName character';

export interface PostLiteRow {
  _id: Types.ObjectId;
  authorId: { username: string; displayName: string; character: string } | null;
  type: string;
  title: string;
  excerpt: string;
  tags: string[];
  request?: string;
  createdAt: Date;
}

/** The small post shape lists use (search results, saved posts, explore boards). */
export function toPostLite(r: PostLiteRow) {
  const a = r.authorId;
  return {
    id: String(r._id),
    type: r.type,
    title: r.title,
    excerpt: r.excerpt,
    tags: r.tags,
    request: r.request ?? 'none',
    createdAt: r.createdAt,
    author: a ? { username: a.username, displayName: a.displayName || a.username, character: a.character } : null,
  };
}
