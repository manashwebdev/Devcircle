import type { ReactNode } from 'react';
import { cn } from './cn';

/** Boxed section with a solid accent border, like the cards on the reference site. `tag` is the small red chip before the title. */
export function PixelCard({
  title,
  tag,
  children,
  className,
  as: Tag = 'section',
}: {
  title?: string;
  tag?: string;
  children: ReactNode;
  className?: string;
  as?: 'section' | 'div' | 'article' | 'li';
}) {
  return (
    // Hover (as on the reference site): border turns white, title and tag light up, card lifts one step.
    <Tag className={cn('group border-2 border-accent/80 bg-surface p-4 shadow-pixel transition-[transform,box-shadow,border-color] duration-100 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:border-ink hover:shadow-pixel-lg', className)}>
      {title && (
        <h3 className="mb-3 flex items-center gap-2 border-b-2 border-accent/60 pb-2 font-display text-lg text-accent-strong group-hover:border-ink/60 group-hover:text-ink">
          {tag && <span className="bg-accent px-1.5 py-0.5 font-body text-[10px] text-on-accent group-hover:bg-ink group-hover:text-bg">{tag}</span>}
          {title}
        </h3>
      )}
      {children}
    </Tag>
  );
}
