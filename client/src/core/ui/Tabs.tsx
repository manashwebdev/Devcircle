'use client';

import { useId, useState, type KeyboardEvent, type ReactNode } from 'react';
import { cn } from './cn';

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
}

/** Accessible tabs: arrow keys move between tabs, Home/End jump to the ends. */
export function Tabs({ items, initial }: { items: TabItem[]; initial?: string }) {
  const [active, setActive] = useState(initial ?? items[0]?.id);
  const uid = useId();

  const onKey = (e: KeyboardEvent, index: number) => {
    const last = items.length - 1;
    const next = e.key === 'ArrowRight' ? (index + 1) % items.length : e.key === 'ArrowLeft' ? (index - 1 + items.length) % items.length : e.key === 'Home' ? 0 : e.key === 'End' ? last : -1;
    if (next < 0) return;
    e.preventDefault();
    const target = items[next];
    if (target) {
      setActive(target.id);
      document.getElementById(`${uid}-tab-${target.id}`)?.focus();
    }
  };

  return (
    <div>
      <div role="tablist" className="mb-4 flex flex-wrap gap-2 border-b-2 border-dashed border-line pb-3">
        {items.map((t, i) => (
          <button
            type="button"
            key={t.id}
            id={`${uid}-tab-${t.id}`}
            role="tab"
            aria-selected={active === t.id}
            aria-controls={`${uid}-panel-${t.id}`}
            tabIndex={active === t.id ? 0 : -1}
            onClick={() => setActive(t.id)}
            onKeyDown={(e) => onKey(e, i)}
            className={cn('border-2 border-dashed px-3 py-1 text-sm uppercase', active === t.id ? 'border-accent-strong bg-accent text-on-accent' : 'border-line text-muted hover:text-ink')}
          >
            {t.label}
          </button>
        ))}
      </div>
      {items.map((t) => (
        <div key={t.id} role="tabpanel" id={`${uid}-panel-${t.id}`} aria-labelledby={`${uid}-tab-${t.id}`} hidden={active !== t.id}>
          {active === t.id && t.content}
        </div>
      ))}
    </div>
  );
}
