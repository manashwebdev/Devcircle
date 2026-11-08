'use client';

import { useEffect, useRef, useState } from 'react';
import { EmptyState, PersonRow, PixelInput, PostRow } from '@/core/ui';
import { search } from '../api';
import type { SearchResults } from '../types';

/** /search. Type to search; "#rust" searches tags only. Press "/" anywhere on the page to jump to the box. */
export default function SearchPage() {
  const input = useRef<HTMLInputElement>(null);
  const [q, setQ] = useState('');
  const [results, setResults] = useState<SearchResults | null>(null);
  const [state, setState] = useState<'idle' | 'loading' | 'error'>('idle');

  // Start from ?q= (so tag chips on other pages can link here).
  useEffect(() => {
    const initial = new URLSearchParams(window.location.search).get('q');
    if (initial) setQ(initial);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (e.key === '/' && tag !== 'INPUT' && tag !== 'TEXTAREA') {
        e.preventDefault();
        input.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Debounced search; older requests are cancelled so a slow reply never overwrites a newer one.
  useEffect(() => {
    const term = q.trim();
    if (term.length < 2) {
      setResults(null);
      setState('idle');
      return;
    }
    const ctrl = new AbortController();
    setState('loading');
    const timer = setTimeout(() => {
      window.history.replaceState(null, '', `/search?${new URLSearchParams({ q: term })}`);
      search(term, ctrl.signal)
        .then((r) => {
          setResults(r);
          setState('idle');
        })
        .catch(() => !ctrl.signal.aborted && setState('error'));
    }, 300);
    return () => {
      clearTimeout(timer);
      ctrl.abort();
    };
  }, [q]);

  const empty = results && results.posts.length === 0 && results.people.length === 0;

  return (
    <div>
      <h1 className="mb-4 font-display text-4xl">Search</h1>
      <PixelInput
        ref={input}
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search posts and developers. Try #rust or a username."
        aria-label="Search"
        maxLength={60}
        autoFocus
      />
      <p className="mb-6 mt-1 text-xs text-muted">Press / to focus · #tag searches tags only</p>

      {state === 'error' && <EmptyState title="Search failed" description="Check your connection and try again." mood="sleeping" />}
      {state === 'loading' && !results && <p className="text-sm text-muted">Searching…</p>}
      {empty && <EmptyState title="Nothing found" description={`No posts or developers match “${q.trim()}”.`} />}

      {results && results.people.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 font-display text-xl text-accent-strong">Developers</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {results.people.map((p) => (
              <PersonRow key={p.username} person={p} />
            ))}
          </div>
        </section>
      )}
      {results && results.posts.length > 0 && (
        <section>
          <h2 className="mb-3 font-display text-xl text-accent-strong">Posts</h2>
          <div className="space-y-4">
            {results.posts.map((p) => (
              <PostRow key={p.id} post={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
