import { env } from './env';

/** The calendar day as "YYYY-MM-DD" in the configured timezone. ("en-CA" formats dates exactly like that.) */
export function dayKey(date: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: env.CHECKIN_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

/** Move a "YYYY-MM-DD" string by whole days. Noon UTC avoids daylight-saving edge cases. */
function shift(day: string, delta: number): string {
  const d = new Date(`${day}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + delta);
  return d.toISOString().slice(0, 10);
}

/** The day before a "YYYY-MM-DD" string. */
export const previousDay = (day: string) => shift(day, -1);

/** The day n days before `from` (default: today). */
export const daysAgo = (n: number, from: string = dayKey()) => shift(from, -n);

/**
 * A stored streak only says "current = 5, last counted day = X". Whether it is still alive depends on today:
 *  - last day is today        -> alive, safe
 *  - last day is yesterday    -> alive, but AT RISK (nothing done yet today)
 *  - anything older           -> broken, shows 0
 */
export function liveStreak(current: number, lastDay: string, today: string = dayKey()) {
  if (lastDay === today) return { current, atRisk: false };
  if (lastDay === previousDay(today)) return { current, atRisk: true };
  return { current: 0, atRisk: false };
}