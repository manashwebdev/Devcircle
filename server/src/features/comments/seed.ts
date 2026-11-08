import { postModel } from '../../core/lookup';
import { User } from '../../core/models/User';
import { Comment } from './model';

const demo = [
  { post: 'A tiny CLI that diffs two .env files', u: 'lin', body: 'Nice. Does it handle `export FOO=bar` lines and quoted values?' },
  { post: 'A tiny CLI that diffs two .env files', u: 'kai', body: 'Would love a `--ci` flag that exits non-zero when keys are missing. @ada' },
  { post: 'I took down our queue with one missing index', u: 'ravi', body: 'Been there. A `statement_timeout` per role saved us twice.' },
  { post: 'Server components finally clicked for me', u: 'mira', body: 'The server renders data, the client renders interaction. Stealing that line.' },
] as const;

/** Demo comments. Safe to run twice (matched by post + author + text). Skips anything whose post or author is missing. */
export async function seedComments() {
  const Post = postModel();
  if (!Post) return;
  let n = 0;
  for (const d of demo) {
    const post = (await Post.findOne({ title: d.post }).select('_id').lean()) as { _id: unknown } | null;
    const author = await User.findOne({ username: d.u }).select('_id').lean();
    if (!post || !author) continue;
    await Comment.updateOne({ postId: post._id, authorId: author._id, body: d.body }, { $setOnInsert: { parentId: null } }, { upsert: true });
    n++;
  }
  console.log(`[comments] seeded ${n} demo comments`);
}
