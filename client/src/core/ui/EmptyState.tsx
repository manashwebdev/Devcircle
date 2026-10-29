import type { ReactNode } from 'react';
import { Mascot } from './Mascot';
import type { Mood } from './sprites';

/** For empty lists, errors and 404s. Say what happened and what to do next. */
export function EmptyState({
  title,
  description,
  mood = 'sleeping',
  action,
}: {
  title: string;
  description?: string;
  mood?: Mood;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-4 border-2 border-dashed border-line px-6 py-12 text-center">
      <Mascot mood={mood} size={96} />
      <h2 className="font-display text-2xl">{title}</h2>
      {description && <p className="max-w-md text-sm text-muted">{description}</p>}
      {action}
    </div>
  );
}
