'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, type ReactNode } from 'react';
import { useApp } from '../auth/AppContext';
import { navItems } from '../features/registry';
import { Logo, Modal, PixelAvatar, PixelButton, PixelIcon, cn } from '../ui';
import { ThemeToggle } from './ThemeToggle';

/**
 * Signed-in shell. Navigation is NOT hard-coded: it is built from the active feature manifests,
 * so a disabled module has no nav item. Desktop = left sidebar, mobile = bottom tab bar.
 */
export function AppShell({ children }: { children: ReactNode }) {
  const { user, features, logout } = useApp();
  const pathname = usePathname();
  const router = useRouter();
  const [moreOpen, setMoreOpen] = useState(false);

  // The profile entry points at /u/me; make it light up on your own profile page too.
  const items = navItems(features).map((n) => (n.href === '/u/me' && user ? { ...n, href: `/u/${user.username}` } : n));
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  const signOut = async () => {
    await logout();
    router.replace('/');
  };

  const MOBILE_SLOTS = 4;
  const primary = items.length > MOBILE_SLOTS ? items.slice(0, MOBILE_SLOTS - 1) : items;
  const overflow = items.length > MOBILE_SLOTS ? items.slice(MOBILE_SLOTS - 1) : [];

  return (
    <div className="min-h-screen md:flex">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r-2 border-dashed border-line p-4 md:flex">
        <Link href={user ? `/u/${user.username}` : '/'} aria-label="DevCircle home" className="mb-6">
          <Logo />
        </Link>
        <nav aria-label="Main" className="flex flex-1 flex-col gap-1">
          {items.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              aria-current={isActive(n.href) ? 'page' : undefined}
              className={cn('flex items-center gap-3 border-2 border-dashed px-3 py-2 text-sm uppercase', isActive(n.href) ? 'border-accent-strong bg-accent text-on-accent' : 'border-transparent text-muted hover:border-line hover:text-ink')}
            >
              <PixelIcon name={n.icon} />
              {n.label}
            </Link>
          ))}
        </nav>
        {user && (
          <div className="mt-4 border-t-2 border-dashed border-line pt-4">
            <div className="mb-3 flex items-center gap-3">
              <PixelAvatar character={user.character} size={40} />
              <div className="min-w-0 text-sm">
                <div className="truncate font-display">{user.displayName}</div>
                <div className="truncate text-xs text-muted">@{user.username}</div>
              </div>
            </div>
            <div className="flex gap-2">
              <ThemeToggle />
              <button onClick={signOut} className="border-2 border-dashed border-line px-2 py-1 text-xs uppercase text-muted hover:text-ink">
                Sign out
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* Page content. pb leaves room for the mobile bottom bar. */}
      <main className="min-w-0 flex-1 px-4 pb-28 pt-6 md:px-10 md:pb-10">
        <div className="mx-auto max-w-3xl">{children}</div>
      </main>

      {/* Mobile bottom tab bar */}
      <nav aria-label="Main" className="fixed inset-x-0 bottom-0 z-40 flex border-t-2 border-dashed border-line bg-bg pb-[env(safe-area-inset-bottom)] md:hidden">
        {primary.map((n) => (
          <Link key={n.href} href={n.href} aria-current={isActive(n.href) ? 'page' : undefined} className={cn('flex flex-1 flex-col items-center gap-1 py-2 text-[10px] uppercase', isActive(n.href) ? 'text-accent-strong' : 'text-muted')}>
            <PixelIcon name={n.icon} />
            {n.label}
          </Link>
        ))}
        {overflow.length > 0 && (
          <button onClick={() => setMoreOpen(true)} className="flex flex-1 flex-col items-center gap-1 py-2 text-[10px] uppercase text-muted">
            <PixelIcon name="more" />
            More
          </button>
        )}
      </nav>

      <Modal open={moreOpen} onClose={() => setMoreOpen(false)} title="More">
        <div className="flex flex-col gap-2">
          {overflow.map((n) => (
            <Link key={n.href} href={n.href} onClick={() => setMoreOpen(false)} className="flex items-center gap-3 border-2 border-dashed border-line px-3 py-2 text-sm uppercase">
              <PixelIcon name={n.icon} />
              {n.label}
            </Link>
          ))}
          <div className="mt-2 flex gap-2">
            <ThemeToggle />
            <button onClick={signOut} className="border-2 border-dashed border-line px-2 py-1 text-xs uppercase text-muted">
              Sign out
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

/** Minimal header for signed-out visitors looking at a public page (e.g. someone's profile). */
export function PublicShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between border-b-2 border-dashed border-line px-4 py-3 md:px-10">
        <Link href="/" aria-label="DevCircle home">
          <Logo />
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <PixelButton href="/" variant="primary">
            Join
          </PixelButton>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-8">{children}</main>
    </div>
  );
}
