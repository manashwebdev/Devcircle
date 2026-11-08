import Link from 'next/link';
import type { PersonLite } from '../types';
import { PixelAvatar } from './PixelAvatar';

/** Compact developer card for lists. `shared` highlights the technologies you have in common. */
export function PersonRow({ person, shared = [] }: { person: PersonLite; shared?: string[] }) {
  return (
    <Link
      href={`/u/${person.username}`}
      className="group flex items-start gap-3 border-2 border-dashed border-line bg-surface p-3 hover:border-ink"
    >
      <PixelAvatar character={person.character} size={44} />
      <div className="min-w-0">
        <div className="truncate font-display group-hover:text-accent-strong">
          {person.displayName} <span className="text-xs text-muted">@{person.username}</span>
        </div>
        {person.bio && <p className="line-clamp-2 text-sm text-muted">{person.bio}</p>}
        {person.techStack.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1">
            {person.techStack.slice(0, 6).map((t) => (
              <span key={t} className={shared.includes(t) ? 'border-2 border-dashed border-accent-strong px-1.5 text-xs text-accent-strong' : 'border-2 border-dashed border-line px-1.5 text-xs'}>
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
