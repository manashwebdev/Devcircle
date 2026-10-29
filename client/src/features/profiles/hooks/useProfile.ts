'use client';

import { useEffect, useState } from 'react';
import { ApiError } from '@/core/api';
import type { PublicUser } from '@/core/types';
import { getProfile } from '../api';

/** Load one profile by username. `notFound` is true for a 404 so the page can show a friendly state. */
export function useProfile(username: string) {
  const [profile, setProfile] = useState<PublicUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ctrl = new AbortController();
    setLoading(true);
    setNotFound(false);
    setError(null);
    getProfile(username, ctrl.signal)
      .then(setProfile)
      .catch((e: unknown) => {
        if (ctrl.signal.aborted) return;
        if (e instanceof ApiError && e.status === 404) setNotFound(true);
        else setError(e instanceof Error ? e.message : 'Something went wrong');
      })
      .finally(() => !ctrl.signal.aborted && setLoading(false));
    return () => ctrl.abort();
  }, [username]);

  return { profile, loading, notFound, error };
}
