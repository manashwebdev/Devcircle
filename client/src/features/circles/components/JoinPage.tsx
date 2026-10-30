'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { RouteProps } from '@/core/types';
import { EmptyState, Mascot, PixelButton, PixelCard, useToast } from '@/core/ui';
import { joinCircle, previewInvite } from '../api';
import type { InvitePreview } from '../types';

/** /circles/join/:code */
export default function JoinPage({ params }: RouteProps) {
  const code = params.code ?? '';
  const router = useRouter();
  const toast = useToast();
  const [invite, setInvite] = useState<InvitePreview | null>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'invalid'>('loading');
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    const ctrl = new AbortController();
    previewInvite(code, ctrl.signal)
      .then((i) => {
        setInvite(i);
        setState('ready');
      })
      .catch(() => !ctrl.signal.aborted && setState('invalid'));
    return () => ctrl.abort();
  }, [code]);

  if (state === 'loading') return <Mascot mood="typing" size={64} label="Loading invite" />;
  if (state === 'invalid' || !invite) {
    return <EmptyState title="Invalid invite link" description="The link may be wrong or the circle no longer exists." action={<PixelButton href="/circles">My circles</PixelButton>} />;
  }

  const join = async () => {
    setJoining(true);
    try {
      const circle = await joinCircle(code);
      toast(`Welcome to ${circle.name}`, 'success');
      router.replace(`/circles/${circle.id}`);
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Could not join', 'error');
      setJoining(false);
    }
  };

  return (
    <div className="mx-auto max-w-md">
      <PixelCard title={`Join "${invite.name}"`}>
        <div className="mb-4 flex justify-center"><Mascot mood={invite.full ? 'sleeping' : 'celebrating'} size={96} /></div>
        <p className="mb-2 text-sm">{invite.description || 'A small circle of developers.'}</p>
        <p className="mb-4 text-xs text-muted">{invite.memberCount} of {invite.maxMembers} seats taken</p>
        {invite.full ? (
          <p className="text-sm text-accent-strong">This circle is full right now.</p>
        ) : (
          <PixelButton onClick={() => void join()} disabled={joining}>{joining ? 'Joining...' : 'Join circle'}</PixelButton>
        )}
      </PixelCard>
    </div>
  );
}