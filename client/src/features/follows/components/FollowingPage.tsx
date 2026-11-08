'use client';

import { useCallback, useEffect, useState } from 'react';
import type { PersonLite, PostLite } from '@/core/types';
import { EmptyState, Mascot, PersonRow, PixelButton, PostRow } from '@/core/ui';
import { listFeed, listPeople } from '../api';

/** /following: posts from people you follow, and who they are. */
export default function FollowingPage() {
  const [people, setPeople] = useState<PersonLite[] | null>(null);
  const [posts, setPosts] = useState<PostLite[]>([]);
  const [next, setNext] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const ctrl = new AbortController();
    Promise.all([listPeople(ctrl.signal), listFeed(undefined, ctrl.signal)])
      .then(([p, f]) => {
        setPeople(p.items);
        setPosts(f.items);
        setNext(f.nextBefore);
      })
      .catch(() => !ctrl.signal.aborted && setError(true))
      .finally(() => !ctrl.signal.aborted && setLoading(false));
    return () => ctrl.abort();
  }, []);

  const more = useCallback(async () => {
    if (!next) return;
    setLoading(true);
    try {
      const f = await listFeed(next);
      setPosts((prev) => [...prev, ...f.items]);
      setNext(f.nextBefore);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [next]);

  if (error) return <EmptyState title="Couldn't load Following" mood="sleeping" />;
  if (loading && people === null) return <Mascot mood="typing" size={64} label="Loading" />;

  if (people && people.length === 0) {
    return (
      <div>
        <h1 className="mb-6 font-display text-4xl">Following</h1>
        <EmptyState
          title="You are not following anyone yet"
          description="Open a developer's profile and press Follow. Their posts will show up here."
          action={<PixelButton href="/explore">Find developers</PixelButton>}
        />
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 font-display text-4xl">Following</h1>
      {posts.length === 0 ? (
        <p className="mb-8 text-sm text-muted">The people you follow have not posted yet.</p>
      ) : (
        <div className="mb-4 space-y-4">
          {posts.map((p) => (
            <PostRow key={p.id} post={p} />
          ))}
        </div>
      )}
      {next && (
        <PixelButton variant="ghost" onClick={() => void more()} disabled={loading}>
          {loading ? 'Loading…' : 'Load more'}
        </PixelButton>
      )}

      <h2 className="mb-3 mt-10 font-display text-2xl text-accent-strong">People you follow</h2>
      <div className="grid gap-3 md:grid-cols-2">
        {people?.map((p) => (
          <PersonRow key={p.username} person={p} />
        ))}
      </div>
    </div>
  );
}
