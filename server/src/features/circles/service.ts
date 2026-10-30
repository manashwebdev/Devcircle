import crypto from 'node:crypto';
import { Types } from 'mongoose';
import type { CharacterId } from '../../core/constants';
import { AppError } from '../../core/errors';
import type { UserDoc } from '../../core/models/User';
import { Circle, MAX_MEMBERS, MIN_MEMBERS } from './model';
import type { CreateCircleInput } from './schema';

type Visibility = 'private' | 'public';

// Shapes of what MongoDB hands back (we use .lean(), so these are plain objects).
interface CircleLite {
  _id: Types.ObjectId;
  name: string;
  description: string;
  ownerId: Types.ObjectId;
  visibility: Visibility;
  members: { userId: Types.ObjectId }[];
}
interface CircleRow extends Omit<CircleLite, 'members'> {
  inviteCode: string;
  members: {
    userId: { _id: Types.ObjectId; username: string; displayName: string; character: CharacterId } | null;
    joinedAt: Date;
  }[];
}

const newCode = () => crypto.randomBytes(6).toString('base64url'); // 8 URL-safe characters
const statusOf = (count: number) => (count >= MIN_MEMBERS ? 'active' : 'forming');

/** Short version for lists. */
function toSummary(c: CircleLite, viewerId: string) {
  return {
    id: String(c._id),
    name: c.name,
    description: c.description,
    visibility: c.visibility,
    memberCount: c.members.length,
    status: statusOf(c.members.length),
    isOwner: String(c.ownerId) === viewerId,
    isMember: c.members.some((m) => String(m.userId) === viewerId),
  };
}

/** Full version for the circle page: who is in it, plus the invite code (members only). */
function toDetail(c: CircleRow, viewerId: string) {
  const members = c.members.flatMap((m) =>
    m.userId
      ? [
          {
            id: String(m.userId._id),
            username: m.userId.username,
            displayName: m.userId.displayName || m.userId.username,
            character: m.userId.character,
            joinedAt: m.joinedAt,
            isOwner: String(m.userId._id) === String(c.ownerId),
          },
        ]
      : [],
  );
  return {
    ...toSummary({ ...c, members: members.map((m) => ({ userId: new Types.ObjectId(m.id) })) }, viewerId),
    // Only members ever see the invite code, even in a public circle.
    inviteCode: members.some((m) => m.id === viewerId) ? c.inviteCode : null,
    minMembers: MIN_MEMBERS,
    maxMembers: MAX_MEMBERS,
    members,
  };
}

export async function listMyCircles(user: UserDoc) {
  const rows = (await Circle.find({ 'members.userId': user._id }).sort({ createdAt: -1 }).lean()) as unknown as CircleLite[];
  return rows.map((c) => toSummary(c, user.id));
}

/** Public circles anyone signed in can browse. */
export async function listPublicCircles(user: UserDoc) {
  const rows = (await Circle.find({ visibility: 'public' }).sort({ createdAt: -1 }).limit(30).lean()) as unknown as CircleLite[];
  return rows.map((c) => toSummary(c, user.id));
}

/** Members always see a circle. Everyone else only if the owner made it public; otherwise "not found". */
export async function getCircle(user: UserDoc, id: string) {
  const row = (await Circle.findById(id)
    .populate('members.userId', 'username displayName character')
    .lean()) as unknown as CircleRow | null;
  const isMember = row?.members.some((m) => m.userId && String(m.userId._id) === user.id);
  if (!row || (!isMember && row.visibility !== 'public')) throw AppError.notFound('Circle not found');
  return toDetail(row, user.id);
}

export async function createCircle(user: UserDoc, input: CreateCircleInput) {
  const circle = await Circle.create({
    ...input,
    ownerId: user._id,
    members: [{ userId: user._id }], // the creator is the first member
    inviteCode: newCode(),
  });
  return getCircle(user, circle.id);
}

/** What the invite page shows before you decide to join. */
export async function previewInvite(code: string) {
  const c = (await Circle.findOne({ inviteCode: code }).lean()) as unknown as CircleLite | null;
  if (!c) throw AppError.notFound('This invite link is not valid');
  return {
    name: c.name,
    description: c.description,
    memberCount: c.members.length,
    maxMembers: MAX_MEMBERS,
    full: c.members.length >= MAX_MEMBERS,
  };
}

export async function joinByCode(user: UserDoc, code: string) {
  const circle = await Circle.findOne({ inviteCode: code }).select('_id members.userId kicked').lean();
  if (!circle) throw AppError.notFound('This invite link is not valid');

  // Already in? Joining again is harmless: just show the circle.
  if (circle.members.some((m) => String(m.userId) === user.id)) return getCircle(user, String(circle._id));
  if (circle.kicked.some((k) => String(k) === user.id)) throw AppError.forbidden('You were removed from this circle');

  // ONE atomic update: it only matches while the circle has fewer than 8 members and you are not in it.
  // If two people join at the same instant, the database lets exactly one of them take the last seat.
  const updated = await Circle.findOneAndUpdate(
    {
      _id: circle._id,
      'members.userId': { $ne: user._id },
      kicked: { $ne: user._id },
      $expr: { $lt: [{ $size: '$members' }, MAX_MEMBERS] },
    },
    { $push: { members: { userId: user._id } } },
    { new: true },
  );
  if (!updated) throw AppError.conflict('This circle is full');
  return getCircle(user, updated.id);
}

export async function leaveCircle(user: UserDoc, id: string) {
  const circle = await Circle.findById(id);
  if (!circle || !circle.members.some((m) => String(m.userId) === user.id)) throw AppError.notFound('Circle not found');

  circle.set('members', circle.members.filter((m) => String(m.userId) !== user.id));

  // Last person out: delete the circle.
  if (circle.members.length === 0) {
    await circle.deleteOne();
    return { left: true };
  }
  // The owner left: the longest-standing remaining member (first in the list) becomes owner.
  if (String(circle.ownerId) === user.id) {
    const next = circle.members[0]?.userId;
    if (next) circle.ownerId = next;
  }
  await circle.save();
  return { left: true };
}

/** Owner removes someone. Kicked people cannot rejoin with the invite link. */
export async function kickMember(user: UserDoc, id: string, targetId: string) {
  const circle = await Circle.findById(id).select('ownerId members.userId').lean();
  if (!circle || !circle.members.some((m) => String(m.userId) === user.id)) throw AppError.notFound('Circle not found');
  if (String(circle.ownerId) !== user.id) throw AppError.forbidden('Only the owner can remove members');
  if (targetId === user.id) throw AppError.badRequest('Use "leave" to leave your own circle');
  if (!circle.members.some((m) => String(m.userId) === targetId)) throw AppError.notFound('That person is not in this circle');

  const target = new Types.ObjectId(targetId);
  await Circle.updateOne({ _id: id }, { $pull: { members: { userId: target } }, $addToSet: { kicked: target } });
  return { removed: true };
}

/** Owner switches a circle between private and public. */
export async function setVisibility(user: UserDoc, id: string, visibility: Visibility) {
  const circle = await Circle.findById(id).select('ownerId').lean();
  // Same error for "doesn't exist" and "not yours", so nothing is revealed.
  if (!circle || String(circle.ownerId) !== user.id) throw AppError.forbidden('Only the owner can change this');
  await Circle.updateOne({ _id: id }, { $set: { visibility } });
  return getCircle(user, id);
}