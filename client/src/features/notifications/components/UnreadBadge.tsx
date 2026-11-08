'use client';

import { useEffect, useState } from 'react';
import { getUnreadCount } from '../api';
import { NOTIFICATIONS_CHANGED } from '../types';

/** The little number next to "Alerts". Polls once a minute, and refreshes when you return to the tab or read something. */
export function UnreadBadge() {
  const [n, setN] = useState(0);

  useEffect(() => {
    let alive = true;
    const load = () => {
      if (document.hidden) return;
      getUnreadCount()
        .then((r) => alive && setN(r.unread))
        .catch(() => undefined);
    };
    load();
    const timer = setInterval(load, 60_000);
    window.addEventListener('focus', load);
    window.addEventListener(NOTIFICATIONS_CHANGED, load);
    return () => {
      alive = false;
      clearInterval(timer);
      window.removeEventListener('focus', load);
      window.removeEventListener(NOTIFICATIONS_CHANGED, load);
    };
  }, []);

  if (n <= 0) return null;
  return (
    <span aria-label={`${n} unread`} className="ml-auto min-w-5 bg-accent px-1 text-center text-[10px] text-on-accent md:ml-auto">
      {n > 99 ? '99+' : n}
    </span>
  );
}
