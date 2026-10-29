'use client';

import type { ReactNode } from 'react';
import { useApp } from '@/core/auth/AppContext';
import { AppShell, PublicShell } from '@/core/layout/AppShell';
import { EmptyState, Mascot, PixelButton } from '@/core/ui';

/**
 * Wraps every page except the landing page.
 * Why client-side? The session cookie belongs to the SERVER's domain, so Next.js (on another domain)
 * can't read it. We ask the server "who am I?" instead (AppProvider) and gate here.
 */
export default function AppGroupLayout({ children }: { children: ReactNode }) {
  const { status, user, refresh } = useApp();

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Mascot mood="typing" size={96} label="Loading" />
      </div>
    );
  }
  if (status === 'error') {
    return (
      <div className="mx-auto flex min-h-screen max-w-xl items-center px-4">
        <EmptyState
          title="Can't reach the server"
          description="Check that the server is running (npm run dev in /server) and NEXT_PUBLIC_API_URL is correct."
          action={<PixelButton onClick={() => void refresh()}>Try again</PixelButton>}
        />
      </div>
    );
  }
  return user ? <AppShell>{children}</AppShell> : <PublicShell>{children}</PublicShell>;
}
