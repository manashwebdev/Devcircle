'use client';

import { useTheme } from '../theme/ThemeProvider';
import { cn } from '../ui';

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      className={cn('border-2 border-dashed border-line px-2 py-1 text-xs uppercase text-muted hover:text-ink', className)}
    >
      {theme === 'dark' ? 'Light' : 'Dark'}
    </button>
  );
}
