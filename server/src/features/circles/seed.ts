import crypto from 'node:crypto';
import { dayKey } from '../../core/day';
import { User } from '../../core/models/User';
import { Checkin, Circle } from './model';

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

    // Three of the five members have checked in today.
    const circle = await Circle.findOne({ name: 'Night Shift', ownerId: ada._id }).select('_id').lean();
    if (circle) {
        const notes: Record<string, string> = {
            ada: 'Shipped the --watch flag for envdiff.',
            lin: 'Added the missing index. p95 is back to 20ms.',
            kai: 'Moved the settings page to a server component.',
        };
        for (const u of users.filter((x) => x.username in notes)) {
            await Checkin.updateOne(
                { circleId: circle._id, userId: u._id, day: dayKey() },
                { $setOnInsert: { text: notes[u.username] ?? 'Shipped something.' } },
                { upsert: true },
            );
        }
    }

    console.log('[circles] seeded 1 demo circle');
}