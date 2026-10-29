import { Mascot } from './Mascot';
import type { Mood } from './sprites';
import type { CharacterId } from '../types';
import { cn } from './cn';

/** A user's avatar: their pixel character in a dashed frame. */
export function PixelAvatar({
  character,
  mood = 'idle',
  size = 48,
  animate = false,
  label,
  className,
}: {
  character: CharacterId;
  mood?: Mood;
  size?: number;
  animate?: boolean;
  label?: string;
  className?: string;
}) {
  return (
    <span
      className={cn('inline-block shrink-0 overflow-hidden border-2 border-dashed border-accent bg-surface-2', className)}
      style={{ width: size, height: size }}
    >
      <Mascot character={character} mood={mood} size={size - 4} animate={animate} label={label} />
    </span>
  );
}
