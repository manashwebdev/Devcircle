'use client';

import { PixelButton, Tabs } from '@/core/ui';
import { FeedList } from './FeedList';

/** /feed: everyone's posts, filterable by type. */
export default function FeedPage() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="font-display text-4xl">Feed</h1>
        <PixelButton href="/compose">New post</PixelButton>
      </div>
      <Tabs
        items={[
          { id: 'all', label: 'All', content: <FeedList /> },
          { id: 'built', label: 'Built', content: <FeedList type="built" /> },
          { id: 'broke', label: 'Broke', content: <FeedList type="broke" /> },
          { id: 'learned', label: 'Learned', content: <FeedList type="learned" /> },
        ]}
      />
    </div>
  );
}
