import { z } from 'zod';
import { REACTION_KINDS } from './model';

export const postIdParam = z.object({ postId: z.string().regex(/^[a-f\d]{24}$/i, 'invalid id') });
export const toggleBody = z.object({ kind: z.enum(REACTION_KINDS) }).strict();
export type ToggleInput = z.infer<typeof toggleBody>;
