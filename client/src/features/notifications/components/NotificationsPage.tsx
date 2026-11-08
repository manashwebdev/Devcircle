'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { timeAgo } from '@/core/time';
import { cn, EmptyState, Mascot, PixelAvatar, PixelButton } from '@/core/ui';
import { listNotifications, markAllRead, markRead } from '../api';
import { KIND_TEXT, NOTIFICATIONS_CHANGED, type NotificationItem } from '../types';

const ping = () => window.dispatchEvent(new Event(NOTIFICATIONS_CHANGED));

/** /notifications */
export default function NotificationsPage() {
  const [items, setItems] = useState<NotificationItem[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const ctrl = new AbortController();
    listNotifications(ctrl.signal)
      .then((r) => setItems(r.items))
      .catch(() => !ctrl.signal.aborted && setError(true));
    return () => ctrl.abort();
  }, []);

  const readAll = useCallback(async () => {
    await markAllRead().catch(() => undefined);
    setItems((prev) => prev?.map((n) => ({ ...n, read: true })) ?? prev);
    ping();
  }, []);

  const open = (n: NotificationItem) => {
    if (n.read) return;
    setItems((prev) => prev?.map((x) => (x.id === n.id ? { ...x, read: true } : x)) ?? prev);
    void markRead(n.id).then(ping).catch(() => undefined);
  };

  const hasUnread = items?.some((n) => !n.read) ?? false;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="font-display text-4xl">Alerts</h1>
        {hasUnread && (
          <PixelButton variant="ghost" onClick={() => void readAll()}>
            Mark all read
          </PixelButton>
        )}
      </div>
      {error && <EmptyState title="Couldn't load alerts" mood="sleeping" />}
      {!error && items === null && <Mascot mood="typing" size={64} label="Loading" />}
      {items?.length === 0 && <EmptyState title="All quiet" description="Comments, replies, mentions and reactions will show up here." />}
      <ul className="space-y-3">
        {items?.map((n) => (
          <li key={n.id}>
            <Link
              href={n.postId ? `/post/${n.postId}` : `/u/${n.actor?.username ?? ''}`}
              onClick={() => open(n)}
              className={cn('flex gap-3 border-2 p-3 hover:border-ink', n.read ? 'border-dashed border-line' : 'border-accent-strong bg-surface')}
            >
              {n.actor ? <PixelAvatar character={n.actor.character} size={36} /> : <div className="size-9 shrink-0" />}
              <div className="min-w-0 text-sm">
                <p>
                  <span className="font-display">@{n.actor?.username ?? 'someone'}</span> {KIND_TEXT[n.kind]}
                  {n.kind !== 'comment' && n.kind !== 'reaction' && n.kind !== 'follow' && <span className="font-display"> {n.postTitle}</span>}
                </p>
                {n.kind === 'comment' || n.kind === 'reaction' ? <p className="truncate font-display">{n.postTitle}</p> : null}
                {n.snippet && n.kind !== 'reaction' && <p className="mt-1 line-clamp-2 text-muted">“{n.snippet}”</p>}
                <p className="mt-1 text-xs text-muted">{timeAgo(n.createdAt)}</p>
              </div>
              {!n.read && <span className="ml-auto mt-1 size-2 shrink-0 bg-accent-strong" aria-label="Unread" />}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
