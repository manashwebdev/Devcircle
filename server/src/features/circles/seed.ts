import crypto from 'node:crypto';
import { User } from '../../core/models/User';
import { Circle } from './model';

/** One public demo circle ("Night Shift") with the five demo users. Safe to run twice. */
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
  console.log('[circles] seeded 1 demo circle');
}