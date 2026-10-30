import { api } from '@/core/api';
import type { CircleStreakInfo, StreakInfo } from './types';

export const getUserStreak = (username: string, signal?: AbortSignal) =>
  api<StreakInfo>(`/streaks/users/${encodeURIComponent(username)}`, { signal });

export const getCircleStreak = (circleId: string, signal?: AbortSignal) =>
  api<CircleStreakInfo>(`/streaks/circles/${circleId}`, { signal });