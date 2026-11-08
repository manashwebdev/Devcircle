import { AUTHOR_FIELDS, postModel, toPostLite, type PostLiteRow } from '../../core/lookup';
import { User } from '../../core/models/User';
import type { SearchQuery } from './schema';

/** User text must never become regex syntax (that would be a ReDoS / injection hole). */
export function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** "#Rust" -> tag-only search for "rust". Anything else searches text and tags. */
export function parseTerm(q: string): { term: string; tagOnly: boolean } {
  const tagOnly = q.startsWith('#');
  return { term: (tagOnly ? q.slice(1) : q).trim().toLowerCase(), tagOnly };
}

export async function search({ q, scope }: SearchQuery) {
  const { term, tagOnly } = parseTerm(q);
  if (!term) return { posts: [], people: [] };
  const rx = new RegExp(escapeRegex(term), 'i');

  const Post = postModel();
  const posts =
    scope !== 'people' && Post
      ? ((await Post.find({ hidden: false, $or: tagOnly ? [{ tags: term }] : [{ title: rx }, { excerpt: rx }, { tags: term }] })
          .select('-body')
          .sort({ createdAt: -1 })
          .limit(15)
          .populate('authorId', AUTHOR_FIELDS)
          .lean()) as unknown as PostLiteRow[])
      : [];

  const people =
    scope !== 'posts'
      ? await User.find({ banned: false, $or: tagOnly ? [{ techStack: term }] : [{ username: rx }, { displayName: rx }, { techStack: term }] })
          .select('username displayName character bio techStack')
          .sort({ username: 1 })
          .limit(10)
          .lean()
      : [];

  return {
    posts: posts.map(toPostLite),
    people: people.map((u) => ({
      username: u.username,
      displayName: u.displayName || u.username,
      character: u.character,
      bio: u.bio,
      techStack: u.techStack,
    })),
  };
}
