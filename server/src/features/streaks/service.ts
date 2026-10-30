import { canViewCircle } from '../../core/access';
import { dayKey, daysAgo, liveStreak } from '../../core/day';
import { AppError } from '../../core/errors';
import { User, type UserDoc } from '../../core/models/User';
import { advance } from './logic';
import { ActivityDay, CircleDay, CircleStreak } from './model';

const WEEKS = 17;
const WINDOW_DAYS = WEEKS * 7; // how much history the heatmap shows

// ---- Writing: called from the event listeners in index.ts ----

/** Someone checked in somewhere: remember the day and update their personal streak (stored on the User). */
export async function recordPersonalCheckin(userId: string, day: string) {
  await ActivityDay.updateOne({ userId, day }, { $set: { userId, day } }, { upsert: true });

  const user = await User.findById(userId).select('streak');
  if (!user) return;
  const prev = { current: user.streak?.current ?? 0, longest: user.streak?.longest ?? 0, lastDay: user.streak?.lastDay ?? '' };
  const next = advance(prev, day);
  if (next === prev) return; // a second check-in the same day changes nothing
  await User.updateOne(
    { _id: userId },
    { $set: { 'streak.current': next.current, 'streak.longest': next.longest, 'streak.lastDay': next.lastDay } },
  );
}

/** A whole circle checked in on `day`: remember it and grow the circle streak. */
export async function recordCircleDay(circleId: string, day: string) {
  await CircleDay.updateOne({ circleId, day }, { $set: { circleId, day } }, { upsert: true });

  const row = await CircleStreak.findOne({ circleId }).lean();
  const prev = { current: row?.current ?? 0, longest: row?.longest ?? 0, lastDay: row?.lastDay ?? '' };
  const next = advance(prev, day);
  if (next === prev) return;
  await CircleStreak.updateOne({ circleId }, { $set: next }, { upsert: true });
}

// ---- Reading: called from the controllers ----

export async function userStreak(username: string) {
  const user = await User.findOne({ username, banned: false }).select('streak');
  if (!user) throw AppError.notFound('No developer with that username');
  const today = dayKey();
  const live = liveStreak(user.streak?.current ?? 0, user.streak?.lastDay ?? '', today);
  const rows = await ActivityDay.find({ userId: user._id, day: { $gte: daysAgo(WINDOW_DAYS - 1) } })
    .select('day')
    .lean();
  return { today, current: live.current, longest: user.streak?.longest ?? 0, atRisk: live.atRisk, days: rows.map((r) => r.day) };
}

export async function circleStreak(user: UserDoc, circleId: string) {
  // Same rule as the circle page: members, or anyone if the circle is public. Otherwise "not found".
  if (!(await canViewCircle(user.id, circleId))) throw AppError.notFound('Circle not found');
  const today = dayKey();
  const row = await CircleStreak.findOne({ circleId }).lean();
  const live = liveStreak(row?.current ?? 0, row?.lastDay ?? '', today);
  const rows = await CircleDay.find({ circleId, day: { $gte: daysAgo(WINDOW_DAYS - 1) } })
    .select('day')
    .lean();
  return {
    today,
    current: live.current,
    longest: row?.longest ?? 0,
    atRisk: live.atRisk,
    todayDone: row?.lastDay === today,
    days: rows.map((r) => r.day),
  };
}