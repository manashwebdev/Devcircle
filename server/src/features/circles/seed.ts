import crypto from 'node:crypto';
import { dayKey, daysAgo } from '../../core/day';
import { events } from '../../core/events';
import { User } from '../../core/models/User';
import { Checkin, Circle } from './model';

const pause = (ms: number) => new Promise((r) => setTimeout(r, ms));
const NOTES = [
  'Shipped the --watch flag.',
  'Fixed a flaky test.',
  'Wrote docs for the CLI.',
  'Refactored the settings page.',
  'Added a missing index.',
  'Reviewed two pull requests.',
];

/** A public demo circle ("Night Shift") with the five demo users and six days of history. Safe to run twice. */
export async function seedCircles() {
  const users = await User.find({ username: { $in: ['ada', 'lin', 'kai', 'mira', 'ravi'] } })
    .select('_id username')
    .lean();
  const ada = users.find((u) => u.username === 'ada');
  if (!ada) return; // the profiles seed has not run yet

  await Circle.updateOne(
    { name: 'Night Shift', ownerId: ada._id },
    {
      $setOnInsert: {
        description: 'Ship something small every day.',
        visibility: 'public',
        members: users.map((u) => ({ userId: u._id })),
        inviteCode: crypto.randomBytes(6).toString('base64url'),
      },
    },
    { upsert: true },
  );
  const circle = await Circle.findOne({ name: 'Night Shift', ownerId: ada._id }).select('_id').lean();
  if (!circle) return;
  const circleId = String(circle._id);

  // The last six days: everyone checked in. Oldest first, because a streak depends on the order.
  for (let ago = 6; ago >= 1; ago--) {
    const day = daysAgo(ago);
    for (const [i, u] of users.entries()) {
      await Checkin.updateOne(
        { circleId: circle._id, userId: u._id, day },
        { $setOnInsert: { text: NOTES[(ago + i) % NOTES.length] ?? 'Shipped something.' } },
        { upsert: true },
      );
      events.emit('checkin.completed', { userId: String(u._id), circleId, day });
    }
    events.emit('circle.day.completed', { circleId, day });
    await pause(300); // events are handled in the background; wait so day N is counted before day N+1
  }

  // Today: only three of the five have checked in, so the circle streak is "at risk".
  const today = dayKey();
  const todayNotes: Record<string, string> = {
    ada: 'Shipped the --watch flag for envdiff.',
    lin: 'Added the missing index. p95 is back to 20ms.',
    kai: 'Moved the settings page to a server component.',
  };
  for (const u of users.filter((x) => x.username in todayNotes)) {
    await Checkin.updateOne(
      { circleId: circle._id, userId: u._id, day: today },
      { $setOnInsert: { text: todayNotes[u.username] ?? 'Shipped something.' } },
      { upsert: true },
    );
    events.emit('checkin.completed', { userId: String(u._id), circleId, day: today });
  }
  await pause(500); // let the last events finish before the script disconnects
  console.log('[circles] seeded 1 demo circle with 6 days of history');
}