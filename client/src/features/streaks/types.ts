/** What GET /api/streaks/users/:username returns. */
export interface StreakInfo {
  today: string;
  current: number;
  longest: number;
  atRisk: boolean;
  days: string[];
}

/** What GET /api/streaks/circles/:id returns. */
export interface CircleStreakInfo extends StreakInfo {
  todayDone: boolean;
}