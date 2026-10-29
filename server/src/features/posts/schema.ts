import { z } from 'zod';
import { POST_REQUESTS, POST_TYPES } from './model';

const tag = z.string().trim().toLowerCase().min(1).max(24).regex(/^[a-z0-9.+#-]+$/, 'letters, numbers and . + # - only');
// Only http(s) links: blocks javascript: and data: URLs.
const httpUrl = z.string().trim().url().max(300).refine((u) => /^https?:\/\//i.test(u), 'must start with http(s)://');

export const createPostBody = z
  .object({
    type: z.enum(POST_TYPES),
    title: z.string().trim().min(3).max(120),
    body: z.string().trim().min(1).max(10000),
    tags: z.array(tag).max(8).default([]).transform((t) => [...new Set(t)]),
    // An empty string from the form means "no link".
    link: z.union([httpUrl, z.literal('')]).optional().transform((v) => v || undefined),
    request: z.enum(POST_REQUESTS).default('none'),
  })
  .strict();
export type CreatePostInput = z.infer<typeof createPostBody>;

/** GET /api/posts?type=&tag=&author=&before=&limit= . `before` is the cursor for "load more". */
export const listPostsQuery = z.object({
  type: z.enum(POST_TYPES).optional(),
  tag: tag.optional(),
  author: z.string().trim().toLowerCase().max(24).optional(),
  before: z.coerce.date().optional(),
  limit: z.coerce.number().int().min(1).max(30).default(15),
});
export type ListPostsQuery = z.infer<typeof listPostsQuery>;

export const postIdParam = z.object({ id: z.string().regex(/^[a-f\d]{24}$/i, 'invalid id') });
