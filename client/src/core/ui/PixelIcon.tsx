import { ICONS } from './sprites';

export type IconName = keyof typeof ICONS;

/** 7x7 pixel icon, painted with the current text color. */
export function PixelIcon({ name, size = 20 }: { name: IconName; size?: number }) {
  const rows: readonly string[] = ICONS[name] ?? ICONS.circles;
  return (
    <svg viewBox="0 0 7 7" width={size} height={size} shapeRendering="crispEdges" aria-hidden fill="currentColor">
      {rows.flatMap((row, y) => [...row].map((c, x) => (c === '#' ? <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} /> : null)))}
    </svg>
  );
}
