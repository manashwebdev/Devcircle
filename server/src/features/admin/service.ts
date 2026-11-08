import mongoose, { type Types } from 'mongoose';
import { AppError } from '../../core/errors';
import { AUTHOR_FIELDS, postModel } from '../../core/lookup';
import { Session } from '../../core/models/Session';
import { User, type UserDoc } from '../../core/models/User';

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const countOf = async (name: string, filter: Record<string, unknown> = {}) => {
  const m = mongoose.models[name];
  return m ? m.countDocuments(filter) : null; // null = that feature is off
};

export async function stats() {
  const week = { createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } };
  const [users, banned, newUsers, posts, hiddenPosts, newPosts, comments] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ banned: true }),
    User.countDocuments(week),
    countOf('Post'),
    countOf('Post', { hidden: true }),
    countOf('Post', week),
    countOf('Comment'),
  ]);
  return { users, banned, newUsers, posts, hiddenPosts, newPosts, comments };
}

export async function listUsers(q?: string) {
  const rx = q ? new RegExp(escapeRegex(q), 'i') : null;
  const rows = await User.find(rx ? { $or: [{ username: rx }, { displayName: rx }] } : {})
    .select('username displayName character role banned createdAt')
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();
  return {
    items: rows.map((u) => ({
      id: String(u._id),
      username: u.username,
      displayName: u.displayName || u.username,
      character: u.character,
      role: u.role,
      banned: u.banned,
      createdAt: (u as unknown as { createdAt: Date }).createdAt,
    })),
  };
}

/** Banning also revokes every session, so the person is signed out everywhere immediately. */
export async function setBanned(admin: UserDoc, id: string, banned: boolean) {
  const target = await User.findById(id);
  if (!target) throw AppError.notFound('User not found');
  if (target.id === admin.id || target.role === 'admin') throw AppError.forbidden('You cannot ban yourself or another admin');
  target.banned = banned;
  await target.save();
  if (banned) await Session.deleteMany({ userId: target._id });
  return { id: target.id as string, banned };
}

interface AdminPostRow {
  _id: Types.ObjectId;
  type: string;
  title: string;
  hidden: boolean;
  createdAt: Date;
  authorId: { username: string } | null;
}

export async function listPosts() {
  const Post = postModel();
  if (!Post) return { items: [] };
  const rows = (await Post.find({}).select('type title hidden createdAt authorId').sort({ createdAt: -1 }).limit(50).populate('authorId', AUTHOR_FIELDS).lean()) as unknown as AdminPostRow[];
  return {
    items: rows.map((r) => ({ id: String(r._id), type: r.type, title: r.title, hidden: r.hidden, createdAt: r.createdAt, author: r.authorId?.username ?? null })),
  };
}

/** Hidden posts stay in the database but vanish from every query (feed, search, explore, saved...). */
export async function setHidden(id: string, hidden: boolean) {
  const Post = postModel();
  if (!Post) throw AppError.notFound('Posts are not enabled');
  const res = await Post.updateOne({ _id: id }, { $set: { hidden } });
  if (res.matchedCount === 0) throw AppError.notFound('Post not found');
  return { id, hidden };
}
