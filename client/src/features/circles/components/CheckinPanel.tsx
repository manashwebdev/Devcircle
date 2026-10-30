'use client';

import Link from 'next/link';
import { useEffect, useState, type FormEvent } from 'react';
import { ApiError } from '@/core/api';
import { Field, Mascot, PixelAvatar, PixelButton, PixelCard, PixelInput, PixelTextarea, useToast } from '@/core/ui';
import { listCheckins, postCheckin } from '../api';
import type { CheckinList } from '../types';

const time = (iso: string) => new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

/** Today's proof of work for one circle: the form, who has checked in, and who is still missing. */
export function CheckinPanel({ circleId }: { circleId: string }) {
  const toast = useToast();
  const [data, setData] = useState<CheckinList | null>(null);
  const [text, setText] = useState('');
  const [link, setLink] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const ctrl = new AbortController();
    listCheckins(circleId, ctrl.signal)
      .then(setData)
      .catch(() => !ctrl.signal.aborted && toast('Could not load check-ins', 'error'));
    return () => ctrl.abort();
  }, [circleId, toast]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    try {
      setData(await postCheckin(circleId, { text, link: link.trim() || undefined }));
      setText('');
      setLink('');
      toast('Checked in. Nice work.', 'success');
    } catch (err) {
      if (err instanceof ApiError && err.code === 'VALIDATION_ERROR' && err.details && typeof err.details === 'object') {
        setErrors(Object.fromEntries(Object.entries(err.details as Record<string, string[]>).map(([k, v]) => [k, v[0] ?? 'Invalid'])));
      }
      toast(err instanceof Error ? err.message : 'Could not check in', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (!data) return <Mascot mood="typing" size={48} label="Loading check-ins" />;

  return (
    <PixelCard title="Today's check-ins" tag={data.day}>
      {data.isMember && !data.checkedIn && (
        <form onSubmit={submit} noValidate className="mb-5 border-b-2 border-dashed border-line pb-4">
          <Field label="What did you do today? (proof of work)" htmlFor="ck-text" hint={`${text.length}/280`} error={errors.text}>
            <PixelTextarea id="ck-text" className="min-h-20" value={text} maxLength={280} onChange={(e) => setText(e.target.value)} placeholder="Fixed the login bug, shipped the settings page..." />
          </Field>
          <Field label="Link (optional)" htmlFor="ck-link" error={errors.link}>
            <PixelInput id="ck-link" value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://github.com/you/repo/commit/..." />
          </Field>
          <PixelButton type="submit" disabled={saving}>{saving ? 'Checking in...' : 'Check in'}</PixelButton>
        </form>
      )}

      {data.isMember && data.checkedIn && (
        <p className="mb-4 flex items-center gap-3 text-sm text-accent-strong">
          <Mascot mood="celebrating" size={40} /> You are checked in for today.
        </p>
      )}

      {data.items.length === 0 ? (
        <p className="text-sm text-muted">Nobody has checked in yet today.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {data.items.map((c) => (
            <li key={c.id} className="flex gap-3 border-2 border-dashed border-line p-3">
              <PixelAvatar character={c.author.character} size={40} />
              <div className="min-w-0 flex-1 text-sm">
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
                  <Link href={`/u/${c.author.username}`} className="font-display text-base text-ink hover:text-accent-strong">{c.author.displayName}</Link>
                  <span>{time(c.createdAt)}</span>
                </div>
                <p className="mt-1 break-words">{c.text}</p>
                {c.link && (
                  <a href={c.link} target="_blank" rel="noopener noreferrer nofollow" className="mt-1 inline-block text-xs underline decoration-dashed underline-offset-4 hover:text-accent-strong">
                    View proof
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {data.pending.length > 0 && (
        <div className="mt-5 border-t-2 border-dashed border-line pt-4">
          <p className="mb-2 text-xs uppercase text-muted">Still waiting on</p>
          <ul className="flex flex-wrap gap-3">
            {data.pending.map((p) => (
              <li key={p.id} className="flex items-center gap-2 text-xs">
                <PixelAvatar character={p.character} mood="sleeping" size={32} />@{p.username}
              </li>
            ))}
          </ul>
        </div>
      )}
    </PixelCard>
  );
}