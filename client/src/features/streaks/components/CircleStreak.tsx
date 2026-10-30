'use client';

import { useEffect, useState } from 'react';
import { Heatmap, PixelCard, PixelIcon } from '@/core/ui';
import { getCircleStreak } from '../api';
import type { CircleStreakInfo } from '../types';

/** Slot widget for the circle page: the circle streak, whether today is done, and a heatmap. */
export default function CircleStreak({ circleId }: { circleId: string }) {
  const [data, setData] = useState<CircleStreakInfo | null>(null);

  useEffect(() => {
    const ctrl = new AbortController();
    getCircleStreak(circleId, ctrl.signal)
      .then(setData)
      .catch(() => undefined);
    return () => ctrl.abort();
  }, [circleId]);

  if (!data) return null;

  const status = data.todayDone
    ? 'Everyone checked in today.'
    : data.atRisk
      ? 'At risk: the circle has not completed today yet. Anyone who has not checked in is holding the streak.'
      : data.current === 0
        ? 'No streak yet. It starts on a day when every member checks in (needs 5 or more members).'
        : '';

  return (
    <PixelCard title="Circle streak">
      <p className="mb-2 flex flex-wrap items-center gap-2 text-sm">
        <PixelIcon name="flame" />
        <span className="font-display text-xl text-accent-strong">{data.current}</span> day streak
        <span className="text-muted">· best {data.longest}</span>
      </p>
      {status && <p className="mb-3 text-xs text-muted">{status}</p>}
      <Heatmap days={data.days} today={data.today} label="Circle activity" />
    </PixelCard>
  );
}