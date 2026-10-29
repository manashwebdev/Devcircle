import { AppError } from '../../core/errors';
import { events } from '../../core/events';
import { User, toPublicUser, type UserDoc } from '../../core/models/User';
import type { UpdateProfileInput } from './schema';

export async function getProfile(username: string) {
  const user = await User.findOne({ username, banned: false });
  if (!user) throw AppError.notFound('No developer with that username');
  return toPublicUser(user);
}

export async function updateProfile(user: UserDoc, patch: UpdateProfileInput) {
  // Changing username: make sure nobody else has it. (The unique index is the real guard against races.)
  if (patch.username && patch.username !== user.username) {
    if (await User.exists({ username: patch.username })) throw AppError.conflict('That username is taken');
  }
  user.set(patch);
  try {
    await user.save();
  } catch (err) {
    if ((err as { code?: number }).code === 11000) throw AppError.conflict('That username is taken');
    throw err;
  }
  events.emit('profile.updated', { userId: user.id });
  return toPublicUser(user);
}
