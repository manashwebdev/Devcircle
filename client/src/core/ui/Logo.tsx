import { cn } from './cn';

/** Pixel ring: the "circle" in DevCircle, built from squares. */
const RING = ['..#####..', '.##...##.', '##.....##', '#.......#', '#...#...#', '#.......#', '##.....##', '.##...##.', '..#####..'];

/** Black-and-white wordmark (it follows the text color, so it flips with the theme) + the pixel circle mark. */
export function Logo({ className, size = 22 }: { className?: string; size?: number }) {
  return (
    <span className={cn('inline-flex items-center gap-2 text-ink', className)}>
      <svg viewBox="0 0 9 9" width={size} height={size} shapeRendering="crispEdges" fill="currentColor" aria-hidden>
        {RING.flatMap((row, y) => [...row].map((c, x) => (c === '#' ? <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} /> : null)))}
      </svg>
      <span className="font-display text-xl font-semibold leading-none tracking-tight">DevCircle</span>
    </span>
  );
}
