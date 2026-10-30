'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '@/core/api';
import type { RouteProps } from '@/core/types';
import { EmptyState, Mascot, Modal, PixelAvatar, PixelButton, PixelCard, useToast } from '@/core/ui';
import { getCircle, kickMember, leaveCircle, setVisibility } from '../api';
import type { CircleDetail, CircleMember } from '../types';
import { CheckinPanel } from './CheckinPanel';
import { Slot } from '@/core/features/Slot';

/** /circles/:id */
export default function CirclePage({ params }: RouteProps) {
  const id = params.id ?? '';
  const router = useRouter();
  const toast = useToast();
  const [circle, setCircle] = useState<CircleDetail | null>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'missing' | 'error'>('loading');
  const [confirmLeave, setConfirmLeave] = useState(false);
  const [kickTarget, setKickTarget] = useState<CircleMember | null>(null);

  const load = useCallback(
    (signal?: AbortSignal) =>
      getCircle(id, signal)
        .then((c) => {
          setCircle(c);
          setState('ready');
        })
        .catch((e: unknown) => {
          if (signal?.aborted) return;
          setState(e instanceof ApiError && (e.status === 404 || e.code === 'VALIDATION_ERROR') ? 'missing' : 'error');
        }),
    [id],
  );

  useEffect(() => {
    const ctrl = new AbortController();
    setState('loading');
    void load(ctrl.signal);
    return () => ctrl.abort();
  }, [load]);

  if (state === 'loading') return <Mascot mood="typing" size={64} label="Loading circle" />;
  if (state === 'missing') return <EmptyState title="Circle not found" description="It may be private, or it no longer exists." action={<PixelButton href="/circles">Back to circles</PixelButton>} />;
  if (state === 'error' || !circle) return <EmptyState title="Couldn't load this circle" mood="sleeping" />;

  const inviteUrl = circle.inviteCode ? `${window.location.origin}/circles/join/${circle.inviteCode}` : '';
  const openSeats = Math.max(0, circle.maxMembers - circle.members.length);

  const copyInvite = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      toast('Invite link copied', 'success');
    } catch {
      toast('Could not copy. Select the link and copy it by hand.', 'error');
    }
  };

  const toggleVisibility = async () => {
    try {
      setCircle(await setVisibility(circle.id, circle.visibility === 'public' ? 'private' : 'public'));
      toast('Visibility updated', 'success');
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Could not update', 'error');
    }
  };

  const leave = async () => {
    try {
      await leaveCircle(circle.id);
      toast('You left the circle', 'success');
      router.replace('/circles');
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Could not leave', 'error');
    }
  };

  const kick = async () => {
    if (!kickTarget) return;
    try {
      await kickMember(circle.id, kickTarget.id);
      toast(`Removed @${kickTarget.username}`, 'success');
      setKickTarget(null);
      await load();
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Could not remove', 'error');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Link href="/circles" className="text-sm text-muted hover:text-ink">← Circles</Link>

      <header>
        <h1 className="font-display text-4xl leading-tight">{circle.name}</h1>
        {circle.description && <p className="mt-1 text-muted">{circle.description}</p>}
        <div className="mt-3 flex flex-wrap gap-2 text-xs uppercase">
          <span className={`border-2 border-dashed px-2 py-0.5 ${circle.status === 'active' ? 'border-accent-strong text-accent-strong' : 'border-line text-muted'}`}>
            {circle.status === 'active' ? 'Active' : `Forming: needs ${circle.minMembers - circle.members.length} more`}
          </span>
          <span className="border-2 border-dashed border-line px-2 py-0.5 text-muted">{circle.visibility}</span>
          <span className="border-2 border-dashed border-line px-2 py-0.5 text-muted">{circle.members.length} / {circle.maxMembers} seats</span>
        </div>
      </header>
            <Slot name="circle" circleId={circle.id} isMember={circle.isMember} />
      <CheckinPanel circleId={circle.id} />
      <PixelCard title="Members">
        <ul className="grid gap-3 sm:grid-cols-2">
          {circle.members.map((m) => (
            <li key={m.id} className="flex items-center gap-3 border-2 border-dashed border-line p-2">
              <PixelAvatar character={m.character} size={48} />
              <div className="min-w-0 flex-1">
                <Link href={`/u/${m.username}`} className="block truncate font-display hover:text-accent-strong">{m.displayName}</Link>
                <span className="text-xs text-muted">@{m.username}{m.isOwner ? ' · owner' : ''}</span>
              </div>
              {circle.isOwner && !m.isOwner && (
                <button onClick={() => setKickTarget(m)} className="border-2 border-dashed border-line px-2 py-0.5 text-xs uppercase text-muted hover:border-accent-strong hover:text-accent-strong">
                  Remove
                </button>
              )}
            </li>
          ))}
          {/* Empty seats, so you can see how full the circle is. */}
          {Array.from({ length: openSeats }, (_, i) => (
            <li key={`seat-${i}`} className="flex h-[66px] items-center justify-center border-2 border-dashed border-line/50 text-xs uppercase text-muted">
              open seat
            </li>
          ))}
        </ul>
      </PixelCard>

      {circle.isMember ? (
        <>
          <PixelCard title="Invite link">
            <p className="mb-2 text-xs text-muted">Anyone signed in with this link can join while there are open seats.</p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input readOnly aria-label="Invite link" value={inviteUrl} onFocus={(e) => e.currentTarget.select()}
                className="w-full border-2 border-dashed border-line bg-surface px-3 py-2 text-xs" />
              <PixelButton variant="outline" onClick={() => void copyInvite()}>Copy</PixelButton>
            </div>
          </PixelCard>

          <div className="flex flex-wrap gap-3">
            {circle.isOwner && (
              <PixelButton variant="ghost" onClick={() => void toggleVisibility()}>
                Make {circle.visibility === 'public' ? 'private' : 'public'}
              </PixelButton>
            )}
            <PixelButton variant="outline" onClick={() => setConfirmLeave(true)}>Leave circle</PixelButton>
          </div>
        </>
      ) : (
        <p className="border-2 border-dashed border-line p-3 text-sm text-muted">
          You are viewing a public circle. To join, you need an invite link from one of its members.
        </p>
      )}

      <Modal open={confirmLeave} onClose={() => setConfirmLeave(false)} title="Leave this circle?">
        <p className="mb-4 text-sm text-muted">
          {circle.isOwner ? 'You are the owner. Ownership passes to the member who has been here longest.' : 'You can rejoin later with an invite link.'}
        </p>
        <div className="flex gap-2">
          <PixelButton onClick={() => void leave()}>Leave</PixelButton>
          <PixelButton variant="ghost" onClick={() => setConfirmLeave(false)}>Cancel</PixelButton>
        </div>
      </Modal>

      <Modal open={kickTarget !== null} onClose={() => setKickTarget(null)} title="Remove this member?">
        <p className="mb-4 text-sm text-muted">@{kickTarget?.username} will be removed and cannot rejoin with the invite link.</p>
        <div className="flex gap-2">
          <PixelButton onClick={() => void kick()}>Remove</PixelButton>
          <PixelButton variant="ghost" onClick={() => setKickTarget(null)}>Cancel</PixelButton>
        </div>
      </Modal>
    </div>
  );
}