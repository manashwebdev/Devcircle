import { z } from 'zod';

export const postIdParam = z.object({ postId: z.string().regex(/^[a-f\d]{24}$/i, 'invalid id') });
