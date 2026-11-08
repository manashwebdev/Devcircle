import { z } from 'zod';

const id = z.string().regex(/^[a-f\d]{24}$/i, 'invalid id');
export const idParam = z.object({ id });
export const usersQuery = z.object({ q: z.string().trim().max(40).optional() });
export const banBody = z.object({ banned: z.boolean() }).strict();
export const hiddenBody = z.object({ hidden: z.boolean() }).strict();
