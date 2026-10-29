import { cn } from './cn';
import { pixelFill, spriteRows, type Mood } from './sprites';
import type { CharacterId } from '../types';

/**
 * The pixel mascot, drawn as an SVG made of square <rect>s (no image files).
 * `animate` adds the stepped CSS animation for the mood (switched off by prefers-reduced-motion in globals.css).
 */
export function Mascot({
  character = 'ember',
  mood = 'idle',
  size = 96,
  animate = true,
  className,
  label,
}: {
  character?: CharacterId;
  mood?: Mood;
  size?: number;
  animate?: boolean;
  className?: string;
  label?: string;
}) {
  const rows = spriteRows(mood, character);
  return (
    <svg
      viewBox="0 0 12 12"
      width={size}
      height={size}
      shapeRendering="crispEdges"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn('block', animate && `mascot-${mood}`, className)}
    >
      {rows.flatMap((row, y) =>
        [...row].map((ch, x) => {
          const fill = pixelFill(ch, character);
          return fill ? <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} style={{ fill }} /> : null;
        }),
      )}
    </svg>
  );
}
