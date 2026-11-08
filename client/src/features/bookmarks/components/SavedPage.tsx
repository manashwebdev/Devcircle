'use client';

import { useEffect, useState } from 'react';
import { EmptyState, Mascot, PixelButton, PostRow } from '@/core/ui';
import { timeAgo } from '@/core/time';
import { listSaved, type SavedPost } from '../api';

/** /saved: posts you saved, newest save first. */
export default function SavedPage() {
  const [items, setItems] = useState<SavedPost[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const ctrl = new AbortController();
    listSaved(ctrl.signal)
      .then((r) => setItems(r.items))
      .catch(() => !ctrl.signal.aborted && setError(true));
    return () => ctrl.abort();
  }, []);

  return (
    <div>
      <h1 className="mb-6 font-display text-4xl">Saved</h1>
      {error && <EmptyState title="Couldn't load your saved posts" mood="sleeping" />}
      {!error && items === null && <Mascot mood="typing" size={64} label="Loading" />}
      {items?.length === 0 && (
        <EmptyState title="Nothing saved yet" description="Press Save on any post to keep it here." action={<PixelButton href="/feed">Browse the feed</PixelButton>} />
      )}
      <div className="space-y-4">
        {items?.map((p) => (
          <PostRow key={p.id} post={p} note={`saved ${timeAgo(p.savedAt)}`} />
        ))}
      </div>
    </div>
  );
}
