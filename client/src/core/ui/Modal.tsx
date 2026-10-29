'use client';

import { useEffect, useRef, type ReactNode } from 'react';

/** Simple dialog: closes on Esc or backdrop click, focuses itself on open, and gives focus back on close. */
export function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    panel.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      previous?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-bg/80 p-4 sm:items-center" onMouseDown={onClose}>
      <div
        ref={panel}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onMouseDown={(e) => e.stopPropagation()}
        className="w-full max-w-md border-2 border-accent bg-surface p-5 shadow-pixel-lg"
      >
        <div className="mb-4 flex items-center justify-between gap-4 border-b-2 border-dashed border-line pb-2">
          <h2 className="font-display text-xl">{title}</h2>
          <button onClick={onClose} aria-label="Close" className="px-2 text-lg text-muted hover:text-ink">
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
