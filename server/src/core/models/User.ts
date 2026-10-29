import { Schema, model, type HydratedDocument, type InferSchemaType } from 'mongoose';
import { CHARACTER_IDS } from '../constants';

/**
 * User = account + public profile fields.
 * Core owns it (together with Session). Feature modules never define their own user model;
 * they store a userId and, if they need profile data, ask through the event bus or this model.
 */
const userSchema = new Schema(
  {
    // OAuth identities. "sparse unique" = unique only when the field exists.
    githubId: { type: String, unique: true, sparse: true },
    googleId: { type: String, unique: true, sparse: true },

    username: { type: String, required: true, unique: true, lowercase: true, trim: true, minlength: 3, maxlength: 24 },
    displayName: { type: String, trim: true, maxlength: 50, default: '' },
    email: { type: String, lowercase: true, trim: true, select: false },

    // Pixel character used as the avatar (we never store photos).
    character: { type: String, enum: CHARACTER_IDS, default: 'ember' },
    bio: { type: String, maxlength: 280, default: '' },
    links: {
      type: [{ _id: false, label: { type: String, maxlength: 24 }, url: { type: String, maxlength: 200 } }],
      default: [],
    },
    techStack: { type: [String], default: [] },

    // Written by the "streaks" module via the event bus. Stays at zero if that module is off.
    streak: {
      current: { type: Number, default: 0 },
      longest: { type: Number, default: 0 },
      lastDay: { type: String, default: '' }, // YYYY-MM-DD of the last proof-of-work
    },

    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    banned: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export type IUser = InferSchemaType<typeof userSchema>;
export type UserDoc = HydratedDocument<IUser>;
export const User = model('User', userSchema);

/** What any signed-in or anonymous visitor may see. Never add email / ids of OAuth providers here. */
export function toPublicUser(u: UserDoc) {
  return {
    id: u.id as string,
    username: u.username,
    displayName: u.displayName || u.username,
    character: u.character,
    bio: u.bio,
    links: u.links.map((l) => ({ label: l.label ?? '', url: l.url ?? '' })),
    techStack: u.techStack,
    streak: { current: u.streak?.current ?? 0, longest: u.streak?.longest ?? 0 },
    joinedAt: (u as unknown as { createdAt: Date }).createdAt,
  };
}
export type PublicUser = ReturnType<typeof toPublicUser>;
