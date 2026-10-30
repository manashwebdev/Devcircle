import { cn } from './cn';

/** "2026-10-30" + n days, using noon UTC so daylight saving never shifts the date. */
function addDays(day: string, n: number): string {
  const d = new Date(`${day}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

/**
 * Calendar heatmap: `weeks` columns of 7 squares (Sunday on top). The last column holds `today`.
 * `days` is the list of active days ("YYYY-MM-DD"). Today is drawn with an outline.
 */
export function Heatmap({ days, today, weeks = 17, label }: { days: string[]; today: string; weeks?: number; label: string }) {
  const active = new Set(days);
  const weekday = new Date(`${today}T12:00:00Z`).getUTCDay(); // 0 = Sunday
  const first = addDays(today, -((weeks - 1) * 7 + weekday)); // the Sunday the grid starts on
  const columns = Array.from({ length: weeks }, (_, w) => Array.from({ length: 7 }, (_, d) => addDays(first, w * 7 + d)));

  return (
    <div role="img" aria-label={`${label}: ${active.size} active days in the last ${weeks} weeks`} className="overflow-x-auto pb-1">
      <div className="inline-flex gap-1">
        {columns.map((col, w) => (
          <div key={w} className="flex flex-col gap-1">
            {col.map((day) =>
              day > today ? (
                <span key={day} className="h-3 w-3" /> // days in the future stay empty
              ) : (
                <span
                  key={day}
                  title={`${day}${active.has(day) ? ': active' : ''}`}
                  className={cn('h-3 w-3 border', active.has(day) ? 'border-accent-strong bg-accent' : 'border-line/60 bg-surface-2', day === today && 'ring-2 ring-ink')}
                />
              ),
            )}
          </div>
        ))}
      </div>
    </div>
  );
}