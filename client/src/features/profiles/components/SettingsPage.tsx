'use client';

import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { ApiError } from '@/core/api';
import { useApp } from '@/core/auth/AppContext';
import { useTheme } from '@/core/theme/ThemeProvider';
import type { CharacterId, SessionUser } from '@/core/types';
import { CHARACTERS, Field, PixelAvatar, PixelButton, PixelCard, PixelInput, PixelTextarea, Tabs, useToast, cn } from '@/core/ui';
import { updateProfile } from '../api';

const MAX_LINKS = 5;

function ProfileForm({ user, onSaved }: { user: SessionUser; onSaved: () => Promise<void> }) {
  const toast = useToast();
  const router = useRouter();
  const [displayName, setDisplayName] = useState(user.displayName);
  const [username, setUsername] = useState(user.username);
  const [bio, setBio] = useState(user.bio);
  const [character, setCharacter] = useState<CharacterId>(user.character);
  const [stack, setStack] = useState(user.techStack.join(', '));
  const [links, setLinks] = useState(user.links);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    try {
      const saved = await updateProfile({
        displayName,
        username,
        bio,
        character,
        techStack: stack.split(',').map((t) => t.trim()).filter(Boolean),
        links: links.filter((l) => l.label.trim() && l.url.trim()),
      });
      await onSaved();
      toast('Saved', 'success');
      if (saved.username !== user.username) router.replace('/settings');
    } catch (err) {
      if (err instanceof ApiError && err.code === 'VALIDATION_ERROR' && err.details && typeof err.details === 'object') {
        // The server returns { field: [messages] }; show the first message under each field.
        setErrors(Object.fromEntries(Object.entries(err.details as Record<string, string[]>).map(([k, v]) => [k, v[0] ?? 'Invalid'])));
      }
      toast(err instanceof Error ? err.message : 'Could not save', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} noValidate>
      <fieldset className="mb-4">
        <legend className="mb-2 text-sm text-accent-strong">Pixel character</legend>
        <div className="flex flex-wrap gap-3">
          {CHARACTERS.map((c) => (
            <button key={c} type="button" onClick={() => setCharacter(c)} aria-pressed={character === c} aria-label={c} className={cn('p-1 border-2', character === c ? 'border-accent-strong bg-surface-2' : 'border-transparent')}>
              <PixelAvatar character={c} size={56} animate={character === c} mood={character === c ? 'celebrating' : 'idle'} />
            </button>
          ))}
        </div>
      </fieldset>

      <Field label="Display name" htmlFor="displayName" error={errors.displayName}>
        <PixelInput id="displayName" value={displayName} maxLength={50} onChange={(e) => setDisplayName(e.target.value)} />
      </Field>
      <Field label="Username" htmlFor="username" hint="3-24 characters: a-z, 0-9, - and _" error={errors.username}>
        <PixelInput id="username" value={username} maxLength={24} onChange={(e) => setUsername(e.target.value.toLowerCase())} />
      </Field>
      <Field label="Bio" htmlFor="bio" hint={`${bio.length}/280`} error={errors.bio}>
        <PixelTextarea id="bio" value={bio} maxLength={280} onChange={(e) => setBio(e.target.value)} />
      </Field>
      <Field label="Tech stack" htmlFor="stack" hint="Comma separated, up to 12. e.g. typescript, next.js, mongodb" error={errors.techStack}>
        <PixelInput id="stack" value={stack} onChange={(e) => setStack(e.target.value)} />
      </Field>

      <div className="mb-4">
        <p className="mb-1 text-sm text-accent-strong">Links</p>
        {links.map((l, i) => (
          <div key={i} className="mb-2 flex gap-2">
            <PixelInput aria-label={`Link ${i + 1} label`} placeholder="GitHub" className="w-28" value={l.label} maxLength={24} onChange={(e) => setLinks(links.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))} />
            <PixelInput aria-label={`Link ${i + 1} URL`} placeholder="https://github.com/you" value={l.url} onChange={(e) => setLinks(links.map((x, j) => (j === i ? { ...x, url: e.target.value } : x)))} />
            <button type="button" aria-label={`Remove link ${i + 1}`} onClick={() => setLinks(links.filter((_, j) => j !== i))} className="px-2 text-muted hover:text-ink">
              ×
            </button>
          </div>
        ))}
        {errors.links && <p className="text-xs text-accent-strong">{errors.links}</p>}
        {links.length < MAX_LINKS && (
          <PixelButton type="button" variant="ghost" onClick={() => setLinks([...links, { label: '', url: '' }])}>
            Add link
          </PixelButton>
        )}
      </div>

      <PixelButton type="submit" disabled={saving}>
        {saving ? 'Saving...' : 'Save changes'}
      </PixelButton>
    </form>
  );
}

/** /settings: edit profile, see appearance, sign out. */
export default function SettingsPage() {
  const { user, refresh, logout } = useApp();
  const { theme, toggle } = useTheme();
  const router = useRouter();
  if (!user) return null;

  return (
    <div>
      <h1 className="mb-6 font-display text-4xl">Settings</h1>
      <Tabs
        items={[
          { id: 'profile', label: 'Profile', content: <ProfileForm user={user} onSaved={refresh} /> },
          {
            id: 'appearance',
            label: 'Appearance',
            content: (
              <PixelCard title="Theme">
                <p className="mb-3 text-sm text-muted">Now using {theme} mode. Your choice is remembered on this device.</p>
                <PixelButton variant="ghost" onClick={toggle}>
                  Switch to {theme === 'dark' ? 'light' : 'dark'}
                </PixelButton>
              </PixelCard>
            ),
          },
          {
            id: 'account',
            label: 'Account',
            content: (
              <PixelCard title="Session">
                <p className="mb-3 text-sm text-muted">Signed in with GitHub as @{user.username}.</p>
                <PixelButton
                  variant="outline"
                  onClick={async () => {
                    await logout();
                    router.replace('/');
                  }}
                >
                  Sign out
                </PixelButton>
              </PixelCard>
            ),
          },
        ]}
      />
    </div>
  );
}
