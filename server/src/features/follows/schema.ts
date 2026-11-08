import { z } from 'zod';

export const usernameParam = z.object({ username: z.string().trim().toLowerCase().min(3).max(24) });
export const feedQuery = z.object({
  before: z.coerce.date().optional(),
  limit: z.coerce.number().int().min(1).max(30).default(15),
});
export type FeedQuery = z.infer<typeof feedQuery>;
