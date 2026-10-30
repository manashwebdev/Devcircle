'use client';

import { useApp } from '@/core/auth/AppContext';
import type { RouteProps } from '@/core/types';
import { EmptyState, Mascot, PixelAvatar, PixelButton, PixelCard, PixelIcon } from '@/core/ui';
import { Slot } from '@/core/features/Slot';
import { useProfile } from '../hooks/useProfile';

/** /u/:username. "me" is an alias for the signed-in user. */
export default function ProfilePage({ params }: RouteProps) {
  const { user, isEnabled } = useApp();
  const username = params.username === 'me' && user ? user.username : (params.username ?? '');
  const { profile, loading, notFound, error } = useProfile(username);

  if (loading) return <Mascot mood="typing" size={64} label="Loading profile" />;
  if (notFound) return <EmptyState title="No developer here" description={`Nobody is called @${username} yet.`} mood="sleeping" />;
  if (error || !profile) return <EmptyState title="Couldn't load this profile" description={error ?? undefined} />;

  const isMe = user?.id === profile.id;
  // A 7+ day streak earns a celebration; a zero streak means the character is asleep.
  const mood = profile.streak.current >= 7 ? 'celebrating' : profile.streak.current === 0 ? 'sleeping' : 'idle';

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <PixelAvatar character={profile.character} mood={mood} size={112} animate label={`${profile.displayName}'s pixel character`} />
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-4xl leading-tight">{profile.displayName}</h1>
          <p className="text-muted">@{profile.username}</p>
          <p className="mt-2 flex items-center gap-2 text-sm text-accent-strong">
            <PixelIcon name="flame" /> {profile.streak.current}-day streak <span className="text-muted">(best {profile.streak.longest})</span>
          </p>
        </div>
        {isMe && <PixelButton href="/settings" variant="outline">Edit profile</PixelButton>}
      </header>

      <PixelCard title="About">
        <p className="text-sm">{profile.bio || (isMe ? 'Add a one-line bio in settings.' : 'No bio yet.')}</p>
      </PixelCard>

      <div className="grid gap-6 sm:grid-cols-2">
        <PixelCard title="Tech stack">
          {profile.techStack.length === 0 ? (
            <p className="text-sm text-muted">Nothing listed yet.</p>
          ) : (
            <ul className="flex flex-wrap gap-2">
              {profile.techStack.map((t) => (
                <li key={t} className="border-2 border-dashed border-line px-2 py-0.5 text-xs hover:border-accent-strong hover:bg-accent hover:text-on-accent">
                  {t}
                </li>
              ))}
            </ul>
          )}
        </PixelCard>
        <PixelCard title="Find them on">
          {profile.links.length === 0 ? (
            <p className="text-sm text-muted">No links yet.</p>
          ) : (
            <ul className="flex flex-col gap-2 text-sm">
              {profile.links.map((l) => (
                // rel=noopener noreferrer: the opened site gets no handle back to this tab.
                <li key={l.url}>
                  <a href={l.url} target="_blank" rel="noopener noreferrer nofollow" className="underline decoration-dashed underline-offset-4 hover:text-accent-strong">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </PixelCard>
      </div>
      <Slot name="profile" username={profile.username} isMe={isMe} />
      {!isEnabled('posts') && (
        <EmptyState title="No posts yet" description="Built, Broke and Learned posts will show up here once the posts module is switched on." mood="idle" />
      )}
    </div>
  );
}
