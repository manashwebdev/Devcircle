'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { api, ApiError } from '../api';
import { activeManifests } from '../features/registry';
import type { FeatureManifest, SessionUser } from '../types';

interface AppState {
  status: 'loading' | 'ready' | 'error';
  user: SessionUser | null;
  /** Feature ids that are on in both client config and server. */
  features: FeatureManifest[];
  isEnabled: (id: string) => boolean;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
}

const AppContext = createContext<AppState | null>(null);

/** Loads "who am I" and "which features are on" once, and shares them with the whole app. */
export function AppProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AppState['status']>('loading');
  const [user, setUser] = useState<SessionUser | null>(null);
  const [serverEnabled, setServerEnabled] = useState<Set<string>>(new Set());

  const refresh = useCallback(async () => {
    try {
      const [feat, me] = await Promise.all([
        api<{ enabled: string[] }>('/features'),
        // 401 just means "signed out", which is a normal state, not an error.
        api<SessionUser>('/auth/me').catch((e: unknown) => {
          if (e instanceof ApiError && e.status === 401) return null;
          throw e;
        }),
      ]);
      setServerEnabled(new Set(feat.enabled));
      setUser(me);
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const logout = useCallback(async () => {
    await api('/auth/logout', { method: 'POST' }).catch(() => undefined);
    setUser(null);
  }, []);

  const value = useMemo<AppState>(() => {
    const features = activeManifests(serverEnabled);
    return { status, user, features, isEnabled: (id) => features.some((f) => f.id === id), refresh, logout };
  }, [status, user, serverEnabled, refresh, logout]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>');
  return ctx;
}
