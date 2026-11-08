'use client';

import Link from 'next/link';
import { useEffect, useState, type ReactNode } from 'react';
import { EmptyState, Mascot, PersonRow, PostRow } from '@/core/ui';
import { getExplore } from '../api';
import type { ExploreData } from '../types';

function Section({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="font-display text-2xl text-accent-strong">{title}</h2>
      {hint && <p className="mb-3 text-xs text-muted">{hint}</p>}
      {children}
    </section>
  );
}

/** /explore: what is happening and where you can help. */
export default function ExplorePage() {
  const [data, setData] = useState<ExploreData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const ctrl = new AbortController();
    getExplore(ctrl.signal)
      .then(setData)
      .catch(() => !ctrl.signal.aborted && setError(true));
    return () => ctrl.abort();
  }, []);

  if (error) return <EmptyState title="Couldn't load Explore" mood="sleeping" />;
  if (!data) return <Mascot mood="typing" size={64} label="Loading" />;

  return (
    <div>
      <h1 className="mb-6 font-display text-4xl">Explore</h1>

      <Section title="Trending this fortnight" hint="Tags used most in the last 14 days">
        {data.trendingTags.length === 0 ? (
          <p className="text-sm text-muted">Nothing trending yet. Post something with a tag.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {data.trendingTags.map((t) => (
              <Link
                key={t.tag}
                href={`/search?${new URLSearchParams({ q: `#${t.tag}` })}`}
                className="border-2 border-dashed border-line px-3 py-1 text-sm hover:border-accent-strong hover:text-accent-strong"
              >
                #{t.tag} <span className="text-xs text-muted">{t.count}</span>
              </Link>
            ))}
          </div>
        )}
      </Section>

      <Section title="Needs a review" hint="Authors asked for feedback. A good review is the nicest thing you can post.">
        {data.needsReview.length === 0 ? <p className="text-sm text-muted">No open review requests.</p> : <div className="space-y-4">{data.needsReview.map((p) => <PostRow key={p.id} post={p} />)}</div>}
      </Section>

      <Section title="Try it" hint="Things people built and want you to break">
        {data.tryIt.length === 0 ? <p className="text-sm text-muted">Nothing to try right now.</p> : <div className="space-y-4">{data.tryIt.map((p) => <PostRow key={p.id} post={p} />)}</div>}
      </Section>

      <Section title="Developers to meet" hint="Sharing your stack comes first, then the newest members">
        <div className="grid gap-3 md:grid-cols-2">
          {data.people.map((p) => (
            <PersonRow key={p.username} person={p} shared={p.shared} />
          ))}
        </div>
      </Section>
    </div>
  );
}
