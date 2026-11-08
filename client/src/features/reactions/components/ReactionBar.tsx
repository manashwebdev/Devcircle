'use client';

import { useEffect, useState } from 'react';
import type { PostSlotProps } from '@/core/types';
import { cn, useToast } from '@/core/ui';
import { getReactions, toggleReaction } from '../api';
import { REACTION_INFO, type ReactionKind, type ReactionState } from '../types';

/** Slot widget for the post page. No public counts: only the post's author sees totals. */
export default function ReactionBar({ postId }: PostSlotProps) {
  const toast = useToast();
  const [state, setState] = useState<ReactionState | null>(null);
  const [busy, setBusy] = useState<ReactionKind | null>(null);

  useEffect(() => {
    const ctrl = new AbortController();
    getReactions(postId, ctrl.signal)
      .then(setState)
      .catch(() => undefined); // a widget must never break the page it sits on
    return () => ctrl.abort();
  }, [postId]);

  if (!state) return null;

  const press = async (kind: ReactionKind) => {
    if (busy) return;
    setBusy(kind);
    try {
      setState(await toggleReaction(postId, kind));
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Could not react', 'error');
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Reactions">
      {state.kinds.map((k) => {
        const on = state.mine.includes(k);
        return (
          <button
            key={k}
            type="button"
            aria-pressed={on}
            title={REACTION_INFO[k].hint}
            disabled={busy !== null}
            onClick={() => void press(k)}
            className={cn(
              'border-2 border-dashed px-3 py-1 text-xs uppercase transition-transform duration-75 hover:-translate-y-px disabled:opacity-60',
              on ? 'border-accent-strong bg-accent text-on-accent' : 'border-line text-muted hover:text-ink',
            )}
          >
            {REACTION_INFO[k].label}
            {state.counts && <span className="ml-1.5 opacity-80">{state.counts[k]}</span>}
          </button>
        );
      })}
      {state.isAuthor && <span className="text-xs text-muted">Only you can see these totals.</span>}
    </div>
  );
}
