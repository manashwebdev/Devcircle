'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { apiUrl } from '@/core/api';
import { useApp } from '@/core/auth/AppContext';
import { ThemeToggle } from '@/core/layout/ThemeToggle';
import { Logo, Mascot, MOODS, PixelButton, PixelCard, Skyline, type Mood } from '@/core/ui';

const BUBBLES: Record<Mood, string> = {
  idle: 'gm. what are you building?',
  typing: 'writing today\u2019s proof of work...',
  celebrating: 'day 7! the circle streak lives.',
  sleeping: 'zzz... back tomorrow.',
};

const HIGHLIGHTS = [
  { tag: 'B', title: 'Built, Broke, Learned', body: 'Three post types. Share the thing you shipped, the thing that fell over, and what you took from it.' },
  { tag: '5-8', title: 'Small circles', body: 'A few developers who see your check-in every day. Small enough that someone notices when you go quiet.' },
  { tag: '0', title: 'No follower counts', body: 'No public likes and no leaderboard. Reactions are private: only the author sees them.' },
  { tag: '</>', title: 'Developers only', body: 'Sign in with GitHub. Your profile is a pixel character, your tech stack and what you are working on.' },
];

const STEPS = [
  ['Join or start a circle', 'Create one and send the invite link to 4 to 7 friends, or accept an invite.'],
  ['Check in once a day', 'Share proof of work: a commit, a screenshot, a bug you finally understood.'],
  ['Keep the streak alive', 'The circle streak grows when everyone checks in. Miss a day and your circle sees it.'],
  ['Read the weekly digest', 'One page that recaps what your circle built, broke and learned.'],
] as const;

/** Cycle the mascot through its moods. Stays on one mood if the visitor prefers reduced motion. */
function useMoodCycle() {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setInterval(() => setI((n) => (n + 1) % MOODS.length), 3200);
    return () => clearInterval(t);
  }, []);
  return MOODS[i] ?? 'idle';
}

export default function Landing() {
  const { status, user, isEnabled } = useApp();
  const mood = useMoodCycle();

  return (
    <div className="relative min-h-screen overflow-hidden">
      <Skyline className="pointer-events-none absolute inset-x-0 top-0 h-[70vh] w-full" />

      <header className="relative z-10 flex items-center justify-between border-b-2 border-dashed border-line px-4 py-4 md:px-10">
        <Logo />
        <ThemeToggle />
      </header>

      <main className="relative z-10">
        {/* Hero */}
        <section className="mx-auto grid max-w-5xl items-center gap-10 px-4 py-16 md:grid-cols-[1.3fr_1fr] md:px-10 md:py-24">
          <div>
            <h1 className="font-display text-5xl font-bold leading-[1.05] sm:text-6xl">Build in public. Ship with a circle.</h1>
            <p className="mt-5 max-w-xl text-lg">Post what you built, broke and learned, then keep a small group of developers honest with a daily proof of work.</p>

            <div className="mt-8 flex flex-wrap gap-3">
              {user ? (
                <PixelButton href={isEnabled('posts') ? '/feed' : `/u/${user.username}`}>Open DevCircle</PixelButton>
              ) : (
                <>
                  <PixelButton href={apiUrl('/auth/github')} external>
                    Continue with GitHub
                  </PixelButton>
                  {/* Only offered when the google-auth module is on. */}
                  {status === 'ready' && isEnabled('google-auth') && (
                    <PixelButton href={apiUrl('/auth/google')} external variant="ghost">
                      Continue with Google
                    </PixelButton>
                  )}
                </>
              )}
            </div>
            {status === 'error' && <p className="mt-4 text-sm text-accent-strong">The server is not reachable right now, so sign-in may fail.</p>}
          </div>

          <div className="flex flex-col items-center gap-3">
            <p className="w-full max-w-[260px] border-2 border-dashed border-ink bg-ink px-3 py-2 text-center text-xs uppercase text-bg" aria-live="off">
              {BUBBLES[mood]}
            </p>
            {/* A small "stage" so the character sits on something, in both themes. */}
            <div className="border-2 border-dashed border-line bg-surface p-6 shadow-pixel">
              <Mascot character="ember" mood={mood} size={200} label={`DevCircle mascot, ${mood}`} />
              <div className="mx-auto mt-1 h-2 w-32 bg-ink/15" aria-hidden />
            </div>
          </div>
        </section>

        <div className="px-rule" />

        {/* Highlights */}
        <section aria-labelledby="highlights" className="mx-auto max-w-5xl px-4 py-16 md:px-10">
          <h2 id="highlights" className="mb-8 font-display text-3xl">What you get</h2>
          <ul className="grid gap-6 sm:grid-cols-2">
            {HIGHLIGHTS.map((h) => (
              <PixelCard as="li" key={h.title} tag={h.tag} title={h.title}>
                <p className="text-sm">{h.body}</p>
              </PixelCard>
            ))}
          </ul>
        </section>

        <div className="px-rule" />

        {/* How circles work: a real sequence, so numbered steps are honest here. */}
        <section aria-labelledby="how" className="mx-auto max-w-5xl px-4 py-16 md:px-10">
          <h2 id="how" className="mb-8 font-display text-3xl">How circles work</h2>
          <ol className="grid gap-6 md:grid-cols-4">
            {STEPS.map(([title, body], i) => (
              <li key={title} className="border-l-2 border-dashed border-accent pl-4">
                <span className="mb-2 inline-block bg-accent px-1.5 py-0.5 text-[10px] text-on-accent">STEP {i + 1}</span>
                <h3 className="font-display text-xl">{title}</h3>
                <p className="mt-1 text-sm text-muted">{body}</p>
              </li>
            ))}
          </ol>
        </section>
      </main>

      <footer className="relative z-10 border-t-2 border-dashed border-line px-4 py-8 text-sm text-muted md:px-10">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4">
          <Logo size={18} />
          <p>Made for developers who ship.</p>
          <Link href="/u/ada" className="underline decoration-dashed underline-offset-4 hover:text-ink">
            See a sample profile
          </Link>
        </div>
      </footer>
    </div>
  );
}
