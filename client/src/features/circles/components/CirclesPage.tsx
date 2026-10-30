'use client';

import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { ApiError } from '@/core/api';
import { EmptyState, Field, Mascot, Modal, PixelButton, PixelInput, PixelTextarea, Tabs, useToast, cn } from '@/core/ui';
import { createCircle } from '../api';
import { useCircleList } from '../hooks/useCircleList';
import type { Visibility } from '../types';
import { CircleCard } from './CircleCard';

function CircleGrid({ scope, onCreate }: { scope: 'mine' | 'public'; onCreate: () => void }) {
  const { items, loading, error } = useCircleList(scope);

  if (loading) return <Mascot mood="typing" size={64} label="Loading circles" />;
  if (error) return <EmptyState title="Couldn't load circles" description={error} mood="sleeping" />;
  if (items.length === 0) {
    return scope === 'mine' ? (
      <EmptyState title="No circles yet" description="Start one and send the invite link to 4 to 7 friends, or open an invite link someone sent you." mood="idle" action={<PixelButton onClick={onCreate}>Create a circle</PixelButton>} />
    ) : (
      <EmptyState title="No public circles yet" description="Owners can make their circle public so other developers can see it." mood="sleeping" />
    );
  }
  return (
    <div className="flex flex-col gap-6">
      {items.map((c) => (
        <CircleCard key={c.id} circle={c} />
      ))}
    </div>
  );
}

/** The "create circle" form, shown in a dialog. */
function CreateForm({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const toast = useToast();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState<Visibility>('private');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    try {
      const circle = await createCircle({ name, description, visibility });
      toast('Circle created', 'success');
      onClose();
      router.push(`/circles/${circle.id}`);
    } catch (err) {
      // The server sends { fieldName: [messages] } for validation problems.
      if (err instanceof ApiError && err.code === 'VALIDATION_ERROR' && err.details && typeof err.details === 'object') {
        setErrors(Object.fromEntries(Object.entries(err.details as Record<string, string[]>).map(([k, v]) => [k, v[0] ?? 'Invalid'])));
      }
      toast(err instanceof Error ? err.message : 'Could not create the circle', 'error');
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} noValidate>
      <Field label="Name" htmlFor="c-name" hint="3 to 40 characters" error={errors.name}>
        <PixelInput id="c-name" value={name} maxLength={40} onChange={(e) => setName(e.target.value)} placeholder="Night Shift" />
      </Field>
      <Field label="Description (optional)" htmlFor="c-desc" error={errors.description}>
        <PixelTextarea id="c-desc" className="min-h-20" value={description} maxLength={200} onChange={(e) => setDescription(e.target.value)} />
      </Field>

      <fieldset className="mb-4">
        <legend className="mb-2 text-sm text-accent-strong">Who can see it?</legend>
        <div className="grid grid-cols-2 gap-2">
          {(['private', 'public'] as const).map((v) => (
            <button key={v} type="button" aria-pressed={visibility === v} onClick={() => setVisibility(v)}
              className={cn('border-2 border-dashed p-2 text-left text-sm', visibility === v ? 'border-accent-strong bg-accent text-on-accent' : 'border-line hover:border-ink')}>
              <span className="block font-display text-lg capitalize">{v}</span>
              <span className="text-xs opacity-80">{v === 'private' ? 'Members only' : 'Any signed-in developer can view'}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <PixelButton type="submit" disabled={saving}>
        {saving ? 'Creating...' : 'Create circle'}
      </PixelButton>
    </form>
  );
}

/** /circles */
export default function CirclesPage() {
  const [creating, setCreating] = useState(false);
  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="font-display text-4xl">Circles</h1>
        <PixelButton onClick={() => setCreating(true)}>New circle</PixelButton>
      </div>
      <Tabs
        items={[
          { id: 'mine', label: 'My circles', content: <CircleGrid scope="mine" onCreate={() => setCreating(true)} /> },
          { id: 'public', label: 'Browse public', content: <CircleGrid scope="public" onCreate={() => setCreating(true)} /> },
        ]}
      />
      <Modal open={creating} onClose={() => setCreating(false)} title="New circle">
        <CreateForm onClose={() => setCreating(false)} />
      </Modal>
    </div>
  );
}