import { z } from 'zod';
import { CHARACTER_IDS } from '../../core/constants';

export const usernameParam = z.object({
  username: z.string().trim().toLowerCase().min(3).max(24).regex(/^[a-z0-9_-]+$/),
});

/** A tag like "typescript", "c++", "next.js". Lowercased so searching is predictable. */
const tag = z.string().trim().toLowerCase().min(1).max(24).regex(/^[a-z0-9.+#-]+$/, 'letters, numbers and . + # - only');

const link = z.object({
  label: z.string().trim().min(1).max(24),
  // Only http(s): blocks javascript: and data: links that could run script when clicked.
  url: z.string().trim().url().max(200).refine((u) => /^https?:\/\//i.test(u), 'must start with http(s)://'),
});

/** PATCH /api/profiles/me. Every field is optional; only what is sent is changed. */
export const updateProfileBody = z
  .object({
    username: usernameParam.shape.username,
    displayName: z.string().trim().max(50),
    bio: z.string().trim().max(280),
    character: z.enum(CHARACTER_IDS),
    techStack: z.array(tag).max(12).transform((t) => [...new Set(t)]),
    links: z.array(link).max(5),
  })
  .partial()
  .strict();

export type UpdateProfileInput = z.infer<typeof updateProfileBody>;
