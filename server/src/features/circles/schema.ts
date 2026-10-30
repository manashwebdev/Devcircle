import { z } from 'zod';

const visibility = z.enum(['private', 'public']);

export const createCircleBody = z
  .object({
    name: z.string().trim().min(3).max(40),
    description: z.string().trim().max(200).default(''),
    visibility: visibility.default('private'),
  })
  .strict(); // unknown fields (like ownerId) are rejected
export type CreateCircleInput = z.infer<typeof createCircleBody>;

export const updateCircleBody = z.object({ visibility }).strict();

// A MongoDB id is 24 hex characters.
const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'invalid id');

export const circleIdParam = z.object({ id: objectId });
export const kickParams = z.object({ id: objectId, userId: objectId });
export const inviteCodeParam = z.object({ code: z.string().regex(/^[A-Za-z0-9_-]{6,20}$/, 'invalid invite code') });

export const createCheckinBody = z
  .object({
    text: z.string().trim().min(3).max(280),
    // Only http(s) links, so nobody can plant a javascript: link.
    link: z
      .union([z.string().trim().url().max(300).refine((u) => /^https?:\/\//i.test(u), 'must start with http(s)://'), z.literal('')])
      .optional()
      .transform((v) => v || undefined),
  })
  .strict();
export type CreateCheckinInput = z.infer<typeof createCheckinBody>;

/** ?day=2026-10-30 (optional, defaults to today). */
export const dayQuery = z.object({ day: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional() });