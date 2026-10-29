'use client';

import { useCallback, useEffect, useState } from 'react';
import { listPosts } from '../api';
import type { PostSummary, PostType } from '../types';

/** Loads the feed (optionally filtered) and supports "load more" with the server's cursor. */
export function useFeed(filter: { type?: PostType; tag?: string; author?: string }) {
  const { type, tag, author } = filter;
  const [items, setItems] = useState<PostSummary[]>([]);
  const [next, setNext] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ctrl = new AbortController();
    setLoading(true);
    setError(null);
    listPosts({ type, tag, author }, ctrl.signal)
      .then((p) => {
        setItems(p.items);
        setNext(p.nextBefore);
      })
      .catch((e: unknown) => !ctrl.signal.aborted && setError(e instanceof Error ? e.message : 'Could not load posts'))
      .finally(() => !ctrl.signal.aborted && setLoading(false));
    return () => ctrl.abort();
  }, [type, tag, author]);

  const loadMore = useCallback(async () => {
    if (!next) return;
    setLoading(true);
    try {
      const p = await listPosts({ type, tag, author, before: next });
      setItems((prev) => [...prev, ...p.items]);
      setNext(p.nextBefore);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load more');
    } finally {
      setLoading(false);
    }
  }, [next, type, tag, author]);

  return { items, loading, error, hasMore: next !== null, loadMore };
}
