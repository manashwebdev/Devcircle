'use client';

import { useEffect, useState } from 'react';
import type { PostSlotProps } from '@/core/types';
import { PixelButton, useToast } from '@/core/ui';
import { getAiStatus, summarise } from '../api';

/** Slot widget for the post page: a "TL;DR (AI)" button that turns into 3 bullets. Hidden when the server has no AI key. */
export default function TldrCard({ postId }: PostSlotProps) {
  const toast = useToast();
  const [enabled, setEnabled] = useState(false);
  const [bullets, setBullets] = useState<string[] | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const ctrl = new AbortController();
    getAiStatus(ctrl.signal)
      .then((r) => setEnabled(r.enabled))
      .catch(() => undefined);
    return () => ctrl.abort();
  }, []);

  if (!enabled) return null;

  const run = async () => {
    setBusy(true);
    try {
      setBullets((await summarise(postId)).bullets);
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Could not summarise', 'error');
    } finally {
      setBusy(false);
    }
  };

  if (!bullets) {
    return (
      <div className="mb-4">
        <PixelButton variant="outline" onClick={() => void run()} disabled={busy}>
          {busy ? 'Summarising…' : 'TL;DR (AI)'}
        </PixelButton>
      </div>
    );
  }
  return (
    <div className="mb-4 border-2 border-dashed border-accent-strong p-3">
      <p className="mb-2 text-xs uppercase text-accent-strong">TL;DR · written by AI, check the post for details</p>
      <ul className="list-disc space-y-1 pl-5 text-sm">
        {bullets.map((b, i) => (
          <li key={i}>{b}</li>
        ))}
      </ul>
    </div>
  );
}
