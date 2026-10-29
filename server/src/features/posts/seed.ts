import { User } from '../../core/models/User';
import { Post } from './model';
import { makeExcerpt } from './service';

const demo = [
  { u: 'ada', type: 'built', title: 'A tiny CLI that diffs two .env files', request: 'try', tags: ['rust', 'cli'], link: 'https://github.com/example/envdiff',
    body: 'I got tired of **missing env vars** in staging, so I built `envdiff`.\n\n- reads two `.env` files\n- prints keys that are missing or different\n- never prints the values\n\nTry it and tell me what breaks.' },
  { u: 'lin', type: 'broke', title: 'I took down our queue with one missing index', request: 'none', tags: ['postgres', 'go'],
    body: 'A background job scanned a 40M row table with no index.\n\n## What happened\nLatency went from 20ms to 9s and the workers piled up.\n\n## Fix\nAdded a partial index and a statement timeout.' },
  { u: 'kai', type: 'learned', title: 'Server components finally clicked for me', request: 'review', tags: ['next.js', 'react'],
    body: 'The mental model that helped: *the server renders data, the client renders interaction*.\n\nI rewrote one page and shipped **40% less JavaScript**. Can someone review my approach?' },
  { u: 'mira', type: 'built', title: 'A tiny model that sorts my bug reports', request: 'try', tags: ['python', 'pytorch'],
    body: 'Fine-tuned a small classifier to label issues as bug, feature or question. 87% accuracy on my own repos.\n\n```python\nlabel = model.predict(issue_text)\n```' },
  { u: 'ravi', type: 'broke', title: 'My cron job ran twice and charged everyone', request: 'none', tags: ['docker', 'bash'],
    body: 'Two containers, one schedule. Classic.\n\nNow every job takes a **lock** first. Lesson learned the expensive way.' },
] as const;

/** Demo posts. Safe to run twice: matched by author + title. Skips authors that do not exist. */
export async function seedPosts() {
  let n = 0;
  for (const [i, d] of demo.entries()) {
    const author = await User.findOne({ username: d.u }).select('_id').lean();
    if (!author) continue;
    await Post.updateOne(
      { authorId: author._id, title: d.title },
      {
        $setOnInsert: {
          type: d.type, body: d.body, excerpt: makeExcerpt(d.body), tags: [...d.tags], request: d.request, link: 'link' in d ? d.link : undefined,
          // Spread the demo posts over the last few days so the feed looks real.
          createdAt: new Date(Date.now() - i * 6 * 60 * 60 * 1000),
        },
      },
      { upsert: true },
    );
    n++;
  }
  console.log(`[posts] seeded ${n} demo posts`);
}
