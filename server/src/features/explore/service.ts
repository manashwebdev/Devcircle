import type { UserDoc } from '../../core/models/User';
import { User } from '../../core/models/User';
import { AUTHOR_FIELDS, postModel, toPostLite, type PostLiteRow } from '../../core/lookup';

const TREND_DAYS = 14;

/** Pure: which of MY technologies does this developer share? */
export function sharedTech(mine: string[], theirs: string[]): string[] {
  const set = new Set(mine);
  return theirs.filter((t) => set.has(t));
}

async function board(request: 'review' | 'try') {
  const Post = postModel();
  if (!Post) return [];
  const rows = (await Post.find({ hidden: false, request })
    .select('-body')
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('authorId', AUTHOR_FIELDS)
    .lean()) as unknown as PostLiteRow[];
  return rows.map(toPostLite);
}

async function trendingTags() {
  const Post = postModel();
  if (!Post) return [];
  const since = new Date(Date.now() - TREND_DAYS * 24 * 60 * 60 * 1000);
  const rows = await Post.aggregate<{ _id: string; n: number }>([
    { $match: { hidden: false, createdAt: { $gte: since } } },
    { $unwind: '$tags' },
    { $group: { _id: '$tags', n: { $sum: 1 } } },
    { $sort: { n: -1, _id: 1 } },
    { $limit: 12 },
  ]);
  return rows.map((r) => ({ tag: r._id, count: r.n }));
}

/** Developers who share your stack first; if there are none, the newest members. */
async function people(me: UserDoc) {
  const mine = me.techStack ?? [];
  const select = 'username displayName character bio techStack';
  const similar = mine.length
    ? await User.find({ _id: { $ne: me._id }, banned: false, techStack: { $in: mine } }).select(select).sort({ createdAt: -1 }).limit(6).lean()
    : [];
  const found = similar.length
    ? similar
    : await User.find({ _id: { $ne: me._id }, banned: false }).select(select).sort({ createdAt: -1 }).limit(6).lean();
  return found.map((u) => ({
    username: u.username,
    displayName: u.displayName || u.username,
    character: u.character,
    bio: u.bio,
    techStack: u.techStack,
    shared: sharedTech(mine, u.techStack),
  }));
}

export async function explore(me: UserDoc) {
  const [tags, needsReview, tryIt, devs] = await Promise.all([trendingTags(), board('review'), board('try'), people(me)]);
  return { trendingTags: tags, needsReview, tryIt, people: devs };
}
