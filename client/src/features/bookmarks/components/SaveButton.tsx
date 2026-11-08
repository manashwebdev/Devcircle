'use client';

import { useEffect, useState } from 'react';
import type { PostSlotProps } from '@/core/types';
import { PixelButton, PixelIcon, useToast } from '@/core/ui';
import { getSaved, toggleSaved } from '../api';

/** Slot widget for the post page: save / unsave. */
export default function SaveButton({ postId }: PostSlotProps) {
  const toast = useToast();
  const [saved, setSaved] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const ctrl = new AbortController();
    getSaved(postId, ctrl.signal)
      .then((r) => setSaved(r.saved))
      .catch(() => undefined);
    return () => ctrl.abort();
  }, [postId]);

  if (saved === null) return null;

  const press = async () => {
    setBusy(true);
    try {
      const r = await toggleSaved(postId);
      setSaved(r.saved);
      toast(r.saved ? 'Saved for later' : 'Removed from Saved', 'success');
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Could not save', 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <PixelButton variant={saved ? 'primary' : 'ghost'} onClick={() => void press()} disabled={busy} aria-pressed={saved}>
      <PixelIcon name="bookmark" size={16} />
      {saved ? 'Saved' : 'Save'}
    </PixelButton>
  );
}
