'use client';

import { useEffect, useState } from 'react';
import { Heatmap, PixelCard, PixelIcon } from '@/core/ui';
import { getUserStreak } from '../api';
import type { StreakInfo } from '../types';

/** Slot widget for the profile page: streak numbers + the calendar heatmap. */
export default function ProfileStreak({ username, isMe }: { username: string; isMe: boolean }) {
  const [data, setData] = useState<StreakInfo | null>(null);

  useEffect(() => {
    const ctrl = new AbortController();
    getUserStreak(username, ctrl.signal)
      .then(setData)
      .catch(() => undefined); // a widget should never break the page it sits on
    return () => ctrl.abort();
  }, [username]);

  if (!data) return null;
  return (
    <PixelCard title="Streak">
      <p className="mb-3 flex flex-wrap items-center gap-2 text-sm">
        <PixelIcon name="flame" />
        <span className="font-display text-xl text-accent-strong">{data.current}</span> day streak
        <span className="text-muted">· best {data.longest}</span>
      </p>
      {data.atRisk && isMe && <p className="mb-3 border-2 border-dashed border-accent-strong p-2 text-xs text-accent-strong">Check in today to keep your streak alive.</p>}
      <Heatmap days={data.days} today={data.today} label={`${username}'s activity`} />
    </PixelCard>
  );
}