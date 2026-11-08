import { AppError } from '../../core/errors';
import { AUTHOR_FIELDS, getPostMeta, postModel, toPostLite, type PostLiteRow } from '../../core/lookup';
import { Bookmark } from './model';

export async function isSaved(userId: string, postId: string) {
  return { saved: Boolean(await Bookmark.exists({ userId, postId })) };
}

export async function toggleSaved(userId: string, postId: string) {
  const removed = await Bookmark.findOneAndDelete({ userId, postId });
  if (removed) return { saved: false };
  if (!(await getPostMeta(postId))) throw AppError.notFound('Post not found');
  try {
    await Bookmark.create({ userId, postId });
  } catch (err) {
    if ((err as { code?: number }).code !== 11000) throw err; // double tap: already saved
  }
  return { saved: true };
}

/** Saved posts, newest save first. Posts deleted since are skipped. */
export async function listSaved(userId: string) {
  const Post = postModel();
  if (!Post) return { items: [] };
  const marks = await Bookmark.find({ userId }).sort({ createdAt: -1 }).limit(100).lean();
  if (marks.length === 0) return { items: [] };

  const posts = (await Post.find({ _id: { $in: marks.map((m) => m.postId) }, hidden: false })
    .select('-body')
    .populate('authorId', AUTHOR_FIELDS)
    .lean()) as unknown as PostLiteRow[];
  const byId = new Map(posts.map((p) => [String(p._id), p]));
  const items = marks.flatMap((m) => {
    const p = byId.get(String(m.postId));
    return p ? [{ ...toPostLite(p), savedAt: m.createdAt }] : [];
  });
  return { items };
}
