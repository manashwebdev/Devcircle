import { previousDay } from '../../core/day';

export interface StreakState {
  current: number;
  longest: number;
  lastDay: string; // "YYYY-MM-DD" of the last counted day, or "" if none yet
}

/** Record activity on `day`. Returns a new state (or the same one if nothing changes). */
export function advance(state: StreakState, day: string): StreakState {
  if (state.lastDay === day) return state; // already counted today
  if (day < state.lastDay) return state; // an older day arriving late: ignore it
  // Consecutive day: +1. Any gap (or first ever): start again at 1.
  const current = state.lastDay === previousDay(day) ? state.current + 1 : 1;
  return { current, longest: Math.max(state.longest, current), lastDay: day };
}