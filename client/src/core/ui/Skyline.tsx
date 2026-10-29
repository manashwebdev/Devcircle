/** Faint pixel city skyline for hero backgrounds (echoes the reference site). Pure decoration. */
const HEIGHTS = [6, 10, 7, 14, 9, 5, 12, 8, 16, 7, 11, 6, 13, 9, 5, 15, 8, 10, 6, 12];

export function Skyline({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 20" preserveAspectRatio="xMidYMax slice" shapeRendering="crispEdges" aria-hidden className={className} style={{
        fill: 'rgb(var(--accent))',
        opacity: 0.14,
        // Fade the city out toward the bottom so it never fights the content on a light page.
        maskImage: 'linear-gradient(to bottom, black 35%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, black 35%, transparent 100%)',
      }}>
      {HEIGHTS.map((h, i) => (
        <g key={i}>
          <rect x={i * 4} y={20 - h} width={3} height={h} />
          {/* a couple of lit windows per building, in the background colour */}
          <rect x={i * 4 + 1} y={20 - h + 2} width={1} height={1} style={{ fill: 'rgb(var(--bg))' }} />
        </g>
      ))}
    </svg>
  );
}
