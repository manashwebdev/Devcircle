'use client';

import { EmptyState, Mascot, PixelButton } from '@/core/ui';
import { useFeed } from '../hooks/useFeed';
import type { PostType } from '../types';
import { PostCard } from './PostCard';

export function FeedList({ type, tag, author }: { type?: PostType; tag?: string; author?: string }) {
  const { items, loading, error, hasMore, loadMore } = useFeed({ type, tag, author });

  if (error && items.length === 0) return <EmptyState title="Couldn't load the feed" description={error} mood="sleeping" />;
  if (loading && items.length === 0) return <Mascot mood="typing" size={64} label="Loading posts" />;
  if (items.length === 0) {
    return <EmptyState title="Nothing here yet" description="Be the first to post what you built, broke or learned." mood="idle" action={<PixelButton href="/compose">Write a post</PixelButton>} />;
  }
  return (
    <div className="flex flex-col gap-6">
      {items.map((p) => <PostCard key={p.id} post={p} />)}
      {hasMore && (
        <PixelButton variant="ghost" onClick={() => void loadMore()} disabled={loading} className="self-center">
          {loading ? 'Loading...' : 'Load more'}
        </PixelButton>
      )}
    </div>
  );
}
