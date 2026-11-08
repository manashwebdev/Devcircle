import { z } from 'zod';

export const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'invalid id');
export const postIdParam = z.object({ postId: objectId });
export const commentIdParam = z.object({ id: objectId });

export const createCommentBody = z
  .object({
    body: z.string().trim().min(1).max(1500),
    parentId: objectId.optional(),
  })
  .strict();
export type CreateCommentInput = z.infer<typeof createCommentBody>;
