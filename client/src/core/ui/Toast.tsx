'use client';

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { cn } from './cn';

type Kind = 'info' | 'success' | 'error';
interface ToastItem {
  id: number;
  text: string;
  kind: Kind;
}

const ToastContext = createContext<(text: string, kind?: Kind) => void>(() => {});

/** Wrap the app once; call `const toast = useToast(); toast('Saved', 'success')` anywhere. */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const push = useCallback((text: string, kind: Kind = 'info') => {
    const id = Date.now() + Math.random();
    setItems((prev) => [...prev, { id, text, kind }]);
    setTimeout(() => setItems((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);

  return (
    <ToastContext.Provider value={push}>
      {children}
      {/* Sits above the mobile bottom bar. role=status announces new toasts to screen readers. */}
      <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-20 z-[60] flex flex-col items-center gap-2 px-4 md:bottom-6">
        {items.map((t) => (
          <div
            key={t.id}
            className={cn(
              'pointer-events-auto border-2 border-dashed bg-surface px-4 py-2 text-sm shadow-pixel',
              t.kind === 'success' && 'border-accent-strong',
              t.kind === 'error' && 'border-accent bg-accent text-on-accent',
              t.kind === 'info' && 'border-line',
            )}
          >
            {t.text}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
