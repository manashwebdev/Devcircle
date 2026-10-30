'use client';

import { useEffect, useState } from 'react';
import { listMyCircles, listPublicCircles } from '../api';
import type { CircleSummary } from '../types';

/** Loads either "my circles" or "public circles". Re-loads if `scope` changes. */
export function useCircleList(scope: 'mine' | 'public') {
  const [items, setItems] = useState<CircleSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // AbortController cancels the request if the component goes away mid-load.
    const ctrl = new AbortController();
    setLoading(true);
    setError(null);
    (scope === 'mine' ? listMyCircles : listPublicCircles)(ctrl.signal)
      .then(setItems)
      .catch((e: unknown) => !ctrl.signal.aborted && setError(e instanceof Error ? e.message : 'Could not load circles'))
      .finally(() => !ctrl.signal.aborted && setLoading(false));
    return () => ctrl.abort();
  }, [scope]);

  return { items, loading, error };
}