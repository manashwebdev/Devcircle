import { z } from 'zod';

/** GET /api/search?q=react&scope=all|posts|people . A leading # means "tag only" (#rust). */
export const searchQuery = z.object({
  q: z.string().trim().min(2).max(60),
  scope: z.enum(['all', 'posts', 'people']).default('all'),
});
export type SearchQuery = z.infer<typeof searchQuery>;
