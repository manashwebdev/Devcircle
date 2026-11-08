'use client';

import { useEffect, useState } from 'react';
import { PixelButton, useToast } from '@/core/ui';
import { getFollowing, toggleFollow } from '../api';

/** Slot widget for the profile page. Hidden on your own profile. Shows no follower counts, by design. */
export default function FollowButton({ username, isMe }: { username: string; isMe: boolean }) {
  const toast = useToast();
  const [following, setFollowing] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (isMe) return;
    const ctrl = new AbortController();
    getFollowing(username, ctrl.signal)
      .then((r) => setFollowing(r.following))
      .catch(() => undefined);
    return () => ctrl.abort();
  }, [username, isMe]);

  if (isMe || following === null) return null;

  const press = async () => {
    setBusy(true);
    try {
      const r = await toggleFollow(username);
      setFollowing(r.following);
      toast(r.following ? `Following @${username}` : `Unfollowed @${username}`, 'success');
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Could not update', 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <PixelButton variant={following ? 'ghost' : 'primary'} onClick={() => void press()} disabled={busy} aria-pressed={following}>
        {following ? 'Following' : 'Follow'}
      </PixelButton>
    </div>
  );
}
