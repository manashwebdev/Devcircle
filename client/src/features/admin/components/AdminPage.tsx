'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { useApp } from '@/core/auth/AppContext';
import { timeAgo } from '@/core/time';
import { EmptyState, PixelAvatar, PixelButton, PixelCard, PixelInput, Tabs, useToast } from '@/core/ui';
import { getStats, listPosts, listUsers, setBanned, setHidden } from '../api';
import type { AdminPost, AdminStats, AdminUser } from '../types';

const show = (n: number | null) => (n === null ? 'off' : String(n));

function Overview() {
  const [s, setS] = useState<AdminStats | null>(null);
  useEffect(() => {
    const ctrl = new AbortController();
    getStats(ctrl.signal).then(setS).catch(() => undefined);
    return () => ctrl.abort();
  }, []);
  if (!s) return <p className="text-sm text-muted">Loading…</p>;
  const cards: [string, string][] = [
    ['Developers', show(s.users)],
    ['New this week', show(s.newUsers)],
    ['Banned', show(s.banned)],
    ['Posts', show(s.posts)],
    ['Posts this week', show(s.newPosts)],
    ['Hidden posts', show(s.hiddenPosts)],
    ['Comments', show(s.comments)],
  ];
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {cards.map(([label, value]) => (
        <PixelCard key={label}>
          <div className="font-display text-3xl text-accent-strong">{value}</div>
          <div className="text-xs uppercase text-muted">{label}</div>
        </PixelCard>
      ))}
    </div>
  );
}

function Users() {
  const toast = useToast();
  const [q, setQ] = useState('');
  const [items, setItems] = useState<AdminUser[] | null>(null);

  useEffect(() => {
    const ctrl = new AbortController();
    const timer = setTimeout(() => {
      listUsers(q.trim(), ctrl.signal)
        .then((r) => setItems(r.items))
        .catch(() => undefined);
    }, 250);
    return () => {
      clearTimeout(timer);
      ctrl.abort();
    };
  }, [q]);

  const toggle = async (u: AdminUser) => {
    try {
      await setBanned(u.id, !u.banned);
      setItems((prev) => prev?.map((x) => (x.id === u.id ? { ...x, banned: !u.banned } : x)) ?? prev);
      toast(u.banned ? `Unbanned @${u.username}` : `Banned @${u.username} and signed them out`, 'success');
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Failed', 'error');
    }
  };

  return (
    <div>
      <PixelInput value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search username or name" aria-label="Search users" maxLength={40} />
      <ul className="mt-4 space-y-2">
        {items?.map((u) => (
          <li key={u.id} className="flex items-center gap-3 border-2 border-dashed border-line p-2">
            <PixelAvatar character={u.character} size={36} />
            <div className="min-w-0 flex-1 text-sm">
              <Link href={`/u/${u.username}`} className="font-display hover:text-accent-strong">
                {u.displayName} <span className="text-xs text-muted">@{u.username}</span>
              </Link>
              <div className="text-xs text-muted">
                joined {timeAgo(u.createdAt)}
                {u.role === 'admin' && ' · admin'}
                {u.banned && ' · banned'}
              </div>
            </div>
            {u.role !== 'admin' && (
              <PixelButton variant={u.banned ? 'ghost' : 'outline'} onClick={() => void toggle(u)}>
                {u.banned ? 'Unban' : 'Ban'}
              </PixelButton>
            )}
          </li>
        ))}
        {items?.length === 0 && <p className="text-sm text-muted">No users match.</p>}
      </ul>
    </div>
  );
}

function Posts() {
  const toast = useToast();
  const [items, setItems] = useState<AdminPost[] | null>(null);
  useEffect(() => {
    const ctrl = new AbortController();
    listPosts(ctrl.signal).then((r) => setItems(r.items)).catch(() => undefined);
    return () => ctrl.abort();
  }, []);

  const toggle = useCallback(
    async (p: AdminPost) => {
      try {
        await setHidden(p.id, !p.hidden);
        setItems((prev) => prev?.map((x) => (x.id === p.id ? { ...x, hidden: !p.hidden } : x)) ?? prev);
        toast(p.hidden ? 'Post restored' : 'Post hidden everywhere', 'success');
      } catch (e) {
        toast(e instanceof Error ? e.message : 'Failed', 'error');
      }
    },
    [toast],
  );

  return (
    <ul className="space-y-2">
      {items?.map((p) => (
        <li key={p.id} className="flex items-center gap-3 border-2 border-dashed border-line p-2">
          <div className="min-w-0 flex-1 text-sm">
            <Link href={`/post/${p.id}`} className={p.hidden ? 'text-muted line-through' : 'font-display hover:text-accent-strong'}>
              {p.title}
            </Link>
            <div className="text-xs text-muted">
              {p.type} · @{p.author ?? 'deleted'} · {timeAgo(p.createdAt)}
              {p.hidden && ' · hidden'}
            </div>
          </div>
          <PixelButton variant={p.hidden ? 'ghost' : 'outline'} onClick={() => void toggle(p)}>
            {p.hidden ? 'Restore' : 'Hide'}
          </PixelButton>
        </li>
      ))}
      {items?.length === 0 && <p className="text-sm text-muted">No posts.</p>}
    </ul>
  );
}

/** /admin. Admins only (the server enforces it; this just shows a friendly message to everyone else). */
export default function AdminPage() {
  const { user } = useApp();
  if (user?.role !== 'admin') return <EmptyState title="Admins only" description="You do not have access to this page." action={<PixelButton href="/feed">Back to feed</PixelButton>} />;
  return (
    <div>
      <h1 className="mb-6 font-display text-4xl">Admin</h1>
      <Tabs
        items={[
          { id: 'overview', label: 'Overview', content: <Overview /> },
          { id: 'users', label: 'Users', content: <Users /> },
          { id: 'posts', label: 'Posts', content: <Posts /> },
        ]}
      />
    </div>
  );
}
