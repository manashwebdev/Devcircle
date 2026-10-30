import type { Types } from 'mongoose';
import type { CharacterId } from '../../core/constants';
import { dayKey } from '../../core/day';
import { AppError } from '../../core/errors';
import { events } from '../../core/events';
import type { UserDoc } from '../../core/models/User';
import { Checkin, Circle, MIN_MEMBERS } from './model';
import type { CreateCheckinInput } from './schema';

interface Person {
  _id: Types.ObjectId;
  username: string;
  displayName: string;
  character: CharacterId;
}
interface CircleForCheckins {
  _id: Types.ObjectId;
  visibility: 'private' | 'public';
  members: { userId: Person | null }[];
}

const toPerson = (p: Person) => ({
  id: String(p._id),
  username: p.username,
  displayName: p.displayName || p.username,
  character: p.character,
});

/** Loads the circle with its members' names (needed for the "still waiting on" list). */
async function loadCircle(id: string) {
  const circle = (await Circle.findById(id)
    .select('visibility members')
    .populate('members.userId', 'username displayName character')
    .lean()) as unknown as CircleForCheckins | null;
  if (!circle) throw AppError.notFound('Circle not found');
  const members = circle.members.flatMap((m) => (m.userId ? [m.userId] : []));
  return { circle, members };
}

export async function postCheckin(user: UserDoc, circleId: string, input: CreateCheckinInput) {
  const { circle, members } = await loadCircle(circleId);
  // Non-members get "not found", the same as everywhere else in circles.
  if (!members.some((m) => String(m._id) === user.id)) throw AppError.notFound('Circle not found');

  const day = dayKey();
  try {
    await Checkin.create({ circleId: circle._id, userId: user._id, day, ...input });
  } catch (err) {
    // 11000 = MongoDB "duplicate key": the unique index caught a second check-in today.
    if ((err as { code?: number }).code === 11000) throw AppError.conflict('You already checked in today');
    throw err;
  }

  // Announce it. A streaks module can react to this without circles importing it.
  events.emit('checkin.completed', { userId: user.id, circleId: String(circle._id), day });

  // Did the whole circle check in today? Only counts for active circles (5+ members).
  if (members.length >= MIN_MEMBERS) {
    const done = await Checkin.countDocuments({ circleId: circle._id, day, userId: { $in: members.map((m) => m._id) } });
    if (done >= members.length) events.emit('circle.day.completed', { circleId: String(circle._id), day });
  }

  return listCheckins(user, circleId, day);
}

export async function listCheckins(user: UserDoc, circleId: string, day: string = dayKey()) {
  const { circle, members } = await loadCircle(circleId);
  const isMember = members.some((m) => String(m._id) === user.id);
  if (!isMember && circle.visibility !== 'public') throw AppError.notFound('Circle not found');

  const rows = (await Checkin.find({ circleId: circle._id, day })
    .sort({ createdAt: 1 })
    .populate('userId', 'username displayName character')
    .lean()) as unknown as { _id: Types.ObjectId; userId: Person | null; text: string; link?: string; createdAt: Date }[];

  const doneIds = new Set(rows.map((r) => (r.userId ? String(r.userId._id) : '')));
  return {
    day,
    isToday: day === dayKey(),
    isMember,
    checkedIn: doneIds.has(user.id),
    items: rows.flatMap((r) =>
      r.userId ? [{ id: String(r._id), text: r.text, link: r.link, createdAt: r.createdAt, author: toPerson(r.userId) }] : [],
    ),
    // "Miss a day and your circle sees it": members get the list of who is still missing.
    pending: isMember ? members.filter((m) => !doneIds.has(String(m._id))).map(toPerson) : [],
  };
}